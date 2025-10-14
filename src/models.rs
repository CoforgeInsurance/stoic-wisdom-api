use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct Philosopher {
    pub id: i64,
    pub name: String,
    pub era: String,
    pub birth_year: Option<i64>,
    pub death_year: Option<i64>,
    pub biography: String,
    pub key_works: Option<String>,
    pub core_teachings: Option<String>,
}

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct Quote {
    pub id: i64,
    pub philosopher_id: i64,
    pub text: String,
    pub source: String,
    pub context: Option<String>,
    pub modern_interpretation: Option<String>,
}

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct QuoteWithPhilosopher {
    pub id: i64,
    pub philosopher_id: i64,
    pub philosopher_name: String,
    pub text: String,
    pub source: String,
    pub context: Option<String>,
    pub modern_interpretation: Option<String>,
}

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct Theme {
    pub id: i64,
    pub name: String,
    pub description: String,
    pub principle: String,
    pub scientific_connection: Option<String>,
    pub cbt_connection: Option<String>,
    pub neuroscience_connection: Option<String>,
    pub psychology_connection: Option<String>,
}

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct TimelineEvent {
    pub id: i64,
    pub year: i64,
    pub title: String,
    pub description: String,
    pub significance: Option<String>,
}

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct Incident {
    pub id: i64,
    pub title: String,
    pub philosopher_id: Option<i64>,
    pub year: Option<i64>,
    pub description: String,
    pub lesson: String,
    pub modern_relevance: Option<String>,
}

#[derive(Debug, Clone, Serialize, FromRow)]
pub struct IncidentWithPhilosopher {
    pub id: i64,
    pub title: String,
    pub philosopher_id: Option<i64>,
    pub philosopher_name: Option<String>,
    pub year: Option<i64>,
    pub description: String,
    pub lesson: String,
    pub modern_relevance: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct PhilosopherWithQuotes {
    #[serde(flatten)]
    pub philosopher: Philosopher,
    pub quotes: Vec<Quote>,
}

#[derive(Debug, Deserialize)]
pub struct QuoteSearchParams {
    pub theme: Option<String>,
    pub philosopher: Option<String>,
    pub search: Option<String>,
}
