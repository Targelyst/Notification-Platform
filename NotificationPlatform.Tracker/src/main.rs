mod event_publisher;
mod identifiers;
mod options;
mod web;

use std::process::ExitCode;

use clap::Parser;
use event_publisher::notifier::init_event_publisher;
use tracing::error;

use crate::options::Options;
use crate::web::start_app;

#[tokio::main]
async fn main() -> ExitCode {
    tracing_subscriber::fmt::init();

    let options = Options::parse();

    match init_event_publisher(
        &options.db_user,
        &options.db_password,
        &options.db_host,
        &options.db_database,
        options.batch_size,
        options.timeout,
    )
    .await
    {
        Err(err) => {
            error!(error = %err, "error while initializing event publisher");
            ExitCode::FAILURE
        }
        Ok((tracked_notifier, proxied_notifier)) => {
            if let Err(err) = start_app(
                &options.address,
                &options.key,
                tracked_notifier,
                proxied_notifier,
            )
            .await
            {
                error!(error = %err, "error while starting application");
                ExitCode::FAILURE
            } else {
                ExitCode::SUCCESS
            }
        }
    }
}
