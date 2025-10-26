-- Convert birth_year, death_year, and year columns to BIGINT
-- These were missed in migration 006 (which only converted ids and fks)

-- Philosophers table: birth_year, death_year
ALTER TABLE philosophers ALTER COLUMN birth_year TYPE BIGINT USING birth_year::bigint;
ALTER TABLE philosophers ALTER COLUMN death_year TYPE BIGINT USING death_year::bigint;

-- Timeline table: year
ALTER TABLE timeline ALTER COLUMN year TYPE BIGINT USING year::bigint;

-- Incidents table: year
ALTER TABLE incidents ALTER COLUMN year TYPE BIGINT USING year::bigint;
