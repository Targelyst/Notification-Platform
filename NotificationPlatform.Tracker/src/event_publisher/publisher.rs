use std::{cmp::max, time::Duration};

use ::time::OffsetDateTime;
use itertools::Itertools;
use sqlx::{postgres::PgPoolOptions, Pool, Postgres, QueryBuilder};
use thiserror::Error;
use tokio::{
    sync::mpsc::{self},
    time,
};
use tracing::error;
use uuid::Uuid;

pub(crate) struct TrackedEvent {
    pub time: OffsetDateTime,
    pub tenant: String,
    pub contact: Uuid,
}

pub(crate) struct ProxiedEvent {
    pub time: OffsetDateTime,
    pub tenant: String,
    pub contact: Uuid,
    pub url: String,
}

#[derive(Debug, Error)]
pub enum EventPublisherInitializationError {
    #[error("error while initializing postgresql database connection: {0}")]
    PgInitializationError(#[from] sqlx::Error),
}

pub(crate) struct EventPublisher {
    pool: Pool<Postgres>,
    tracked_receiver: mpsc::Receiver<TrackedEvent>,
    proxied_receiver: mpsc::Receiver<ProxiedEvent>,
    tracked_buffer: Vec<TrackedEvent>,
    proxied_buffer: Vec<ProxiedEvent>,
    batch_size: usize,
}

impl EventPublisher {
    pub(crate) async fn new(
        db_user: &str,
        db_password: &str,
        db_host: &str,
        db_database: &str,
        batch_size: usize,
        tracked_receiver: mpsc::Receiver<TrackedEvent>,
        proxied_receiver: mpsc::Receiver<ProxiedEvent>,
    ) -> Result<Self, EventPublisherInitializationError> {
        let pool = PgPoolOptions::new()
            .max_connections(5)
            .connect(&format!(
                "postgres://{}:{}@{}/{}",
                db_user, db_password, db_host, db_database
            ))
            .await?;

        let publisher = EventPublisher {
            pool,
            tracked_receiver,
            proxied_receiver,
            tracked_buffer: Vec::with_capacity(batch_size),
            proxied_buffer: Vec::with_capacity(batch_size),
            batch_size,
        };

        Ok(publisher)
    }

    async fn queue_tracked_event(&mut self, event: TrackedEvent) {
        self.tracked_buffer.push(event);

        if self.tracked_buffer.len() >= self.batch_size {
            self.flush_tracked().await;
        }
    }

    async fn queue_proxied_event(&mut self, event: ProxiedEvent) {
        self.proxied_buffer.push(event);

        if self.proxied_buffer.len() >= self.batch_size {
            self.flush_proxied().await;
        }
    }

    async fn flush_tracked(&mut self) {
        if !self.tracked_buffer.is_empty() {
            if let Err(err) = self.write_tracked_events(&self.tracked_buffer).await {
                error!(error = %err, "could not write tracked events to database");
            }
            self.tracked_buffer.clear();
        }
    }

    async fn flush_proxied(&mut self) {
        if !self.proxied_buffer.is_empty() {
            if let Err(err) = self.write_proxied_events(&self.proxied_buffer).await {
                error!(error = %err, "could not write proxied events to database");
            }
            self.proxied_buffer.clear();
        }
    }

    async fn write_tracked_events(&self, events: &[TrackedEvent]) -> Result<(), sqlx::Error> {
        let mut query_builder = QueryBuilder::new(
            r#"INSERT INTO "TrackedEvents" ("Time", "Tenant", "ContactId", "Value") "#,
        );

        let chunks = events.iter().chunk_by(|e| (&e.tenant, &e.contact));

        let groups = chunks.into_iter().map(|(key, group)| {
            let mut count = 0;
            let mut time = OffsetDateTime::now_utc();

            for e in group {
                count += 1;
                time = max(time, e.time);
            }

            (time, key.0, key.1, count)
        });

        query_builder.push_values(groups, |mut b, new_event| {
            b.push_bind(new_event.0)
                .push_bind(new_event.1)
                .push_bind(new_event.2)
                .push_bind(new_event.3);
        });

        let query = query_builder.build();
        query.execute(&self.pool).await?;

        Ok(())
    }

    async fn write_proxied_events(&self, events: &[ProxiedEvent]) -> Result<(), sqlx::Error> {
        let mut query_builder = QueryBuilder::new(
            r#"INSERT INTO "ProxiedEvents" ("Time", "Tenant", "ContactId", "Url", "Value") "#,
        );

        let chunks = events.iter().chunk_by(|e| (&e.tenant, &e.contact, &e.url));

        let groups = chunks.into_iter().map(|(key, group)| {
            let mut count = 0;
            let mut time = OffsetDateTime::now_utc();

            for e in group {
                count += 1;
                time = max(time, e.time);
            }

            (time, key.0, key.1, key.2, count)
        });

        query_builder.push_values(groups, |mut b, new_event| {
            b.push_bind(new_event.0)
                .push_bind(new_event.1)
                .push_bind(new_event.2)
                .push_bind(new_event.3)
                .push_bind(new_event.4);
        });

        let query = query_builder.build();
        query.execute(&self.pool).await?;

        Ok(())
    }
}

pub async fn run_event_publisher(mut publisher: EventPublisher, timeout: Duration) {
    let mut timeout = time::interval(timeout);

    loop {
        tokio::select! {
            _ = timeout.tick() => {
                publisher.flush_tracked().await;
                publisher.flush_proxied().await;
            },
            Some(event) = publisher.tracked_receiver.recv() => {
                publisher.queue_tracked_event(event).await;
            },
            Some(event) = publisher.proxied_receiver.recv() => {
                publisher.queue_proxied_event(event).await;
            },
            else => break,
        }
    }
}
