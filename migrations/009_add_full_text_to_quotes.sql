-- Add full_text column to quotes table for longer versions of quotes
ALTER TABLE quotes ADD COLUMN full_text TEXT;
