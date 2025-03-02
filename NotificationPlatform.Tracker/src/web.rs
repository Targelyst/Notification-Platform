use std::sync::Arc;

use axum::{
    extract::{Path, State},
    http::{header, StatusCode},
    response::{IntoResponse, Response},
    routing::get,
    Router,
};
use sbee::Sbee;
use thiserror::Error;
use time::OffsetDateTime;
use tokio::{io, net::TcpListener};
use tracing::{info, warn};

use crate::{
    event_publisher::{
        notifier::{ProxiedEventNotifier, TrackedEventNotifier},
        publisher::{ProxiedEvent, TrackedEvent},
    },
    identifiers::{Identifier, ProxyIdentifier, TrackIdentifier},
};

const TRACKING_PIXEL_CONTENT: [u8; 68] = [
    137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 4, 0,
    0, 0, 181, 28, 12, 2, 0, 0, 0, 11, 73, 68, 65, 84, 120, 218, 99, 100, 96, 0, 0, 0, 6, 0, 2, 48,
    129, 208, 47, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130,
];

const MIME_TYPE_PNG: &str = "image/png";

#[derive(Error, Debug)]
pub(crate) enum TrackerError {
    #[error("error while trying to listen on address")]
    ListenError(#[from] io::Error),
}

#[derive(Clone)]
struct AppState {
    sbee: Arc<Sbee>,
    tracked_notifier: TrackedEventNotifier,
    proxied_notifier: ProxiedEventNotifier,
}

pub(crate) async fn start_app(
    address: &str,
    identifier_key: &[u8],
    tracked_notifier: TrackedEventNotifier,
    proxied_notifier: ProxiedEventNotifier,
) -> Result<(), TrackerError> {
    let sbee = Sbee::new(identifier_key.into());

    let state = AppState {
        sbee: Arc::new(sbee),
        tracked_notifier,
        proxied_notifier,
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

async fn track_handler(State(state): State<AppState>, Path(identifier): Path<String>) -> Response {
    let identifier_decoded = TrackIdentifier::from_string(&state.sbee, &identifier);

    match identifier_decoded {
        Err(err) => {
            warn!(error = %err, "could not decode identifier");
            StatusCode::BAD_REQUEST.into_response()
        }
        Ok(identifier) => {
            state
                .tracked_notifier
                .register_tracked_event(TrackedEvent {
                    time: OffsetDateTime::now_utc(),
                    tenant: identifier.tenant,
                    contact: identifier.contact,
                })
                .await;

            let headers = [(header::CONTENT_TYPE, MIME_TYPE_PNG)];
            (headers, TRACKING_PIXEL_CONTENT).into_response()
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
            state
                .proxied_notifier
                .register_proxied_event(ProxiedEvent {
                    time: OffsetDateTime::now_utc(),
                    tenant: identifier.tenant,
                    contact: identifier.contact,
                    url: identifier.url.clone(),
                })
                .await;
            (StatusCode::FOUND, [(header::LOCATION, identifier.url)]).into_response()
        }
    }
}
