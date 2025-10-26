use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use chrono::Datelike;
use rand::seq::SliceRandom;

use crate::models::*;
use crate::DbPool;

// Philosophers endpoints
pub async fn list_philosophers(
    State(pool): State<DbPool>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let philosophers = pool
        .query_fetch_all::<Philosopher>("SELECT * FROM philosophers ORDER BY name")
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(philosophers))
}

pub async fn get_philosopher(
    State(pool): State<DbPool>,
    Path(id): Path<i64>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let philosopher = pool
        .query_bind_fetch_optional::<Philosopher>("SELECT * FROM philosophers WHERE id = ?", id)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((StatusCode::NOT_FOUND, "Philosopher not found".to_string()))?;

    Ok(Json(philosopher))
}

pub async fn get_philosopher_with_quotes(
    State(pool): State<DbPool>,
    Path(id): Path<i64>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let philosopher = pool
        .query_bind_fetch_optional::<Philosopher>("SELECT * FROM philosophers WHERE id = ?", id)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((StatusCode::NOT_FOUND, "Philosopher not found".to_string()))?;

    let quotes = pool
        .query_bind_fetch_all::<Quote>("SELECT * FROM quotes WHERE philosopher_id = ?", id)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(PhilosopherWithQuotes {
        philosopher,
        quotes,
    }))
}

// Quotes endpoints
pub async fn list_quotes(
    State(pool): State<DbPool>,
    Query(params): Query<QuoteSearchParams>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    // Build base query
    let base_query = "SELECT q.id, q.philosopher_id, p.name as philosopher_name, q.text, q.source, q.context, q.modern_interpretation, q.full_text FROM quotes q JOIN philosophers p ON q.philosopher_id = p.id";
    
    let mut conditions = Vec::new();
    let mut bind_count = 0;

    if params.theme.is_some() {
        bind_count += 1;
        conditions.push(format!("q.id IN (SELECT quote_id FROM quote_themes qt JOIN themes t ON qt.theme_id = t.id WHERE t.name ILIKE ${bind_count})"));
    }

    if params.philosopher.is_some() {
        bind_count += 1;
        conditions.push(format!("p.name ILIKE ${bind_count}"));
    }

    if params.search.is_some() {
        bind_count += 1;
        let search_cond = bind_count;
        bind_count += 1;
        conditions.push(format!("(q.text ILIKE ${search_cond} OR q.modern_interpretation ILIKE ${bind_count})"));
    }

    let mut pg_query_str = base_query.to_string();
    if !conditions.is_empty() {
        pg_query_str.push_str(" WHERE ");
        pg_query_str.push_str(&conditions.join(" AND "));
    }
    pg_query_str.push_str(" ORDER BY q.id");

    // For SQLite, use LIKE instead of ILIKE
    let mut sqlite_query_str = pg_query_str.clone();
    sqlite_query_str = sqlite_query_str.replace("ILIKE", "LIKE");
    // Convert $N placeholders to ? for SQLite
    let mut placeholder_count = 0;
    let mut sqlite_query_final = String::new();
    let mut in_placeholder = false;
    for ch in sqlite_query_str.chars() {
        if ch == '$' {
            in_placeholder = true;
        } else if in_placeholder && ch.is_ascii_digit() {
            // Skip the digit, we'll just use ?
        } else {
            if in_placeholder {
                sqlite_query_final.push('?');
                placeholder_count += 1;
            }
            in_placeholder = false;
            sqlite_query_final.push(ch);
        }
    }
    if in_placeholder {
        sqlite_query_final.push('?');
    }

    let quotes = match &pool {
        DbPool::Sqlite(sqlite_pool) => {
            let mut query = sqlx::query_as::<_, QuoteWithPhilosopher>(&sqlite_query_final);
            if let Some(theme) = params.theme {
                query = query.bind(format!("%{}%", theme));
            }
            if let Some(philosopher) = params.philosopher {
                query = query.bind(format!("%{}%", philosopher));
            }
            if let Some(search) = &params.search {
                query = query.bind(format!("%{}%", search)).bind(format!("%{}%", search));
            }
            query.fetch_all(sqlite_pool).await
        }
        DbPool::Postgres(pg_pool) => {
            let mut query = sqlx::query_as::<_, QuoteWithPhilosopher>(&pg_query_str);
            if let Some(theme) = params.theme {
                query = query.bind(format!("%{}%", theme));
            }
            if let Some(philosopher) = params.philosopher {
                query = query.bind(format!("%{}%", philosopher));
            }
            if let Some(search) = &params.search {
                query = query.bind(format!("%{}%", search)).bind(format!("%{}%", search));
            }
            query.fetch_all(pg_pool).await
        }
    }
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(quotes))
}

pub async fn get_random_quote(
    State(pool): State<DbPool>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let quotes = pool
        .query_fetch_all::<QuoteWithPhilosopher>(
            "SELECT q.id, q.philosopher_id, p.name as philosopher_name, q.text, q.source, q.context, q.modern_interpretation 
             FROM quotes q 
             JOIN philosophers p ON q.philosopher_id = p.id"
        )
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let quote = quotes
        .choose(&mut rand::thread_rng())
        .ok_or((StatusCode::NOT_FOUND, "No quotes found".to_string()))?
        .clone();

    Ok(Json(quote))
}

pub async fn get_daily_quote(
    State(pool): State<DbPool>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    // Use day of year to select a consistent quote for the day
    let day_of_year = chrono::Utc::now().ordinal();

    let quotes = pool
        .query_fetch_all::<QuoteWithPhilosopher>(
            "SELECT q.id, q.philosopher_id, p.name as philosopher_name, q.text, q.source, q.context, q.modern_interpretation 
             FROM quotes q 
             JOIN philosophers p ON q.philosopher_id = p.id 
             ORDER BY q.id"
        )
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    if quotes.is_empty() {
        return Err((StatusCode::NOT_FOUND, "No quotes found".to_string()));
    }

    let index = (day_of_year as usize - 1) % quotes.len();
    let quote = quotes[index].clone();
    Ok(Json(quote))
}

// Themes endpoints
pub async fn list_themes(
    State(pool): State<DbPool>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let themes = pool
        .query_fetch_all::<Theme>("SELECT * FROM themes ORDER BY name")
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(themes))
}

pub async fn get_theme(
    State(pool): State<DbPool>,
    Path(id): Path<i64>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let theme = pool
        .query_bind_fetch_optional::<Theme>("SELECT * FROM themes WHERE id = ?", id)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((StatusCode::NOT_FOUND, "Theme not found".to_string()))?;

    Ok(Json(theme))
}

// Timeline endpoints
pub async fn list_timeline(
    State(pool): State<DbPool>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let events = pool
        .query_fetch_all::<TimelineEvent>("SELECT * FROM timeline ORDER BY year")
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(events))
}

// Incidents endpoints
pub async fn list_incidents(
    State(pool): State<DbPool>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let incidents = pool
        .query_fetch_all::<IncidentWithPhilosopher>(
            "SELECT i.*, p.name as philosopher_name 
             FROM incidents i 
             LEFT JOIN philosophers p ON i.philosopher_id = p.id 
             ORDER BY i.year"
        )
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(incidents))
}

pub async fn get_incident(
    State(pool): State<DbPool>,
    Path(id): Path<i64>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let incident = pool
        .query_bind_fetch_optional::<IncidentWithPhilosopher>(
            "SELECT i.*, p.name as philosopher_name 
             FROM incidents i 
             LEFT JOIN philosophers p ON i.philosopher_id = p.id 
             WHERE i.id = ?",
            id
        )
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((StatusCode::NOT_FOUND, "Incident not found".to_string()))?;

    Ok(Json(incident))
}
