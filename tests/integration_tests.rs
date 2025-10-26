use sqlx::sqlite::SqlitePoolOptions;

#[tokio::test]
async fn test_database_connection() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .expect("Failed to create in-memory database");

    // Verify we can query the database
    let result: i64 = sqlx::query_scalar("SELECT 1")
        .fetch_one(&pool)
        .await
        .expect("Failed to execute query");

    assert_eq!(result, 1);
}

#[tokio::test]
async fn test_philosophers_table_creation() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .expect("Failed to create in-memory database");

    // Run migrations (SQLite-specific)
    sqlx::migrate!("./migrations-sqlite")
        .run(&pool)
        .await
        .expect("Failed to run migrations");

    // Verify philosophers exist
    let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM philosophers")
        .fetch_one(&pool)
        .await
        .expect("Failed to count philosophers");

    assert_eq!(count, 3, "Should have 3 philosophers");
}

#[tokio::test]
async fn test_quotes_seeded() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .expect("Failed to create in-memory database");

    // Run migrations (SQLite-specific)
    sqlx::migrate!("./migrations-sqlite")
        .run(&pool)
        .await
        .expect("Failed to run migrations");

    // Verify quotes exist
    let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM quotes")
        .fetch_one(&pool)
        .await
        .expect("Failed to count quotes");

    assert!(count >= 75, "Should have at least 75 quotes, got {}", count);
}

#[tokio::test]
async fn test_themes_seeded() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .expect("Failed to create in-memory database");

    // Run migrations (SQLite-specific)
    sqlx::migrate!("./migrations-sqlite")
        .run(&pool)
        .await
        .expect("Failed to run migrations");

    // Verify themes exist
    let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM themes")
        .fetch_one(&pool)
        .await
        .expect("Failed to count themes");

    assert_eq!(count, 7, "Should have 7 themes");
}

#[tokio::test]
async fn test_timeline_seeded() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .expect("Failed to create in-memory database");

    // Run migrations (SQLite-specific)
    sqlx::migrate!("./migrations-sqlite")
        .run(&pool)
        .await
        .expect("Failed to run migrations");

    // Verify timeline events exist
    let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM timeline")
        .fetch_one(&pool)
        .await
        .expect("Failed to count timeline events");

    assert!(count >= 10, "Should have at least 10 timeline events");
}

#[tokio::test]
async fn test_incidents_seeded() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .expect("Failed to create in-memory database");

    // Run migrations (SQLite-specific)
    sqlx::migrate!("./migrations-sqlite")
        .run(&pool)
        .await
        .expect("Failed to run migrations");

    // Verify incidents exist
    let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM incidents")
        .fetch_one(&pool)
        .await
        .expect("Failed to count incidents");

    assert!(
        count >= 10,
        "Should have at least 10 incidents, got {}",
        count
    );
}
