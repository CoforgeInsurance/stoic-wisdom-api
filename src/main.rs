mod handlers;
mod models;

use axum::{routing::get, Router};
use sqlx::sqlite::SqlitePoolOptions;
use std::env;
use std::sync::atomic::{AtomicBool, Ordering};
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

// Readiness flag shared across routes
static READY: AtomicBool = AtomicBool::new(false);

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

    // Detect any in-memory variant (covers :memory:, file::memory:, sqlite::memory:)
    let is_memory = database_url.to_ascii_lowercase().contains("memory");

    // Use a single connection for in-memory DB so migrations and queries share the same DB.
    let max_conns = if is_memory { 1 } else { 5 };
    tracing::info!(database_url = %database_url, is_memory=%is_memory, max_connections = %max_conns, "Initializing connection pool");

    // Attempt primary connection (file or memory)
    let pool = match SqlitePoolOptions::new()
        .max_connections(max_conns)
        .connect(&database_url)
        .await
    {
        Ok(p) => p,
        Err(e) => {
            tracing::error!(error=?e, %database_url, "Primary database connection failed; falling back to in-memory");
            let fallback_url = "sqlite:file::memory:?cache=shared".to_string();
            let fb_pool = SqlitePoolOptions::new()
                .max_connections(1)
                .connect(&fallback_url)
                .await
                .expect("Fallback in-memory connection failed");
            tracing::info!(fallback_url, "Using fallback in-memory database");
            fb_pool
        }
    };

    // Run migrations with a retry (helps transient file permission issues on cold start)
    let mut attempts = 0;
    loop {
        attempts += 1;
        match sqlx::migrate!("./migrations").run(&pool).await {
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
    // Count tables after migration for diagnostic purposes
    if let Ok(count) =
        sqlx::query_scalar::<_, i64>("SELECT count(*) FROM sqlite_master WHERE type='table'")
            .fetch_one(&pool)
            .await
    {
        tracing::info!(table_count=%count, "Post-migration table count");
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
    state: axum::extract::State<sqlx::SqlitePool>,
) -> Result<String, axum::http::StatusCode> {
    // Simple query to validate DB and a known table (philosophers) exists after migrations.
    let check =
        sqlx::query("SELECT name FROM sqlite_master WHERE type='table' AND name='philosophers'")
            .fetch_optional(&*state)
            .await
            .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)?;
    if check.is_some() {
        Ok("OK".to_string())
    } else {
        Err(axum::http::StatusCode::SERVICE_UNAVAILABLE)
    }
}

async fn readiness_handler() -> &'static str {
    if READY.load(Ordering::Relaxed) {
        "READY"
    } else {
        "NOT_READY"
    }
}
