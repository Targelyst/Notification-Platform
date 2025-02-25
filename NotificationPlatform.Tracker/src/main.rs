mod identifiers;
mod options;
mod telemetry;
mod web;

use std::process::ExitCode;

use clap::Parser;
use opentelemetry::KeyValue;
use opentelemetry::{global, InstrumentationScope};
use opentelemetry_appender_tracing::layer::OpenTelemetryTracingBridge;
use opentelemetry_sdk::logs::SdkLoggerProvider;
use opentelemetry_sdk::metrics::SdkMeterProvider;
use opentelemetry_sdk::trace::SdkTracerProvider;
use telemetry::{init_logs, init_metrics, init_traces};
use tracing::{error, info, warn};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, EnvFilter, Layer};

use crate::options::Options;
use crate::web::start_app;

const TRACKER_VERSION: &str = env!("CARGO_PKG_VERSION");

fn clean_up(
    tracer_provider: &SdkTracerProvider,
    logger_provider: &SdkLoggerProvider,
    meter_provider: &SdkMeterProvider,
) {
    if let Err(err) = tracer_provider
        .shutdown()
        .and_then(|_| meter_provider.shutdown())
        .and_then(|_| logger_provider.shutdown())
    {
        warn!(error = %err, "could not shut down telemetry providers");
    }
}

#[tokio::main]
async fn main() -> ExitCode {
    let options = Options::parse();

    let logger_provider = init_logs();

    let otel_layer = OpenTelemetryTracingBridge::new(&logger_provider);

    // For the OpenTelemetry layer, add a tracing filter to filter events from
    // OpenTelemetry and its dependent crates (opentelemetry-otlp uses crates
    // like reqwest/tonic etc.) from being sent back to OTel itself, thus
    // preventing infinite telemetry generation. The filter levels are set as
    // follows:
    // - Allow `info` level and above by default.
    // - Restrict `opentelemetry`, `hyper`, `tonic`, and `reqwest` completely.
    // Note: This will also drop events from crates like `tonic` etc. even when
    // they are used outside the OTLP Exporter. For more details, see:
    // https://github.com/open-telemetry/opentelemetry-rust/issues/761
    let filter_otel = EnvFilter::new("info")
        .add_directive("hyper=off".parse().unwrap())
        .add_directive("opentelemetry=off".parse().unwrap())
        .add_directive("tonic=off".parse().unwrap())
        .add_directive("h2=off".parse().unwrap())
        .add_directive("reqwest=off".parse().unwrap());
    let otel_layer = otel_layer.with_filter(filter_otel);

    let filter_fmt = EnvFilter::new("info").add_directive("opentelemetry=warn".parse().unwrap());
    let fmt_layer = tracing_subscriber::fmt::layer()
        .with_thread_names(true)
        .with_filter(filter_fmt);

    tracing_subscriber::registry()
        .with(otel_layer)
        .with(fmt_layer)
        .init();

    let tracer_provider = init_traces();
    global::set_tracer_provider(tracer_provider.clone());

    let meter_provider = init_metrics();
    global::set_meter_provider(meter_provider.clone());

    // let scope = InstrumentationScope::builder("basic")
    //     .with_version(TRACKER_VERSION)
    //     .build();

    // let tracer = global::tracer_with_scope(scope.clone());
    // let meter = global::meter_with_scope(scope);

    if let Err(err) = start_app(&options.address, &options.key).await {
        error!(error = %err, "error while starting application");

        clean_up(&tracer_provider, &logger_provider, &meter_provider);

        return ExitCode::FAILURE;
    }

    clean_up(&tracer_provider, &logger_provider, &meter_provider);

    ExitCode::SUCCESS
}
