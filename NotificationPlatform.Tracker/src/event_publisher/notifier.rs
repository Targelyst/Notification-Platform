use std::time::Duration;

use tokio::sync::mpsc;

use super::publisher::{
    run_event_publisher, EventPublisher, EventPublisherInitializationError, ProxiedEvent,
    TrackedEvent,
};

#[derive(Clone)]
pub struct TrackedEventNotifier {
    sender: mpsc::Sender<TrackedEvent>,
}

#[derive(Clone)]
pub struct ProxiedEventNotifier {
    sender: mpsc::Sender<ProxiedEvent>,
}

pub async fn init_event_publisher(
    db_user: &str,
    db_password: &str,
    db_host: &str,
    db_database: &str,
    batch_size: usize,
    timeout: Duration,
) -> Result<(TrackedEventNotifier, ProxiedEventNotifier), EventPublisherInitializationError> {
    let (tracked_sender, tracked_receiver) = mpsc::channel(1000);
    let (proxied_sender, proxied_receiver) = mpsc::channel(1000);

    let publisher = EventPublisher::new(
        db_user,
        db_password,
        db_host,
        db_database,
        batch_size,
        tracked_receiver,
        proxied_receiver,
    )
    .await?;

    tokio::spawn(run_event_publisher(publisher, timeout));

    let tracked_notifier = TrackedEventNotifier {
        sender: tracked_sender,
    };
    let proxied_notifier = ProxiedEventNotifier {
        sender: proxied_sender,
    };

    Ok((tracked_notifier, proxied_notifier))
}

impl TrackedEventNotifier {
    pub async fn register_tracked_event(&self, event: TrackedEvent) {
        self.sender.send(event).await.unwrap()
    }
}

impl ProxiedEventNotifier {
    pub async fn register_proxied_event(&self, event: ProxiedEvent) {
        self.sender.send(event).await.unwrap()
    }
}
