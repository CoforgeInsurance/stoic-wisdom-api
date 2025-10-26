-- Idempotent type fix for PostgreSQL
-- Ensures id/fk columns are BIGINT (for i64 in Rust)
-- Ensures year columns are INTEGER (for i32 in Rust)
-- Safe to run multiple times

-- Only convert id columns to BIGINT if not already BIGINT
DO $$
BEGIN
    -- Philosophers table
    IF (SELECT data_type FROM information_schema.columns 
        WHERE table_name = 'philosophers' AND column_name = 'id') != 'bigint' THEN
        ALTER TABLE philosophers ALTER COLUMN id TYPE BIGINT USING id::bigint;
    END IF;

    -- Quotes table
    IF (SELECT data_type FROM information_schema.columns 
        WHERE table_name = 'quotes' AND column_name = 'id') != 'bigint' THEN
        ALTER TABLE quotes ALTER COLUMN id TYPE BIGINT USING id::bigint;
    END IF;
    
    IF (SELECT data_type FROM information_schema.columns 
        WHERE table_name = 'quotes' AND column_name = 'philosopher_id') != 'bigint' THEN
        ALTER TABLE quotes ALTER COLUMN philosopher_id TYPE BIGINT USING philosopher_id::bigint;
    END IF;

    -- Themes table
    IF (SELECT data_type FROM information_schema.columns 
        WHERE table_name = 'themes' AND column_name = 'id') != 'bigint' THEN
        ALTER TABLE themes ALTER COLUMN id TYPE BIGINT USING id::bigint;
    END IF;

    -- Timeline table
    IF (SELECT data_type FROM information_schema.columns 
        WHERE table_name = 'timeline' AND column_name = 'id') != 'bigint' THEN
        ALTER TABLE timeline ALTER COLUMN id TYPE BIGINT USING id::bigint;
    END IF;

    -- Incidents table
    IF (SELECT data_type FROM information_schema.columns 
        WHERE table_name = 'incidents' AND column_name = 'id') != 'bigint' THEN
        ALTER TABLE incidents ALTER COLUMN id TYPE BIGINT USING id::bigint;
    END IF;
    
    IF (SELECT data_type FROM information_schema.columns 
        WHERE table_name = 'incidents' AND column_name = 'philosopher_id') != 'bigint' THEN
        ALTER TABLE incidents ALTER COLUMN philosopher_id TYPE BIGINT USING philosopher_id::bigint;
    END IF;

    -- Quote themes junction table
    IF (SELECT data_type FROM information_schema.columns 
        WHERE table_name = 'quote_themes' AND column_name = 'quote_id') != 'bigint' THEN
        ALTER TABLE quote_themes ALTER COLUMN quote_id TYPE BIGINT USING quote_id::bigint;
    END IF;
    
    IF (SELECT data_type FROM information_schema.columns 
        WHERE table_name = 'quote_themes' AND column_name = 'theme_id') != 'bigint' THEN
        ALTER TABLE quote_themes ALTER COLUMN theme_id TYPE BIGINT USING theme_id::bigint;
    END IF;
END $$;

-- Ensure year columns are INTEGER (not BIGINT) for i32 compatibility
DO $$
BEGIN
    -- Philosophers birth_year and death_year
    IF (SELECT data_type FROM information_schema.columns 
        WHERE table_name = 'philosophers' AND column_name = 'birth_year') = 'bigint' THEN
        ALTER TABLE philosophers ALTER COLUMN birth_year TYPE INTEGER USING birth_year::integer;
    END IF;
    
    IF (SELECT data_type FROM information_schema.columns 
        WHERE table_name = 'philosophers' AND column_name = 'death_year') = 'bigint' THEN
        ALTER TABLE philosophers ALTER COLUMN death_year TYPE INTEGER USING death_year::integer;
    END IF;

    -- Timeline year
    IF (SELECT data_type FROM information_schema.columns 
        WHERE table_name = 'timeline' AND column_name = 'year') = 'bigint' THEN
        ALTER TABLE timeline ALTER COLUMN year TYPE INTEGER USING year::integer;
    END IF;

    -- Incidents year
    IF (SELECT data_type FROM information_schema.columns 
        WHERE table_name = 'incidents' AND column_name = 'year') = 'bigint' THEN
        ALTER TABLE incidents ALTER COLUMN year TYPE INTEGER USING year::integer;
    END IF;
END $$;
