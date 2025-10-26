# Migration Summary: Azure to Render.com with PostgreSQL

## Overview
This document summarizes the migration of the Stoic Wisdom application from Azure to Render.com, including the database migration from SQLite to PostgreSQL.

## Changes Implemented

### 1. Database Migration (SQLite → PostgreSQL)

**Files Modified:**
- `Cargo.toml` - Added PostgreSQL feature to sqlx
- `migrations/001_initial_schema.sql` - Updated schema for PostgreSQL compatibility
  - Changed `INTEGER PRIMARY KEY AUTOINCREMENT` to `SERIAL PRIMARY KEY`
  - Changed `DATETIME` to `TIMESTAMP`
- `src/main.rs` - Implemented dual database support
- `src/handlers.rs` - Updated all handlers to work with both databases

**New Files:**
- `scripts/migrate_sqlite_to_postgres.sh` - Data migration script
- `migrations-sqlite-backup/` - Backup of original SQLite migrations

**Implementation Details:**
- Created `DbPool` enum to support both SQLite and PostgreSQL at runtime
- Database type is auto-detected from `DATABASE_URL` environment variable
- All SQL queries use `?` placeholders (compatible with both databases)
- Helper methods on `DbPool` handle database-specific operations

### 2. Render.com Deployment Configuration

**New Files:**
- `render.yaml` - Blueprint configuration for all services
  - PostgreSQL database service (free tier, 256MB)
  - Backend API service (Docker, free tier)
  - Frontend SSR service (Node.js, free tier)
- `RENDER_DEPLOYMENT_GUIDE.md` - Comprehensive deployment instructions
- `.env.example` - Environment variable template

**Deployment Features:**
- One-click deployment via Render Blueprint
- Automatic CI/CD from GitHub
- Managed PostgreSQL with automatic backups
- Free tier available for testing

### 3. Frontend SSR Migration

**Files Modified:**
- `frontend/next.config.ts`
  - Removed `output: 'export'` (static site generation)
  - Removed `images.unoptimized` (enables Next.js image optimization)
  - Enabled server-side rendering (SSR)

**Files Removed:**
- `frontend/public/staticwebapp.config.json` - Azure Static Web Apps config

### 4. Azure Removal

**Files/Directories Removed:**
- `azure/` - Entire Azure deployment directory
  - `azure/DEPLOYMENT_GUIDE.md`
  - `azure/deploy.sh`
  - `azure/aci-deployment.yaml`
- `.github/workflows/azure-deploy.yml` - Azure CI/CD workflow
- `.github/workflows/azure-static-web-apps-*.yml` - Static Web Apps workflow

### 5. Documentation Updates

**Files Modified:**
- `README.md`
  - Updated deployment section for Render.com
  - Removed Azure references
  - Updated tech stack descriptions
  - Added PostgreSQL as primary database
- `.gitignore` - Added migrations backup directory

**Files Added:**
- `RENDER_DEPLOYMENT_GUIDE.md` - Complete Render.com deployment guide

## Technical Architecture

### Before Migration
```
Azure Static Web Apps (Frontend - Static)
    ↓ HTTP
Azure Container Instances (Backend - Rust API)
    ↓ SQLite
File System (Ephemeral SQLite database)
```

### After Migration
```
Render.com Web Service (Frontend - Next.js SSR)
    ↓ HTTP
Render.com Web Service (Backend - Rust/Docker)
    ↓ PostgreSQL
Render.com PostgreSQL (Managed Database)
```

## Database Schema Compatibility

The migration maintains full schema compatibility:
- All tables preserved
- All relationships maintained
- All indexes created
- Data types mapped appropriately:
  - INTEGER → INTEGER
  - TEXT → TEXT
  - DATETIME → TIMESTAMP
  - AUTOINCREMENT → SERIAL

## Environment Variables

### Production (Render.com)
- `DATABASE_URL` - Automatically set by Render PostgreSQL service
- `PORT` - Automatically set by Render (3000)
- `RUST_LOG` - Set to `info`
- `NEXT_PUBLIC_API_BASE_URL` - Frontend points to backend service URL

### Local Development
- `DATABASE_URL` - Can be SQLite or PostgreSQL
  - SQLite: `sqlite:stoic_wisdom.db`
  - PostgreSQL: `postgresql://user:pass@localhost:5432/stoic_wisdom`
- `PORT` - 3000 (default)
- `NEXT_PUBLIC_API_BASE_URL` - `http://localhost:3000`

## Deployment Process

### Automated (Recommended)
1. Sign in to Render.com
2. Click "New +" → "Blueprint"
3. Connect to repository
4. Render detects `render.yaml`
5. Click "Apply"
6. Wait ~10 minutes for initial deployment

### Manual
1. Create PostgreSQL database in Render
2. Deploy backend Docker service
3. Deploy frontend Node.js service
4. Configure environment variables
5. Wait for deployments to complete

## Migration Checklist

- [x] PostgreSQL support added to backend
- [x] Database schema migrated
- [x] Data migration script created
- [x] Both databases supported (SQLite + PostgreSQL)
- [x] Render.yaml configuration created
- [x] Azure files removed
- [x] Frontend configured for SSR
- [x] Documentation updated
- [x] Environment templates created
- [x] Docker-compose updated for PostgreSQL
- [x] Code compiles successfully
- [x] All handlers updated for dual database support

## Testing Recommendations

### Local Testing
1. Test with SQLite:
   ```bash
   DATABASE_URL=sqlite:stoic_wisdom.db cargo run
   ```

2. Test with PostgreSQL (via docker-compose):
   ```bash
   docker-compose up
   ```

### Production Testing (Render.com)
1. Deploy via Blueprint
2. Verify database migrations complete
3. Test all API endpoints
4. Verify frontend can reach backend
5. Check for CORS issues
6. Monitor logs for errors

## Rollback Plan

If issues arise with Render.com deployment:

1. Revert this PR
2. Restore Azure deployment files from git history
3. Redeploy to Azure using existing workflows
4. Database remains compatible (SQLite still supported)

## Cost Comparison

### Azure (Before)
- Container Instances: ~$30-40/month
- Static Web Apps: Free tier (or ~$9/month)
- **Total**: ~$30-40/month

### Render.com (After)
- Free Tier: $0/month (with limitations)
  - PostgreSQL: 90-day expiry, 256MB
  - Web Services: Spin down after inactivity
- Starter Tier: ~$21/month
  - PostgreSQL: $7/month
  - Backend: $7/month
  - Frontend: $7/month
- **Total**: $0-21/month

## Benefits of Migration

1. **Simplified Deployment**: One-click deployment vs complex Azure setup
2. **Cost Effective**: Free tier available, comparable pricing for paid
3. **Managed Database**: PostgreSQL with automatic backups
4. **Better Scalability**: PostgreSQL scales better than SQLite
5. **SSR Support**: Next.js SSR for better SEO and performance
6. **Auto CI/CD**: No GitHub Actions configuration needed
7. **Developer Experience**: Easier setup and maintenance

## Known Limitations

1. Free tier services spin down after 15 minutes of inactivity
2. First request after spin-down takes 30-60 seconds
3. Free PostgreSQL database expires after 90 days
4. Limited to 750 hours/month on free tier

## Future Considerations

1. **Monitoring**: Add application monitoring (e.g., Sentry)
2. **Caching**: Consider adding Redis for frequently accessed data
3. **CDN**: Add CDN for static assets
4. **Scaling**: Upgrade to paid tiers as traffic grows
5. **Backup Strategy**: Implement additional backup procedures
6. **Performance Optimization**: Monitor and optimize database queries

## Support and Resources

- **Render.com Documentation**: https://render.com/docs
- **Deployment Guide**: See `RENDER_DEPLOYMENT_GUIDE.md`
- **Migration Script**: See `scripts/migrate_sqlite_to_postgres.sh`
- **Environment Template**: See `.env.example`

---

**Migration Completed**: 2025-10-26
**Status**: ✅ Complete and Ready for Deployment
