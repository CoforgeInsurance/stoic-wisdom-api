-- Add full_text column to quotes table for longer versions of quotes (SQLite)
ALTER TABLE quotes ADD COLUMN full_text TEXT;
