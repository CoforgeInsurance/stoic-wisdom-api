-- Revert year-related columns back to INTEGER (INT4)
-- Rationale: Years comfortably fit in 32-bit range and models now use i32/Option<i32>.
-- This restores alignment after migration 007 which cast these to BIGINT, causing decode mismatches.

-- Philosophers table: birth_year, death_year
ALTER TABLE philosophers ALTER COLUMN birth_year TYPE INTEGER USING birth_year::integer;
ALTER TABLE philosophers ALTER COLUMN death_year TYPE INTEGER USING death_year::integer;

-- Timeline table: year
ALTER TABLE timeline ALTER COLUMN year TYPE INTEGER USING year::integer;

-- Incidents table: year
ALTER TABLE incidents ALTER COLUMN year TYPE INTEGER USING year::integer;
