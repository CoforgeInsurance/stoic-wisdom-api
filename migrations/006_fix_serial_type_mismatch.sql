-- Fix type mismatch: convert SERIAL (4-byte int) columns to BIGINT (8-byte)
-- This matches Rust i64 type expectations in models.rs
-- 
-- Background: Migration 001 created tables with SERIAL PRIMARY KEY which PostgreSQL
-- treats as 4-byte integers. Rust models.rs defines all ids as i64 (8-byte).
-- This causes "mismatched types; Rust type i64 is not compatible with SQL type INT4"

BEGIN;

-- Philosophers table
ALTER TABLE philosophers ALTER COLUMN id TYPE BIGINT;

-- Quotes table  
ALTER TABLE quotes ALTER COLUMN id TYPE BIGINT;
ALTER TABLE quotes ALTER COLUMN philosopher_id TYPE BIGINT;

-- Themes table
ALTER TABLE themes ALTER COLUMN id TYPE BIGINT;

-- Timeline table
ALTER TABLE timeline ALTER COLUMN id TYPE BIGINT;

-- Incidents table
ALTER TABLE incidents ALTER COLUMN id TYPE BIGINT;
ALTER TABLE incidents ALTER COLUMN philosopher_id TYPE BIGINT;

-- Quote themes junction table
ALTER TABLE quote_themes ALTER COLUMN quote_id TYPE BIGINT;
ALTER TABLE quote_themes ALTER COLUMN theme_id TYPE BIGINT;

COMMIT;
