mod handlers;
mod models;

use axum::{routing::get, Router};
use sqlx::postgres::PgPool;
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

    // Database setup - PostgreSQL only
    let database_url =
        env::var("DATABASE_URL").expect("DATABASE_URL must be set for PostgreSQL");
    
    tracing::info!(database_url = %database_url, "Connecting to PostgreSQL database");

    // Connect to PostgreSQL
    let pool = sqlx::postgres::PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to connect to PostgreSQL");

    // Run migrations with retry logic
    let mut attempts = 0;
    loop {
        attempts += 1;
        let migration_result = sqlx::migrate!("./migrations").run(&pool).await;
        
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

    READY.store(true, Ordering::Relaxed);
    
    // Verify tables exist
    let table_count: i64 = sqlx::query_scalar(
        "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public'"
    )
    .fetch_one(&pool)
    .await
    .expect("Failed to count tables");
    
    tracing::info!(table_count=%table_count, "Database migrations completed successfully");

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
    state: axum::extract::State<PgPool>,
) -> Result<String, axum::http::StatusCode> {
    // Check database connectivity
    let check_result = sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM philosophers")
        .fetch_one(&*state)
        .await;
    
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
