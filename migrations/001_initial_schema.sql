-- Create philosophers table (PostgreSQL compatible)
CREATE TABLE IF NOT EXISTS philosophers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    era TEXT NOT NULL,
    birth_year INTEGER,
    death_year INTEGER,
    biography TEXT NOT NULL,
    key_works TEXT,
    core_teachings TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create quotes table (PostgreSQL compatible)
CREATE TABLE IF NOT EXISTS quotes (
    id SERIAL PRIMARY KEY,
    philosopher_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    source TEXT NOT NULL,
    context TEXT,
    modern_interpretation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (philosopher_id) REFERENCES philosophers(id)
);

-- Create themes table (PostgreSQL compatible)
CREATE TABLE IF NOT EXISTS themes (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    principle TEXT NOT NULL,
    scientific_connection TEXT,
    cbt_connection TEXT,
    neuroscience_connection TEXT,
    psychology_connection TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create quote_themes junction table
CREATE TABLE IF NOT EXISTS quote_themes (
    quote_id INTEGER NOT NULL,
    theme_id INTEGER NOT NULL,
    PRIMARY KEY (quote_id, theme_id),
    FOREIGN KEY (quote_id) REFERENCES quotes(id),
    FOREIGN KEY (theme_id) REFERENCES themes(id)
);

-- Create timeline table (PostgreSQL compatible)
CREATE TABLE IF NOT EXISTS timeline (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    significance TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create incidents table (PostgreSQL compatible)
CREATE TABLE IF NOT EXISTS incidents (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    philosopher_id INTEGER,
    year INTEGER,
    description TEXT NOT NULL,
    lesson TEXT NOT NULL,
    modern_relevance TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (philosopher_id) REFERENCES philosophers(id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_quotes_philosopher ON quotes(philosopher_id);
CREATE INDEX IF NOT EXISTS idx_incidents_philosopher ON incidents(philosopher_id);
CREATE INDEX IF NOT EXISTS idx_timeline_year ON timeline(year);
