# Frontend Deployment Guide

This guide walks through deploying the Stoic Wisdom frontend to Azure Static Web Apps.

## Prerequisites

- Azure subscription
- Azure CLI installed
- GitHub repository access
- Node.js 18+ installed locally

## Step 1: Create Azure Static Web App

### Using Azure Portal

1. Navigate to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Static Web App"
4. Click "Create"
5. Fill in the details:
   - **Subscription**: Your Azure subscription
   - **Resource Group**: `stoic-wisdom-rg` (same as the API)
   - **Name**: `stoic-wisdom-frontend`
   - **Plan type**: Free (for learning/testing) or Standard (for production)
   - **Region**: East US (same region as API for lower latency)
   - **Source**: GitHub
   - **Organization**: Your GitHub organization
   - **Repository**: `stoic-wisdom-api`
   - **Branch**: `main`
   - **Build Presets**: Next.js
   - **App location**: `/frontend`
   - **Api location**: (leave empty)
   - **Output location**: (leave empty - Next.js handles this)

6. Click "Review + create"
7. Click "Create"

### Using Azure CLI

```bash
# Login to Azure
az login

# Set subscription (if you have multiple)
az account set --subscription "YOUR_SUBSCRIPTION_ID"

# Create static web app
az staticwebapp create \
  --name stoic-wisdom-frontend \
  --resource-group stoic-wisdom-rg \
  --source https://github.com/CoforgeInsurance/stoic-wisdom-api \
  --location "East US" \
  --branch main \
  --app-location "/frontend" \
  --output-location "" \
  --login-with-github
```

## Step 2: Configure GitHub Secrets

The Azure Static Web Apps creation process should automatically add a GitHub secret. If not:

1. Get the deployment token:

```bash
az staticwebapp secrets list \
  --name stoic-wisdom-frontend \
  --resource-group stoic-wisdom-rg \
  --query "properties.apiKey" -o tsv
```

2. Add to GitHub repository:
   - Go to your repository on GitHub
   - Navigate to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Value: Paste the token from step 1
   - Click "Add secret"

## Step 3: Configure Environment Variables

Set environment variables for the Static Web App:

### Using Azure Portal

1. Navigate to your Static Web App in Azure Portal
2. Go to "Configuration" in the left menu
3. Click "Application settings"
4. Add the following:
   - **Name**: `NEXT_PUBLIC_API_BASE_URL`
   - **Value**: `http://stoic-wisdom-api.eastus.azurecontainer.io:3000`
5. Click "Save"

### Using Azure CLI

```bash
az staticwebapp appsettings set \
  --name stoic-wisdom-frontend \
  --resource-group stoic-wisdom-rg \
  --setting-names NEXT_PUBLIC_API_BASE_URL=http://stoic-wisdom-api.eastus.azurecontainer.io:3000
```

## Step 4: Verify GitHub Actions Workflow

The workflow file is located at `.github/workflows/azure-static-web-apps.yml`.

Key points:
- Triggers on push to `main` branch (only for frontend changes)
- Triggers on pull requests to `main` branch
- Uses the Azure Static Web Apps Deploy action
- Sets the API base URL as an environment variable during build

## Step 5: Deploy

The deployment happens automatically when you push to the `main` branch:

```bash
git add .
git commit -m "Add frontend application"
git push origin main
```

Monitor the deployment:
1. Go to your repository on GitHub
2. Click "Actions" tab
3. Click on the running workflow
4. Watch the deployment progress

## Step 6: Get Your App URL

### Using Azure Portal

1. Navigate to your Static Web App in Azure Portal
2. The URL is displayed in the "Overview" section
3. Format: `https://<app-name>.<region>.azurestaticapps.net`

### Using Azure CLI

```bash
az staticwebapp show \
  --name stoic-wisdom-frontend \
  --resource-group stoic-wisdom-rg \
  --query "defaultHostname" -o tsv
```

## Step 7: Test Your Deployment

Visit your Static Web App URL and verify:

- [ ] Landing page loads with a random quote
- [ ] Navigation works across all pages
- [ ] Philosophers list displays correctly
- [ ] Individual philosopher pages load
- [ ] Quotes page with search and filtering works
- [ ] Themes page displays
- [ ] Timeline shows historical events
- [ ] "Surprise Me" page generates random content
- [ ] No CORS errors in browser console
- [ ] Responsive design works on mobile

## Step 8: Configure CORS on API (Optional but Recommended)

For production, restrict CORS on the API to only allow your Static Web App domain.

Update the API's CORS configuration to replace `Any` with your specific domain:

```rust
// In src/main.rs
let cors = CorsLayer::new()
    .allow_origin("https://stoic-wisdom-frontend.eastus.azurestaticapps.net".parse::<HeaderValue>().unwrap())
    .allow_methods(Any)
    .allow_headers(Any);
```

Redeploy the API after this change.

## Step 9: Set Up Custom Domain (Optional)

If you want to use a custom domain:

1. Navigate to your Static Web App in Azure Portal
2. Click "Custom domains" in the left menu
3. Click "Add"
4. Follow the wizard to add your domain
5. Add required DNS records (CNAME or TXT)
6. Wait for validation (can take a few minutes to hours)

## Troubleshooting

### Build Fails

- Check the GitHub Actions logs for specific errors
- Verify all dependencies are correctly listed in `package.json`
- Ensure environment variables are set correctly

### API Connection Issues

- Verify the API is running: `curl http://stoic-wisdom-api.eastus.azurecontainer.io:3000/health`
- Check browser console for CORS errors
- Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly
- Ensure the API base URL is accessible from the internet

### Pages Not Loading

- Check the browser console for errors
- Verify the build completed successfully in GitHub Actions
- Clear browser cache and try again
- Check Azure Static Web App logs in Azure Portal

### Deployment Token Issues

If the deployment fails with authentication errors:
1. Regenerate the deployment token in Azure
2. Update the GitHub secret
3. Re-run the workflow

## Monitoring and Logs

### View Application Logs

```bash
# Not available for Static Web Apps (they're static!)
# Use browser console and Azure Monitor for insights
```

### Enable Application Insights (Optional)

1. Create an Application Insights resource
2. Link it to your Static Web App
3. Add the connection string to your app configuration

## Cost Estimation

**Free Tier**:
- 100 GB bandwidth per month
- 0.5 GB storage
- Custom domains and SSL included
- Suitable for learning and small projects

**Standard Tier** (~$9/month):
- 100 GB bandwidth included
- 0.5 GB storage included
- Additional bandwidth: $0.20/GB
- Staging environments
- SLA support

## Next Steps

- [ ] Set up monitoring and alerts
- [ ] Configure custom domain
- [ ] Enable Application Insights
- [ ] Set up staging environments for testing
- [ ] Implement CI/CD for preview deployments on PRs
- [ ] Add automated testing in the workflow

## Useful Commands

```bash
# Get Static Web App details
az staticwebapp show \
  --name stoic-wisdom-frontend \
  --resource-group stoic-wisdom-rg

# List all static web apps
az staticwebapp list --resource-group stoic-wisdom-rg

# Delete the static web app (cleanup)
az staticwebapp delete \
  --name stoic-wisdom-frontend \
  --resource-group stoic-wisdom-rg \
  --yes
```

## Support Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Project Repository](https://github.com/CoforgeInsurance/stoic-wisdom-api)

## Notes

- The frontend uses client-side rendering for dynamic content
- SWR provides client-side caching for better performance
- Static pages are pre-rendered at build time where possible
- The API uses in-memory SQLite, so data may reset on API redeployments
