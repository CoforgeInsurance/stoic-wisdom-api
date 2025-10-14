# Azure Configuration Setup Guide

This document provides a comprehensive checklist of all Azure resources and configurations needed for deploying the Stoic Wisdom API.

## Prerequisites Checklist

- [ ] Azure account with active subscription
- [ ] Azure CLI installed locally (`az --version` to verify)
- [ ] Docker installed locally
- [ ] Git repository cloned locally

## Azure Resources to Create

### 1. Resource Group

**What:** Container for all Azure resources
**Why:** Organizes resources and simplifies management/billing

**Configuration:**
```bash
Name: stoic-wisdom-rg (or your preference)
Location: eastus (or your preferred region)
```

**How to Create:**
```bash
az group create --name stoic-wisdom-rg --location eastus
```

### 2. Azure Container Registry (ACR)

**What:** Private Docker image registry
**Why:** Stores your Docker images securely

**Configuration:**
```bash
Name: <UNIQUE_NAME>acr (must be globally unique, alphanumeric only)
SKU: Basic (sufficient for this project)
Admin Access: Enabled (for simple authentication)
```

**Naming Rules:**
- Must be globally unique across Azure
- 5-50 characters
- Alphanumeric only (no hyphens, underscores)

**Example Names:**
- `stoicwisdom2024acr`
- `yourcompanystoicacr`
- `johnsstoicapiacr`

**How to Create:**
```bash
az acr create \
  --resource-group stoic-wisdom-rg \
  --name youruniqueacr \
  --sku Basic \
  --admin-enabled true
```

### 3. Storage Account

**What:** Azure storage for persistent data
**Why:** SQLite database persists across container restarts

**Configuration:**
```bash
Name: <UNIQUE_NAME>storage (must be globally unique, lowercase, no special chars)
SKU: Standard_LRS (locally redundant storage)
```

**Naming Rules:**
- Must be globally unique across Azure
- 3-24 characters
- Lowercase letters and numbers only

**Example Names:**
- `stoicwisdom2024`
- `yourcompanystoic`
- `johnsstoicapi`

**How to Create:**
```bash
az storage account create \
  --resource-group stoic-wisdom-rg \
  --name youruniquestorage \
  --location eastus \
  --sku Standard_LRS
```

### 4. Azure File Share

**What:** File storage within storage account
**Why:** Mounts to container for database persistence

**Configuration:**
```bash
Name: stoic-data
Storage Account: (created in step 3)
```

**How to Create:**
```bash
STORAGE_KEY=$(az storage account keys list \
  --resource-group stoic-wisdom-rg \
  --account-name youruniquestorage \
  --query "[0].value" -o tsv)

az storage share create \
  --account-name youruniquestorage \
  --account-key $STORAGE_KEY \
  --name stoic-data
```

### 5. Azure Container Instance (ACI)

**What:** Serverless container hosting
**Why:** Runs your Docker container without managing servers

**Configuration:**
```bash
Name: stoic-wisdom-api
CPU: 0.5 cores
Memory: 0.5 GB
DNS Label: stoic-wisdom-api (creates public URL)
```

**Created by:** The deployment script

## Environment Variables Configuration

### Required for Deployment Script

Set these before running `azure/deploy.sh`:

```bash
export AZURE_RESOURCE_GROUP="stoic-wisdom-rg"
export AZURE_LOCATION="eastus"
export AZURE_ACR_NAME="youruniqueacr"
export AZURE_ACI_NAME="stoic-wisdom-api"
export AZURE_STORAGE_ACCOUNT="youruniquestorage"
export AZURE_FILE_SHARE="stoic-data"
```

### Required for Container Instance

These are set automatically by the deployment script:

```bash
DATABASE_URL=sqlite:/app/data/stoic_wisdom.db
PORT=3000
RUST_LOG=info
```

## GitHub Secrets Configuration

For CI/CD automation, configure these secrets in GitHub:

### 1. Create Azure Service Principal

```bash
# Get your subscription ID
az account show --query id -o tsv

# Create service principal (save the output!)
az ad sp create-for-rbac \
  --name "stoic-wisdom-api-sp" \
  --role contributor \
  --scopes /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/stoic-wisdom-rg \
  --sdk-auth
```

**Output will look like:**
```json
{
  "clientId": "...",
  "clientSecret": "...",
  "subscriptionId": "...",
  "tenantId": "...",
  "activeDirectoryEndpointUrl": "...",
  "resourceManagerEndpointUrl": "...",
  ...
}
```

### 2. Add GitHub Secrets

Go to your GitHub repository: Settings → Secrets and variables → Actions → New repository secret

| Secret Name | Value | How to Get |
|-------------|-------|------------|
| `AZURE_CREDENTIALS` | Full JSON output from service principal creation | Copy entire JSON from step 1 |
| `AZURE_RESOURCE_GROUP` | `stoic-wisdom-rg` | Your resource group name |
| `AZURE_ACR_NAME` | `youruniqueacr` | Your ACR name (no .azurecr.io) |
| `AZURE_ACI_NAME` | `stoic-wisdom-api` | Your ACI name |
| `AZURE_STORAGE_ACCOUNT` | `youruniquestorage` | Your storage account name |
| `AZURE_STORAGE_KEY` | `<storage_key>` | Run: `az storage account keys list --resource-group stoic-wisdom-rg --account-name youruniquestorage --query "[0].value" -o tsv` |

## Configuration Validation Checklist

### Pre-Deployment Validation

- [ ] Logged into Azure: `az login`
- [ ] Correct subscription selected: `az account show`
- [ ] All environment variables set
- [ ] ACR name is globally unique
- [ ] Storage account name is globally unique
- [ ] Resource group created
- [ ] ACR created
- [ ] Storage account created
- [ ] File share created

### Post-Deployment Validation

- [ ] Container instance running: `az container show -g stoic-wisdom-rg -n stoic-wisdom-api --query "instanceView.state"`
- [ ] Public IP assigned: `az container show -g stoic-wisdom-rg -n stoic-wisdom-api --query "ipAddress.fqdn"`
- [ ] API responding: `curl http://<FQDN>:3000/health`
- [ ] Database persisted: Check file share has `stoic_wisdom.db`

### GitHub Actions Validation

- [ ] All 6 secrets added to GitHub repository
- [ ] Service principal has contributor role
- [ ] Workflow file exists: `.github/workflows/azure-deploy.yml`
- [ ] Push to main branch triggers deployment
- [ ] Workflow runs successfully

## Cost Estimation

Monthly costs (approximate, as of 2024):

| Resource | Configuration | Monthly Cost |
|----------|--------------|--------------|
| ACI | 0.5 vCPU, 0.5 GB RAM | $10-15 |
| ACR Basic | Image storage | $5 |
| Storage Account | File share for DB | $0.50-1 |
| **Total** | | **$15-21** |

**Cost Optimization:**
- Stop ACI when not in use: `az container stop -g stoic-wisdom-rg -n stoic-wisdom-api`
- Use Azure Container Apps with scale-to-zero for dev/test
- Delete resources when not needed: `az group delete -n stoic-wisdom-rg`

## Naming Convention Reference

### Quick Reference Table

| Resource Type | Example Name | Format Rules |
|--------------|--------------|--------------|
| Resource Group | `stoic-wisdom-rg` | Alphanumeric, hyphens, underscores, periods |
| ACR | `stoicwisdom2024acr` | 5-50 chars, alphanumeric only, globally unique |
| Storage Account | `stoicwisdom2024` | 3-24 chars, lowercase alphanumeric, globally unique |
| File Share | `stoic-data` | Lowercase, alphanumeric, hyphens |
| ACI | `stoic-wisdom-api` | Alphanumeric, hyphens |

### Recommended Naming Pattern

For a team or company deployment:

```bash
# Use company/project prefix
COMPANY="acme"
PROJECT="stoic"

# Suggested names
RESOURCE_GROUP="${COMPANY}-${PROJECT}-rg"                    # acme-stoic-rg
ACR_NAME="${COMPANY}${PROJECT}acr"                          # acmestoicacr
STORAGE_ACCOUNT="${COMPANY}${PROJECT}storage"               # acmestoicstorage
ACI_NAME="${COMPANY}-${PROJECT}-api"                        # acme-stoic-api
```

## Troubleshooting Configuration Issues

### Issue: ACR Name Already Taken

**Error:** `The registry name is already taken.`

**Solution:** Try a different name with more uniqueness
```bash
# Add year or random suffix
stoicwisdom2024acr
stoicwisdomjohn01acr
stoicwisdomdev001acr
```

### Issue: Storage Account Name Already Taken

**Error:** `The storage account name is already taken.`

**Solution:** Try a different name
```bash
# Add identifier
stoicwisdom2024
stoicwisdomjohn
stoicwisdomdev001
```

### Issue: Service Principal Creation Fails

**Error:** `Insufficient privileges to complete the operation.`

**Solution:** You need Owner or User Access Administrator role on the subscription

### Issue: GitHub Actions Fails Authentication

**Error:** `AADSTS7000215: Invalid client secret provided.`

**Solutions:**
1. Verify `AZURE_CREDENTIALS` secret is complete JSON (no truncation)
2. Regenerate service principal: `az ad sp credential reset --name stoic-wisdom-api-sp --append`
3. Update `AZURE_CREDENTIALS` secret with new output

### Issue: Container Can't Pull Image

**Error:** `Failed to pull image: unauthorized`

**Solutions:**
1. Verify ACR admin is enabled: `az acr update -n youruniqueacr --admin-enabled true`
2. Check ACR credentials: `az acr credential show -n youruniqueacr`
3. Verify image exists: `az acr repository list -n youruniqueacr`

## Quick Start Commands

### Initial Setup (Run Once)

```bash
# 1. Set variables (CHANGE THESE!)
export AZURE_RESOURCE_GROUP="stoic-wisdom-rg"
export AZURE_LOCATION="eastus"
export AZURE_ACR_NAME="youruniqueacr"          # CHANGE ME
export AZURE_STORAGE_ACCOUNT="youruniquestorage"  # CHANGE ME

# 2. Login to Azure
az login

# 3. Create resources
az group create --name $AZURE_RESOURCE_GROUP --location $AZURE_LOCATION

az acr create \
  --resource-group $AZURE_RESOURCE_GROUP \
  --name $AZURE_ACR_NAME \
  --sku Basic \
  --admin-enabled true

az storage account create \
  --resource-group $AZURE_RESOURCE_GROUP \
  --name $AZURE_STORAGE_ACCOUNT \
  --location $AZURE_LOCATION \
  --sku Standard_LRS

STORAGE_KEY=$(az storage account keys list \
  --resource-group $AZURE_RESOURCE_GROUP \
  --account-name $AZURE_STORAGE_ACCOUNT \
  --query "[0].value" -o tsv)

az storage share create \
  --account-name $AZURE_STORAGE_ACCOUNT \
  --account-key $STORAGE_KEY \
  --name stoic-data

# 4. Run deployment
cd azure
./deploy.sh
```

### Verification Commands

```bash
# Check all resources
az resource list --resource-group stoic-wisdom-rg --output table

# Check container status
az container show -g stoic-wisdom-rg -n stoic-wisdom-api --query "instanceView.state"

# Get API URL
az container show -g stoic-wisdom-rg -n stoic-wisdom-api --query "ipAddress.fqdn" -o tsv

# View logs
az container logs -g stoic-wisdom-rg -n stoic-wisdom-api --follow
```

## Next Steps

1. ✅ Complete this configuration checklist
2. ✅ Run the deployment script: `azure/deploy.sh`
3. ✅ Test the API endpoints
4. ✅ Configure GitHub Actions for CI/CD
5. ✅ Set up monitoring and alerts (optional)

## Support Resources

- **Azure Documentation:** https://docs.microsoft.com/azure/
- **Azure CLI Reference:** https://docs.microsoft.com/cli/azure/
- **Container Instances Docs:** https://docs.microsoft.com/azure/container-instances/
- **Container Registry Docs:** https://docs.microsoft.com/azure/container-registry/
- **Project Repository:** https://github.com/CoforgeInsurance/stoic-wisdom-api
