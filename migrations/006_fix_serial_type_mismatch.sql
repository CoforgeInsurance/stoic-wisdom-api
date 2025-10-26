-- Fix type mismatch: convert SERIAL (4-byte) columns to BIGINT (8-byte)
-- This matches Rust i64 type expectations in models.rs
--
-- When Migration 001 used SERIAL, PostgreSQL created INTEGER columns (INT4/4-byte).
-- Rust models expect i64 (INT8/8-byte). This migration converts them.

-- Philosophers table: id and fk references
ALTER TABLE philosophers ALTER COLUMN id TYPE BIGINT USING id::bigint;

-- Quotes table: id and fk references  
ALTER TABLE quotes ALTER COLUMN id TYPE BIGINT USING id::bigint;
ALTER TABLE quotes ALTER COLUMN philosopher_id TYPE BIGINT USING philosopher_id::bigint;

-- Themes table: id
ALTER TABLE themes ALTER COLUMN id TYPE BIGINT USING id::bigint;

-- Timeline table: id
ALTER TABLE timeline ALTER COLUMN id TYPE BIGINT USING id::bigint;

-- Incidents table: id and fk references
ALTER TABLE incidents ALTER COLUMN id TYPE BIGINT USING id::bigint;
ALTER TABLE incidents ALTER COLUMN philosopher_id TYPE BIGINT USING philosopher_id::bigint;

-- Quote themes junction table: fk references
ALTER TABLE quote_themes ALTER COLUMN quote_id TYPE BIGINT USING quote_id::bigint;
ALTER TABLE quote_themes ALTER COLUMN theme_id TYPE BIGINT USING theme_id::bigint;
