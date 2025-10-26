-- Emergency migration reset script for Render database
-- Run this manually in Render's PostgreSQL CLI if migrations fail due to checksum mismatch
-- 
-- Usage: Connect to the Render PostgreSQL database and run this script

-- Check current migration state
SELECT version, installed_on, success FROM _sqlx_migrations ORDER BY version;

-- If needed, delete the problematic migration record to allow reapplication
-- WARNING: Only run this if migrations are failing due to checksum mismatch
-- DELETE FROM _sqlx_migrations WHERE version = 1;

-- After deletion, restart the application and it will reapply migration 001 with correct checksum
