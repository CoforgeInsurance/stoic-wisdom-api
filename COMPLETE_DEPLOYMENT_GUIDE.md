# Complete Deployment Guide - Stoic Wisdom Full Stack

This guide walks you through deploying both the backend API and frontend application.

## 🎯 Deployment Overview

### What You'll Deploy

1. **Backend API** → Azure Container Instances (already deployed)
2. **Frontend Web App** → Azure Static Web Apps (new)

### Architecture

```
┌─────────────────────────────────────────┐
│     Azure Static Web Apps               │
│     (Frontend - Next.js)                │
│     - Landing page with quotes          │
│     - Philosophers explorer             │
│     - Themes & Timeline                 │
│     - Vintage design                    │
└─────────────────┬───────────────────────┘
                  │ HTTP API Calls
                  │ (CORS enabled)
                  ▼
┌─────────────────────────────────────────┐
│   Azure Container Instances             │
│   (Backend - Rust API)                  │
│   - Axum web framework                  │
│   - SQLite database                     │
│   - 15 RESTful endpoints                │
└─────────────────────────────────────────┘
```

## ✅ Prerequisites

- Azure subscription
- Azure CLI installed (`az --version`)
- Node.js 18+ installed
- GitHub account with repo access
- Git installed

## 🚀 Step-by-Step Deployment

### Step 1: Verify Backend API is Running

The backend API should already be deployed. Verify it's working:

```bash
# Test the API health endpoint
curl http://stoic-wisdom-api.eastus.azurecontainer.io:3000/health

# Should return: "Healthy: All database tables exist"

# Test a quote endpoint
curl http://stoic-wisdom-api.eastus.azurecontainer.io:3000/quotes/random
```

If the API is not running, see [azure/DEPLOYMENT_GUIDE.md](azure/DEPLOYMENT_GUIDE.md) to deploy it first.

### Step 2: Create Azure Static Web App

#### Option A: Using Azure Portal (Recommended for First-Time)

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **"Create a resource"**
3. Search for **"Static Web App"**
4. Click **"Create"**
5. Fill in the details:

   **Basics:**
   - Subscription: Your Azure subscription
   - Resource Group: `stoic-wisdom-rg` (same as backend)
   - Name: `stoic-wisdom-frontend`
   - Plan type: `Free` (for testing) or `Standard` (for production)
   - Region: `East US 2` (closest to backend)
   
   **Deployment:**
   - Source: `GitHub`
   - Organization: `CoforgeInsurance`
   - Repository: `stoic-wisdom-api`
   - Branch: `main`
   
   **Build Details:**
   - Build Presets: `Next.js`
   - App location: `/frontend`
   - Api location: (leave empty)
   - Output location: (leave empty)

6. Click **"Review + create"**
7. Click **"Create"**

#### Option B: Using Azure CLI (Advanced)

```bash
# Login to Azure
az login

# Set your subscription (if you have multiple)
az account set --subscription "YOUR_SUBSCRIPTION_ID"

# Create Static Web App
az staticwebapp create \
  --name stoic-wisdom-frontend \
  --resource-group stoic-wisdom-rg \
  --source https://github.com/CoforgeInsurance/stoic-wisdom-api \
  --location "East US 2" \
  --branch main \
  --app-location "/frontend" \
  --output-location "" \
  --login-with-github
```

**Note**: This will open a browser for GitHub authentication.

### Step 3: Configure GitHub Secret

The Azure portal should automatically create a GitHub secret, but verify:

1. **Get the deployment token:**

```bash
az staticwebapp secrets list \
  --name stoic-wisdom-frontend \
  --resource-group stoic-wisdom-rg \
  --query "properties.apiKey" -o tsv
```

2. **Add to GitHub (if not already added):**
   - Go to: `https://github.com/CoforgeInsurance/stoic-wisdom-api/settings/secrets/actions`
   - Click **"New repository secret"**
   - Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Value: (paste the token from step 1)
   - Click **"Add secret"**

### Step 4: Configure Environment Variables

Set the API base URL for the frontend:

#### Using Azure Portal:

1. Navigate to your Static Web App in Azure Portal
2. Go to **"Configuration"** in the left menu
3. Click **"Application settings"**
4. Click **"+ Add"**
5. Add:
   - Name: `NEXT_PUBLIC_API_BASE_URL`
   - Value: `http://stoic-wisdom-api.eastus.azurecontainer.io:3000`
6. Click **"Save"**

#### Using Azure CLI:

```bash
az staticwebapp appsettings set \
  --name stoic-wisdom-frontend \
  --resource-group stoic-wisdom-rg \
  --setting-names NEXT_PUBLIC_API_BASE_URL=http://stoic-wisdom-api.eastus.azurecontainer.io:3000
```

### Step 5: Trigger Deployment

The GitHub Actions workflow is already configured. To deploy:

```bash
# Make sure you're on the main branch
git checkout main

# Pull latest changes
git pull origin main

# Push to trigger deployment
git push origin main
```

**Monitor the deployment:**
1. Go to `https://github.com/CoforgeInsurance/stoic-wisdom-api/actions`
2. Click on the running workflow
3. Watch the build and deployment progress
4. Wait for completion (usually 2-5 minutes)

### Step 6: Get Your Frontend URL

#### Using Azure Portal:

1. Navigate to your Static Web App in Azure Portal
2. The URL is in the **"Overview"** section
3. Format: `https://stoic-wisdom-frontend.azurestaticapps.net`

#### Using Azure CLI:

```bash
az staticwebapp show \
  --name stoic-wisdom-frontend \
  --resource-group stoic-wisdom-rg \
  --query "defaultHostname" -o tsv
```

### Step 7: Test Your Deployment

Visit your Static Web App URL and test:

**Basic Functionality:**
- [ ] Landing page loads with a quote
- [ ] "New Quote" button works
- [ ] Navigation links are functional
- [ ] Pages load without errors

**Page-by-Page Testing:**
- [ ] **Philosophers**: List displays, cards are clickable
- [ ] **Philosopher Details**: Biography and quotes load
- [ ] **Quotes**: Search and filter work correctly
- [ ] **Themes**: All themes display properly
- [ ] **Timeline**: Events display in chronological order
- [ ] **Surprise Me**: Random content generates

**Technical Checks:**
- [ ] No CORS errors in browser console (F12)
- [ ] Images and fonts load correctly
- [ ] Responsive design works on mobile
- [ ] Page transitions are smooth

### Step 8: Configure CORS (Production Best Practice)

For security, restrict CORS on the backend API to only allow your frontend domain.

**Current CORS** (allows any origin):
```rust
let cors = CorsLayer::new()
    .allow_origin(Any)
    .allow_methods(Any)
    .allow_headers(Any);
```

**Production CORS** (restrict to your domain):

1. Edit `src/main.rs` in your backend:

```rust
use tower_http::cors::{CorsLayer, AllowOrigin};
use http::header::HeaderValue;

// Replace the cors configuration with:
let cors = CorsLayer::new()
    .allow_origin(
        "https://stoic-wisdom-frontend.azurestaticapps.net"
            .parse::<HeaderValue>()
            .unwrap()
    )
    .allow_methods(Any)
    .allow_headers(Any);
```

2. Redeploy the backend:

```bash
cd azure
./deploy.sh
```

3. Test that frontend still works after CORS restriction

## 🎨 Customization Options

### Add a Custom Domain

1. In Azure Portal, go to your Static Web App
2. Click **"Custom domains"**
3. Click **"+ Add"**
4. Follow wizard to add your domain
5. Update DNS records (CNAME or TXT)
6. Wait for validation

### Enable HTTPS (Automatic)

Azure Static Web Apps automatically provision SSL certificates. Your site will be available at:
- HTTP: `http://stoic-wisdom-frontend.azurestaticapps.net`
- HTTPS: `https://stoic-wisdom-frontend.azurestaticapps.net`

Force HTTPS by default (already configured in `staticwebapp.config.json`).

### Add Application Insights

1. Create Application Insights resource
2. Get the connection string
3. Add to Static Web App configuration:

```bash
az staticwebapp appsettings set \
  --name stoic-wisdom-frontend \
  --resource-group stoic-wisdom-rg \
  --setting-names APPLICATIONINSIGHTS_CONNECTION_STRING="YOUR_CONNECTION_STRING"
```

## 🔍 Troubleshooting

### Build Fails

**Symptom**: GitHub Actions workflow shows build errors

**Solutions**:
1. Check workflow logs for specific errors
2. Verify `package.json` has all dependencies
3. Test build locally: `cd frontend && npm run build`
4. Check Node.js version compatibility

### API Connection Issues

**Symptom**: Frontend loads but shows "Unable to load" errors

**Solutions**:
1. Verify API is running:
   ```bash
   curl http://stoic-wisdom-api.eastus.azurecontainer.io:3000/health
   ```
2. Check browser console for CORS errors
3. Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly in Azure
4. Check network tab in browser DevTools

### Deployment Token Issues

**Symptom**: Deployment fails with authentication error

**Solutions**:
1. Regenerate deployment token:
   ```bash
   az staticwebapp secrets reset \
     --name stoic-wisdom-frontend \
     --resource-group stoic-wisdom-rg
   ```
2. Update GitHub secret with new token
3. Re-run workflow

### Pages Not Loading

**Symptom**: 404 errors or blank pages

**Solutions**:
1. Verify build completed successfully
2. Check `staticwebapp.config.json` routing rules
3. Clear browser cache (Ctrl+Shift+R)
4. Check Azure Static Web App logs

## 💰 Cost Estimation

### Free Tier (Recommended for Learning)
- **Static Web Apps**: Free tier includes:
  - 100 GB bandwidth/month
  - 0.5 GB storage
  - Custom domains
  - Free SSL certificates
  - Automatic scaling
- **Container Instances** (Backend): ~$30-40/month

**Total**: ~$30-40/month (backend only, frontend is free)

### Standard Tier (Production)
- **Static Web Apps**: ~$9/month
  - 100 GB bandwidth included
  - Additional: $0.20/GB
  - Staging environments
  - SLA support
- **Container Instances**: ~$30-40/month

**Total**: ~$40-50/month

## 📊 Monitoring

### View Deployment Logs

```bash
# Static Web App doesn't have traditional logs
# Check GitHub Actions for build logs
# Use browser DevTools for runtime issues
```

### Monitor with Application Insights (Optional)

After enabling Application Insights:
1. View requests and performance in Azure Portal
2. Set up alerts for errors
3. Track user behavior
4. Monitor page load times

## 🔄 CI/CD Workflow

The deployment is fully automated:

**Workflow File**: `.github/workflows/azure-static-web-apps.yml`

**Triggers**:
- Push to `main` branch (frontend changes only)
- Pull requests to `main` branch

**Process**:
1. Checkout code
2. Install dependencies (`npm install`)
3. Build Next.js app (`npm run build`)
4. Deploy to Azure Static Web Apps
5. Set environment variables

**Preview Deployments**:
- Pull requests automatically create preview deployments
- URL format: `https://stoic-wisdom-frontend-{pr-number}.azurestaticapps.net`
- Automatically deleted when PR is closed

## 🎯 Next Steps

After successful deployment:

1. **Share Your App**:
   - Share the URL with others
   - Test on multiple devices
   - Get feedback

2. **Monitor Performance**:
   - Check page load times
   - Monitor API response times
   - Watch for errors

3. **Enhance Features**:
   - Add user favorites (localStorage)
   - Implement social sharing
   - Add more interactive elements

4. **Scale as Needed**:
   - Upgrade to Standard tier if traffic increases
   - Add CDN for global users
   - Consider database alternatives for backend

## 📚 Documentation Links

- [Frontend Implementation Summary](FRONTEND_SUMMARY.md)
- [Frontend Deployment Guide](FRONTEND_DEPLOYMENT.md)
- [API Examples](API_EXAMPLES.md)
- [Backend Deployment](azure/DEPLOYMENT_GUIDE.md)
- [Azure Static Web Apps Docs](https://docs.microsoft.com/azure/static-web-apps/)

## ✅ Success Checklist

- [ ] Backend API is running and accessible
- [ ] Azure Static Web App created
- [ ] GitHub secret configured
- [ ] Environment variables set
- [ ] Deployment workflow completed successfully
- [ ] Frontend URL is accessible
- [ ] All pages load without errors
- [ ] No CORS errors in console
- [ ] Responsive design works on mobile
- [ ] CORS configured for production security

## 🎉 Congratulations!

You've successfully deployed a full-stack Stoic Wisdom application with:
- High-performance Rust backend API
- Modern Next.js frontend with vintage design
- Automated CI/CD pipeline
- Cloud-native architecture on Azure

**Your app is live and ready to share ancient wisdom with the world!**

---

For support, issues, or questions:
- Open an issue on GitHub
- Review documentation
- Check Azure support resources
