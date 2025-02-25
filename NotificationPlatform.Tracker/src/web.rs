use std::sync::Arc;

use axum::{
    extract::{Path, State},
    response::{IntoResponse, Response},
    routing::get,
    Router,
};
use hyper::{header, StatusCode};
use opentelemetry::{global, metrics::Counter, KeyValue};
use sbee::Sbee;
use thiserror::Error;
use tokio::{io, net::TcpListener};
use tracing::{info, warn};

use crate::{
    identifiers::{Identifier, ProxyIdentifier, TrackIdentifier},
    telemetry::METER_NAME,
};

#[derive(Error, Debug)]
pub(crate) enum TrackerError {
    #[error("error while trying to listen on address")]
    ListenError(#[from] io::Error),
}

#[derive(Clone)]
struct AppState {
    sbee: Arc<Sbee>,
    tracker_counter: Counter<u64>,
    proxy_counter: Counter<u64>,
}

pub(crate) async fn start_app(address: &str, identifier_key: &[u8]) -> Result<(), TrackerError> {
    let meter = global::meter(METER_NAME);

    let sbee = Sbee::new(identifier_key.into());

    let state = AppState {
        sbee: Arc::new(sbee),
        tracker_counter: meter
            .u64_counter("impolar.notification_platform.tracked")
            .build(),
        proxy_counter: meter
            .u64_counter("impolar.notification_platform.proxied")
            .build(),
    };

    let app = Router::new()
        .route("/track/{identifier}", get(track_handler))
        .route("/proxy/{identifier}", get(proxy_handler))
        .with_state(state);

    let listener = TcpListener::bind(address).await?;
    info!(address, "server started");
    axum::serve(listener, app).await?;

    Ok(())
}

async fn track_handler(
    State(state): State<AppState>,
    Path(identifier): Path<String>,
) -> StatusCode {
    let identifier_decoded = TrackIdentifier::from_string(&state.sbee, &identifier);

    match identifier_decoded {
        Err(err) => {
            warn!(error = %err, "could not decode identifier");
            StatusCode::BAD_REQUEST
        }
        Ok(identifier) => {
            state.tracker_counter.add(
                1,
                &[
                    KeyValue::new("tenant", identifier.tenant),
                    KeyValue::new("receiver", identifier.receiver),
                    KeyValue::new("campaign", identifier.campaign),
                ],
            );
            StatusCode::OK
        }
    }
}

async fn proxy_handler(State(state): State<AppState>, Path(identifier): Path<String>) -> Response {
    let identifier_decoded = ProxyIdentifier::from_string(&state.sbee, &identifier);

    match identifier_decoded {
        Err(err) => {
            warn!(error = %err, "could not decode identifier");
            StatusCode::BAD_REQUEST.into_response()
        }
        Ok(identifier) => {
            state.proxy_counter.add(
                1,
                &[
                    KeyValue::new("tenant", identifier.tenant),
                    KeyValue::new("receiver", identifier.receiver),
                    KeyValue::new("campaign", identifier.campaign),
                    KeyValue::new("url", identifier.url.clone()),
                ],
            );
            (StatusCode::FOUND, [(header::LOCATION, identifier.url)]).into_response()
        }
    }
}
