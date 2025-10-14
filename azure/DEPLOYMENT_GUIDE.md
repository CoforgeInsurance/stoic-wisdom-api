# Azure Deployment Guide for Stoic Wisdom API

This guide provides comprehensive instructions for deploying the Stoic Wisdom API to Azure using Azure Container Registry (ACR) and Azure Container Instances (ACI).

## Prerequisites

1. **Azure Account**: An active Azure subscription
2. **Azure CLI**: Install from https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
3. **Docker**: Installed locally for building images
4. **Git**: For cloning the repository

## Configuration Variables

Before deployment, you need to configure the following variables. These can be set as environment variables or modified in the `azure/deploy.sh` script:

### Required Configuration

| Variable | Description | Example | Where to Configure |
|----------|-------------|---------|-------------------|
| `AZURE_RESOURCE_GROUP` | Azure resource group name | `stoic-wisdom-rg` | Environment variable or deploy.sh |
| `AZURE_LOCATION` | Azure region | `eastus` | Environment variable or deploy.sh |
| `AZURE_ACR_NAME` | Azure Container Registry name (must be globally unique) | `stoicwisdomacr` | Environment variable or deploy.sh |
| `AZURE_ACI_NAME` | Azure Container Instance name | `stoic-wisdom-api` | Environment variable or deploy.sh |
| `AZURE_STORAGE_ACCOUNT` | Storage account for persistent data (must be globally unique) | `stoicwisdomstorage` | Environment variable or deploy.sh |
| `AZURE_FILE_SHARE` | File share name for SQLite database | `stoic-data` | Environment variable or deploy.sh |

### Optional Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `IMAGE_TAG` | Docker image tag | `latest` |
| `PORT` | Application port | `3000` |
| `RUST_LOG` | Logging level | `info` |

## Deployment Methods

### Method 1: Automated Deployment (Recommended)

1. **Set Environment Variables**:
   ```bash
   export AZURE_RESOURCE_GROUP="stoic-wisdom-rg"
   export AZURE_LOCATION="eastus"
   export AZURE_ACR_NAME="youruniqueacrname"  # Must be globally unique
   export AZURE_ACI_NAME="stoic-wisdom-api"
   export AZURE_STORAGE_ACCOUNT="youruniquestorage"  # Must be globally unique
   export AZURE_FILE_SHARE="stoic-data"
   ```

2. **Login to Azure**:
   ```bash
   az login
   ```

3. **Run Deployment Script**:
   ```bash
   cd azure
   ./deploy.sh
   ```

   The script will:
   - Create resource group
   - Create Azure Container Registry
   - Build and push Docker image
   - Create storage account and file share
   - Deploy to Azure Container Instances
   - Display the API endpoint URL

### Method 2: Manual Deployment

#### Step 1: Create Resource Group
```bash
az group create \
  --name stoic-wisdom-rg \
  --location eastus
```

#### Step 2: Create Azure Container Registry
```bash
az acr create \
  --resource-group stoic-wisdom-rg \
  --name youruniqueacrname \
  --sku Basic \
  --admin-enabled true
```

#### Step 3: Build and Push Docker Image
```bash
# Login to ACR
az acr login --name youruniqueacrname

# Build image
docker build -t stoic-wisdom-api:latest .

# Tag for ACR
docker tag stoic-wisdom-api:latest youruniqueacrname.azurecr.io/stoic-wisdom-api:latest

# Push to ACR
docker push youruniqueacrname.azurecr.io/stoic-wisdom-api:latest
```

#### Step 4: Create Storage for Database
```bash
# Create storage account
az storage account create \
  --resource-group stoic-wisdom-rg \
  --name youruniquestorage \
  --location eastus \
  --sku Standard_LRS

# Get storage key
STORAGE_KEY=$(az storage account keys list \
  --resource-group stoic-wisdom-rg \
  --account-name youruniquestorage \
  --query "[0].value" \
  --output tsv)

# Create file share
az storage share create \
  --account-name youruniquestorage \
  --account-key $STORAGE_KEY \
  --name stoic-data
```

#### Step 5: Deploy to ACI
```bash
# Get ACR credentials
ACR_USERNAME=$(az acr credential show --name youruniqueacrname --query "username" -o tsv)
ACR_PASSWORD=$(az acr credential show --name youruniqueacrname --query "passwords[0].value" -o tsv)

# Deploy container
az container create \
  --resource-group stoic-wisdom-rg \
  --name stoic-wisdom-api \
  --image youruniqueacrname.azurecr.io/stoic-wisdom-api:latest \
  --registry-login-server youruniqueacrname.azurecr.io \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --dns-name-label stoic-wisdom-api \
  --ports 3000 \
  --cpu 0.5 \
  --memory 0.5 \
  --environment-variables \
    DATABASE_URL=sqlite:/app/data/stoic_wisdom.db \
    PORT=3000 \
    RUST_LOG=info \
  --azure-file-volume-account-name youruniquestorage \
  --azure-file-volume-account-key $STORAGE_KEY \
  --azure-file-volume-share-name stoic-data \
  --azure-file-volume-mount-path /app/data
```

## Post-Deployment

### Get API Endpoint
```bash
az container show \
  --resource-group stoic-wisdom-rg \
  --name stoic-wisdom-api \
  --query "ipAddress.fqdn" \
  --output tsv
```

The API will be available at: `http://<fqdn>:3000`

### View Logs
```bash
az container logs \
  --resource-group stoic-wisdom-rg \
  --name stoic-wisdom-api \
  --follow
```

### Test Endpoints
```bash
# Health check
curl http://<your-fqdn>:3000/health

# List philosophers
curl http://<your-fqdn>:3000/philosophers

# Get daily quote
curl http://<your-fqdn>:3000/quotes/daily
```

## Updating the Deployment

When you make code changes:

1. **Rebuild and push image**:
   ```bash
   docker build -t stoic-wisdom-api:latest .
   docker tag stoic-wisdom-api:latest youruniqueacrname.azurecr.io/stoic-wisdom-api:latest
   docker push youruniqueacrname.azurecr.io/stoic-wisdom-api:latest
   ```

2. **Restart container**:
   ```bash
   az container restart \
     --resource-group stoic-wisdom-rg \
     --name stoic-wisdom-api
   ```

## CI/CD Integration

### GitHub Actions Setup

To configure automated deployment with GitHub Actions, add these secrets to your repository:

1. Go to repository Settings → Secrets and variables → Actions
2. Add the following secrets:

| Secret Name | Description |
|-------------|-------------|
| `AZURE_CREDENTIALS` | Azure service principal credentials (JSON) |
| `AZURE_RESOURCE_GROUP` | Resource group name |
| `AZURE_ACR_NAME` | Container registry name |
| `AZURE_ACI_NAME` | Container instance name |
| `AZURE_STORAGE_ACCOUNT` | Storage account name |
| `AZURE_STORAGE_KEY` | Storage account key |

### Create Service Principal

```bash
az ad sp create-for-rbac \
  --name "stoic-wisdom-api-sp" \
  --role contributor \
  --scopes /subscriptions/<subscription-id>/resourceGroups/stoic-wisdom-rg \
  --sdk-auth
```

Copy the JSON output to the `AZURE_CREDENTIALS` secret.

## Monitoring and Maintenance

### View Container Status
```bash
az container show \
  --resource-group stoic-wisdom-rg \
  --name stoic-wisdom-api \
  --output table
```

### Check Resource Usage
```bash
az monitor metrics list \
  --resource /subscriptions/<subscription-id>/resourceGroups/stoic-wisdom-rg/providers/Microsoft.ContainerInstance/containerGroups/stoic-wisdom-api \
  --metric CPUUsage,MemoryUsage
```

### Access Container Shell (Debugging)
```bash
az container exec \
  --resource-group stoic-wisdom-rg \
  --name stoic-wisdom-api \
  --exec-command /bin/sh
```

## Cost Optimization

The current configuration uses:
- **ACI**: 0.5 vCPU, 0.5 GB RAM (approximately $10-15/month if running 24/7)
- **ACR Basic**: $5/month
- **Storage Account**: Minimal cost for small database (~$0.50/month)

**Total estimated cost**: ~$15-20/month

To reduce costs:
- Use Azure Container Apps with scale-to-zero capability
- Stop ACI when not in use: `az container stop --resource-group stoic-wisdom-rg --name stoic-wisdom-api`
- Start when needed: `az container start --resource-group stoic-wisdom-rg --name stoic-wisdom-api`

## Troubleshooting

### Container Won't Start
```bash
# Check logs
az container logs --resource-group stoic-wisdom-rg --name stoic-wisdom-api

# Check events
az container show --resource-group stoic-wisdom-rg --name stoic-wisdom-api --query "instanceView.events"
```

### Database Issues
```bash
# Verify file share is mounted
az container exec \
  --resource-group stoic-wisdom-rg \
  --name stoic-wisdom-api \
  --exec-command "ls -la /app/data"
```

### Network Issues
```bash
# Verify container is running
az container show \
  --resource-group stoic-wisdom-rg \
  --name stoic-wisdom-api \
  --query "instanceView.state"

# Check public IP
az container show \
  --resource-group stoic-wisdom-rg \
  --name stoic-wisdom-api \
  --query "ipAddress"
```

## Security Considerations

1. **Use Azure Key Vault**: Store sensitive configuration in Key Vault instead of environment variables
2. **Enable HTTPS**: Use Azure Application Gateway or Front Door for SSL termination
3. **Restrict Network Access**: Use virtual networks and network security groups
4. **Enable Diagnostics**: Configure Azure Monitor for logging and alerts
5. **Regular Updates**: Keep container images updated with security patches

## Cleanup

To remove all Azure resources:

```bash
az group delete \
  --name stoic-wisdom-rg \
  --yes \
  --no-wait
```

## Support

For issues or questions:
- Check the logs: `az container logs --resource-group stoic-wisdom-rg --name stoic-wisdom-api`
- Review Azure Container Instances documentation: https://docs.microsoft.com/en-us/azure/container-instances/
- Open an issue in the GitHub repository
