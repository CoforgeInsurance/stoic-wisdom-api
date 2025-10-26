mod handlers;
mod models;

use axum::{routing::get, Router};
use sqlx::{postgres::PgPool, sqlite::SqlitePool};
use std::env;
use std::sync::atomic::{AtomicBool, Ordering};
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

// Readiness flag shared across routes
static READY: AtomicBool = AtomicBool::new(false);

// Database pool enum to support both SQLite and PostgreSQL
#[derive(Clone)]
pub enum DbPool {
    Sqlite(SqlitePool),
    Postgres(PgPool),
}

impl DbPool {
    // Execute a query and fetch all results
    pub async fn query_fetch_all<'q, T>(
        &self,
        query: &'q str,
    ) -> Result<Vec<T>, sqlx::Error>
    where
        T: for<'r> sqlx::FromRow<'r, sqlx::sqlite::SqliteRow>
            + for<'r> sqlx::FromRow<'r, sqlx::postgres::PgRow>
            + Send
            + Unpin,
    {
        match self {
            DbPool::Sqlite(pool) => sqlx::query_as(query).fetch_all(pool).await,
            DbPool::Postgres(pool) => sqlx::query_as(query).fetch_all(pool).await,
        }
    }

    // Execute a query with a single bind parameter and fetch all results
    pub async fn query_bind_fetch_all<'q, T>(
        &self,
        query: &'q str,
        param: i64,
    ) -> Result<Vec<T>, sqlx::Error>
    where
        T: for<'r> sqlx::FromRow<'r, sqlx::sqlite::SqliteRow>
            + for<'r> sqlx::FromRow<'r, sqlx::postgres::PgRow>
            + Send
            + Unpin,
    {
        match self {
            DbPool::Sqlite(pool) => sqlx::query_as(query).bind(param).fetch_all(pool).await,
            DbPool::Postgres(pool) => sqlx::query_as(query).bind(param).fetch_all(pool).await,
        }
    }

    // Execute a query with a single bind parameter and fetch optional result
    pub async fn query_bind_fetch_optional<'q, T>(
        &self,
        query: &'q str,
        param: i64,
    ) -> Result<Option<T>, sqlx::Error>
    where
        T: for<'r> sqlx::FromRow<'r, sqlx::sqlite::SqliteRow>
            + for<'r> sqlx::FromRow<'r, sqlx::postgres::PgRow>
            + Send
            + Unpin,
    {
        match self {
            DbPool::Sqlite(pool) => sqlx::query_as(query).bind(param).fetch_optional(pool).await,
            DbPool::Postgres(pool) => sqlx::query_as(query).bind(param).fetch_optional(pool).await,
        }
    }
    
    // Get a reference to the underlying pool for complex queries
    pub fn sqlite_pool(&self) -> Option<&SqlitePool> {
        match self {
            DbPool::Sqlite(pool) => Some(pool),
            _ => None,
        }
    }
    
    pub fn postgres_pool(&self) -> Option<&PgPool> {
        match self {
            DbPool::Postgres(pool) => Some(pool),
            _ => None,
        }
    }
}

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "stoic_wisdom_api=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Database setup
    let database_url =
        env::var("DATABASE_URL").unwrap_or_else(|_| "sqlite:stoic_wisdom.db".to_string());

    let is_postgres = database_url.starts_with("postgres");
    
    tracing::info!(database_url = %database_url, is_postgres = %is_postgres, "Connecting to database");

    // Connect to database (supports both SQLite and PostgreSQL)
    let pool = if is_postgres {
        tracing::info!("Connecting to PostgreSQL");
        let pg_pool = sqlx::postgres::PgPoolOptions::new()
            .max_connections(5)
            .connect(&database_url)
            .await
            .expect("Failed to connect to PostgreSQL");
        DbPool::Postgres(pg_pool)
    } else {
        tracing::info!("Connecting to SQLite");
        let sqlite_pool = sqlx::sqlite::SqlitePoolOptions::new()
            .max_connections(5)
            .connect(&database_url)
            .await
            .unwrap_or_else(|e| {
                tracing::error!(error=?e, %database_url, "SQLite connection failed; falling back to in-memory");
                let fallback_url = "sqlite:file::memory:?cache=shared";
                futures::executor::block_on(async {
                    sqlx::sqlite::SqlitePoolOptions::new()
                        .max_connections(1)
                        .connect(fallback_url)
                        .await
                        .expect("Fallback in-memory connection failed")
                })
            });
        DbPool::Sqlite(sqlite_pool)
    };

    // Run migrations with a retry (helps transient file permission issues on cold start)
    let mut attempts = 0;
    loop {
        attempts += 1;
        let migration_result = match &pool {
            DbPool::Postgres(pg_pool) => sqlx::migrate!("./migrations").run(pg_pool).await,
            DbPool::Sqlite(sqlite_pool) => sqlx::migrate!("./migrations").run(sqlite_pool).await,
        };
        
        match migration_result {
            Ok(_) => break,
            Err(e) if attempts < 3 => {
                tracing::warn!(attempt=%attempts, error=?e, "Migration attempt failed; retrying in 500ms");
                tokio::time::sleep(std::time::Duration::from_millis(500)).await;
            }
            Err(e) => {
                tracing::error!(error=?e, attempts=%attempts, "Migrations failed after retries; aborting");
                panic!("Failed to run migrations: {e}");
            }
        }
    }

    tracing::info!("Running database migrations");
    READY.store(true, Ordering::Relaxed);
    
    // Verify tables exist with a simple query that works on both databases
    let table_count_result = match &pool {
        DbPool::Postgres(pg_pool) => {
            sqlx::query_scalar::<_, i64>("SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public'")
                .fetch_one(pg_pool)
                .await
        }
        DbPool::Sqlite(sqlite_pool) => {
            sqlx::query_scalar::<_, i64>("SELECT count(*) FROM sqlite_master WHERE type='table'")
                .fetch_one(sqlite_pool)
                .await
        }
    };
    
    if let Ok(count) = table_count_result {
        tracing::info!(table_count=%count, is_postgres=%is_postgres, "Post-migration table count");
    }
    tracing::info!("Database migrations completed successfully; readiness flag set");

    // Build CORS layer
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // Build router
    let app = Router::new()
        // Philosophers routes
        .route("/philosophers", get(handlers::list_philosophers))
        .route("/philosophers/:id", get(handlers::get_philosopher))
        .route(
            "/philosophers/:id/quotes",
            get(handlers::get_philosopher_with_quotes),
        )
        // Quotes routes
        .route("/quotes", get(handlers::list_quotes))
        .route("/quotes/random", get(handlers::get_random_quote))
        .route("/quotes/daily", get(handlers::get_daily_quote))
        // Themes routes
        .route("/themes", get(handlers::list_themes))
        .route("/themes/:id", get(handlers::get_theme))
        // Timeline route
        .route("/timeline", get(handlers::list_timeline))
        // Incidents routes
        .route("/incidents", get(handlers::list_incidents))
        .route("/incidents/:id", get(handlers::get_incident))
        // Health check
        .route("/health", get(health_handler))
        .route("/ready", get(readiness_handler))
        .layer(cors)
        .layer(TraceLayer::new_for_http())
        .with_state(pool);

    // Start server
    let port = env::var("PORT").unwrap_or_else(|_| "3000".to_string());
    let addr = format!("0.0.0.0:{}", port);
    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .expect("Failed to bind to address");

    tracing::info!("Server listening on {}", addr);

    axum::serve(listener, app)
        .await
        .expect("Server failed to start");
}

async fn health_handler(
    state: axum::extract::State<DbPool>,
) -> Result<String, axum::http::StatusCode> {
    // Simple query that works for both SQLite and PostgreSQL
    // Just check if we can query the philosophers table
    let check_result = match &*state {
        DbPool::Postgres(pg_pool) => {
            sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM philosophers")
                .fetch_one(pg_pool)
                .await
        }
        DbPool::Sqlite(sqlite_pool) => {
            sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM philosophers")
                .fetch_one(sqlite_pool)
                .await
        }
    };
    
    match check_result {
        Ok(_) => Ok("OK".to_string()),
        Err(_) => Err(axum::http::StatusCode::INTERNAL_SERVER_ERROR),
    }
}

async fn readiness_handler() -> &'static str {
    if READY.load(Ordering::Relaxed) {
        "READY"
    } else {
        "NOT_READY"
    }
}
