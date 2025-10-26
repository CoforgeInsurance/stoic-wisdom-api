use axum::{use axum::{

    extract::{Path, Query, State},    extract::{Path, Query, State},

    http::StatusCode,    http::StatusCode,

    response::IntoResponse,    response::IntoResponse,

    Json,    Json,

};};

use chrono::Datelike;use chrono::Datelike;

use rand::seq::SliceRandom;use rand::seq::SliceRandom;

use sqlx::postgres::PgPool;

use crate::models::*;

use crate::models::*;use crate::DbPool;



// Philosophers endpoints// Philosophers endpoints

pub async fn list_philosophers(pub async fn list_philosophers(

    State(pool): State<PgPool>,    State(pool): State<DbPool>,

) -> Result<impl IntoResponse, (StatusCode, String)> {) -> Result<impl IntoResponse, (StatusCode, String)> {

    let philosophers = sqlx::query_as::<_, Philosopher>("SELECT * FROM philosophers ORDER BY name")    let philosophers = pool

        .fetch_all(&pool)        .query_fetch_all::<Philosopher>("SELECT * FROM philosophers ORDER BY name")

        .await        .await

        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;



    Ok(Json(philosophers))    Ok(Json(philosophers))

}}



pub async fn get_philosopher(pub async fn get_philosopher(

    State(pool): State<PgPool>,    State(pool): State<DbPool>,

    Path(id): Path<i64>,    Path(id): Path<i64>,

) -> Result<impl IntoResponse, (StatusCode, String)> {) -> Result<impl IntoResponse, (StatusCode, String)> {

    let philosopher = sqlx::query_as::<_, Philosopher>("SELECT * FROM philosophers WHERE id = $1")    let philosopher = pool

        .bind(id)        .query_bind_fetch_optional::<Philosopher>("SELECT * FROM philosophers WHERE id = ?", id)

        .fetch_optional(&pool)        .await

        .await        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?

        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?        .ok_or((StatusCode::NOT_FOUND, "Philosopher not found".to_string()))?;

        .ok_or((StatusCode::NOT_FOUND, "Philosopher not found".to_string()))?;

    Ok(Json(philosopher))

    Ok(Json(philosopher))}

}

pub async fn get_philosopher_with_quotes(

pub async fn get_philosopher_with_quotes(    State(pool): State<DbPool>,

    State(pool): State<PgPool>,    Path(id): Path<i64>,

    Path(id): Path<i64>,) -> Result<impl IntoResponse, (StatusCode, String)> {

) -> Result<impl IntoResponse, (StatusCode, String)> {    let philosopher = pool

    let philosopher = sqlx::query_as::<_, Philosopher>("SELECT * FROM philosophers WHERE id = $1")        .query_bind_fetch_optional::<Philosopher>("SELECT * FROM philosophers WHERE id = ?", id)

        .bind(id)        .await

        .fetch_optional(&pool)        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?

        .await        .ok_or((StatusCode::NOT_FOUND, "Philosopher not found".to_string()))?;

        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?

        .ok_or((StatusCode::NOT_FOUND, "Philosopher not found".to_string()))?;    let quotes = pool

        .query_bind_fetch_all::<Quote>("SELECT * FROM quotes WHERE philosopher_id = ?", id)

    let quotes = sqlx::query_as::<_, Quote>("SELECT * FROM quotes WHERE philosopher_id = $1")        .await

        .bind(id)        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

        .fetch_all(&pool)

        .await    Ok(Json(PhilosopherWithQuotes {

        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;        philosopher,

        quotes,

    Ok(Json(PhilosopherWithQuotes {    }))

        philosopher,}

        quotes,

    }))// Quotes endpoints

}pub async fn list_quotes(

    State(pool): State<DbPool>,

// Quotes endpoints    Query(params): Query<QuoteSearchParams>,

pub async fn list_quotes() -> Result<impl IntoResponse, (StatusCode, String)> {

    State(pool): State<PgPool>,    // Build base query

    Query(params): Query<QuoteSearchParams>,    let base_query = "SELECT q.id, q.philosopher_id, p.name as philosopher_name, q.text, q.source, q.context, q.modern_interpretation, q.full_text FROM quotes q JOIN philosophers p ON q.philosopher_id = p.id";

) -> Result<impl IntoResponse, (StatusCode, String)> {    

    // Build base query    let mut conditions = Vec::new();

    let base_query = "SELECT q.id, q.philosopher_id, p.name as philosopher_name, q.text, q.source, q.context, q.modern_interpretation, q.full_text FROM quotes q JOIN philosophers p ON q.philosopher_id = p.id";    let mut bind_count = 0;

    

    let mut conditions = Vec::new();    if params.theme.is_some() {

    let mut bind_values: Vec<String> = Vec::new();        bind_count += 1;

    let mut param_counter = 1;        conditions.push(format!("q.id IN (SELECT quote_id FROM quote_themes qt JOIN themes t ON qt.theme_id = t.id WHERE t.name ILIKE ${bind_count})"));

    }

    if let Some(theme) = params.theme {

        conditions.push(format!("q.id IN (SELECT quote_id FROM quote_themes qt JOIN themes t ON qt.theme_id = t.id WHERE t.name ILIKE ${})", param_counter));    if params.philosopher.is_some() {

        bind_values.push(format!("%{}%", theme));        bind_count += 1;

        param_counter += 1;        conditions.push(format!("p.name ILIKE ${bind_count}"));

    }    }



    if let Some(philosopher) = params.philosopher {    if params.search.is_some() {

        conditions.push(format!("p.name ILIKE ${}", param_counter));        bind_count += 1;

        bind_values.push(format!("%{}%", philosopher));        let search_cond = bind_count;

        param_counter += 1;        bind_count += 1;

    }        conditions.push(format!("(q.text ILIKE ${search_cond} OR q.modern_interpretation ILIKE ${bind_count})"));

    }

    if let Some(search) = params.search {

        conditions.push(format!("(q.text ILIKE ${} OR q.modern_interpretation ILIKE ${})", param_counter, param_counter + 1));    let mut pg_query_str = base_query.to_string();

        let search_pattern = format!("%{}%", search);    if !conditions.is_empty() {

        bind_values.push(search_pattern.clone());        pg_query_str.push_str(" WHERE ");

        bind_values.push(search_pattern);        pg_query_str.push_str(&conditions.join(" AND "));

    }    }

    pg_query_str.push_str(" ORDER BY q.id");

    let mut query_str = base_query.to_string();

    if !conditions.is_empty() {    // For SQLite, use LIKE instead of ILIKE

        query_str.push_str(" WHERE ");    let mut sqlite_query_str = pg_query_str.clone();

        query_str.push_str(&conditions.join(" AND "));    sqlite_query_str = sqlite_query_str.replace("ILIKE", "LIKE");

    }    // Convert $N placeholders to ? for SQLite

    query_str.push_str(" ORDER BY q.id");    let mut placeholder_count = 0;

    let mut sqlite_query_final = String::new();

    let mut query = sqlx::query_as::<_, QuoteWithPhilosopher>(&query_str);    let mut in_placeholder = false;

    for value in bind_values {    for ch in sqlite_query_str.chars() {

        query = query.bind(value);        if ch == '$' {

    }            in_placeholder = true;

        } else if in_placeholder && ch.is_ascii_digit() {

    let quotes = query            // Skip the digit, we'll just use ?

        .fetch_all(&pool)        } else {

        .await            if in_placeholder {

        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;                sqlite_query_final.push('?');

                placeholder_count += 1;

    Ok(Json(quotes))            }

}            in_placeholder = false;

            sqlite_query_final.push(ch);

pub async fn get_random_quote(        }

    State(pool): State<PgPool>,    }

) -> Result<impl IntoResponse, (StatusCode, String)> {    if in_placeholder {

    let quotes = sqlx::query_as::<_, QuoteWithPhilosopher>(        sqlite_query_final.push('?');

        "SELECT q.id, q.philosopher_id, p.name as philosopher_name, q.text, q.source, q.context, q.modern_interpretation, q.full_text    }

         FROM quotes q 

         JOIN philosophers p ON q.philosopher_id = p.id"    let quotes = match &pool {

    )        DbPool::Sqlite(sqlite_pool) => {

    .fetch_all(&pool)            let mut query = sqlx::query_as::<_, QuoteWithPhilosopher>(&sqlite_query_final);

    .await            if let Some(theme) = params.theme {

    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;                query = query.bind(format!("%{}%", theme));

            }

    let quote = quotes            if let Some(philosopher) = params.philosopher {

        .choose(&mut rand::thread_rng())                query = query.bind(format!("%{}%", philosopher));

        .ok_or((StatusCode::NOT_FOUND, "No quotes found".to_string()))?            }

        .clone();            if let Some(search) = &params.search {

                query = query.bind(format!("%{}%", search)).bind(format!("%{}%", search));

    Ok(Json(quote))            }

}            query.fetch_all(sqlite_pool).await

        }

pub async fn get_daily_quote(        DbPool::Postgres(pg_pool) => {

    State(pool): State<PgPool>,            let mut query = sqlx::query_as::<_, QuoteWithPhilosopher>(&pg_query_str);

) -> Result<impl IntoResponse, (StatusCode, String)> {            if let Some(theme) = params.theme {

    // Use day of year to select a consistent quote for the day                query = query.bind(format!("%{}%", theme));

    let day_of_year = chrono::Utc::now().ordinal();            }

            if let Some(philosopher) = params.philosopher {

    let quotes = sqlx::query_as::<_, QuoteWithPhilosopher>(                query = query.bind(format!("%{}%", philosopher));

        "SELECT q.id, q.philosopher_id, p.name as philosopher_name, q.text, q.source, q.context, q.modern_interpretation, q.full_text            }

         FROM quotes q             if let Some(search) = &params.search {

         JOIN philosophers p ON q.philosopher_id = p.id                 query = query.bind(format!("%{}%", search)).bind(format!("%{}%", search));

         ORDER BY q.id"            }

    )            query.fetch_all(pg_pool).await

    .fetch_all(&pool)        }

    .await    }

    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;



    if quotes.is_empty() {    Ok(Json(quotes))

        return Err((StatusCode::NOT_FOUND, "No quotes found".to_string()));}

    }

pub async fn get_random_quote(

    let index = (day_of_year as usize - 1) % quotes.len();    State(pool): State<DbPool>,

    let quote = quotes[index].clone();) -> Result<impl IntoResponse, (StatusCode, String)> {

    Ok(Json(quote))    let quotes = pool

}        .query_fetch_all::<QuoteWithPhilosopher>(

            "SELECT q.id, q.philosopher_id, p.name as philosopher_name, q.text, q.source, q.context, q.modern_interpretation 

// Themes endpoints             FROM quotes q 

pub async fn list_themes(             JOIN philosophers p ON q.philosopher_id = p.id"

    State(pool): State<PgPool>,        )

) -> Result<impl IntoResponse, (StatusCode, String)> {        .await

    let themes = sqlx::query_as::<_, Theme>("SELECT * FROM themes ORDER BY name")        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

        .fetch_all(&pool)

        .await    let quote = quotes

        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;        .choose(&mut rand::thread_rng())

        .ok_or((StatusCode::NOT_FOUND, "No quotes found".to_string()))?

    Ok(Json(themes))        .clone();

}

    Ok(Json(quote))

pub async fn get_theme(}

    State(pool): State<PgPool>,

    Path(id): Path<i64>,pub async fn get_daily_quote(

) -> Result<impl IntoResponse, (StatusCode, String)> {    State(pool): State<DbPool>,

    let theme = sqlx::query_as::<_, Theme>("SELECT * FROM themes WHERE id = $1")) -> Result<impl IntoResponse, (StatusCode, String)> {

        .bind(id)    // Use day of year to select a consistent quote for the day

        .fetch_optional(&pool)    let day_of_year = chrono::Utc::now().ordinal();

        .await

        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?    let quotes = pool

        .ok_or((StatusCode::NOT_FOUND, "Theme not found".to_string()))?;        .query_fetch_all::<QuoteWithPhilosopher>(

            "SELECT q.id, q.philosopher_id, p.name as philosopher_name, q.text, q.source, q.context, q.modern_interpretation 

    Ok(Json(theme))             FROM quotes q 

}             JOIN philosophers p ON q.philosopher_id = p.id 

             ORDER BY q.id"

// Timeline endpoints        )

pub async fn list_timeline(        .await

    State(pool): State<PgPool>,        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

) -> Result<impl IntoResponse, (StatusCode, String)> {

    let events = sqlx::query_as::<_, TimelineEvent>("SELECT * FROM timeline ORDER BY year")    if quotes.is_empty() {

        .fetch_all(&pool)        return Err((StatusCode::NOT_FOUND, "No quotes found".to_string()));

        .await    }

        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let index = (day_of_year as usize - 1) % quotes.len();

    Ok(Json(events))    let quote = quotes[index].clone();

}    Ok(Json(quote))

}

// Incidents endpoints

pub async fn list_incidents(// Themes endpoints

    State(pool): State<PgPool>,pub async fn list_themes(

) -> Result<impl IntoResponse, (StatusCode, String)> {    State(pool): State<DbPool>,

    let incidents = sqlx::query_as::<_, IncidentWithPhilosopher>() -> Result<impl IntoResponse, (StatusCode, String)> {

        "SELECT i.*, p.name as philosopher_name     let themes = pool

         FROM incidents i         .query_fetch_all::<Theme>("SELECT * FROM themes ORDER BY name")

         LEFT JOIN philosophers p ON i.philosopher_id = p.id         .await

         ORDER BY i.year"        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    )

    .fetch_all(&pool)    Ok(Json(themes))

    .await}

    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

pub async fn get_theme(

    Ok(Json(incidents))    State(pool): State<DbPool>,

}    Path(id): Path<i64>,

) -> Result<impl IntoResponse, (StatusCode, String)> {

pub async fn get_incident(    let theme = pool

    State(pool): State<PgPool>,        .query_bind_fetch_optional::<Theme>("SELECT * FROM themes WHERE id = ?", id)

    Path(id): Path<i64>,        .await

) -> Result<impl IntoResponse, (StatusCode, String)> {        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?

    let incident = sqlx::query_as::<_, IncidentWithPhilosopher>(        .ok_or((StatusCode::NOT_FOUND, "Theme not found".to_string()))?;

        "SELECT i.*, p.name as philosopher_name 

         FROM incidents i     Ok(Json(theme))

         LEFT JOIN philosophers p ON i.philosopher_id = p.id }

         WHERE i.id = $1"

    )// Timeline endpoints

    .bind(id)pub async fn list_timeline(

    .fetch_optional(&pool)    State(pool): State<DbPool>,

    .await) -> Result<impl IntoResponse, (StatusCode, String)> {

    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?    let events = pool

    .ok_or((StatusCode::NOT_FOUND, "Incident not found".to_string()))?;        .query_fetch_all::<TimelineEvent>("SELECT * FROM timeline ORDER BY year")

        .await

    Ok(Json(incident))        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

}

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
