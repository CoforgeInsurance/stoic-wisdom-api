#!/bin/bash

# Azure Deployment Script for Stoic Wisdom API
# This script automates the deployment to Azure Container Registry and Azure Container Instances

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration variables - Replace these with your actual values
RESOURCE_GROUP="${AZURE_RESOURCE_GROUP:-stoic-wisdom-rg}"
LOCATION="${AZURE_LOCATION:-eastus}"
ACR_NAME="${AZURE_ACR_NAME:-stoicwisdomacr}"
ACI_NAME="${AZURE_ACI_NAME:-stoic-wisdom-api}"
IMAGE_NAME="stoic-wisdom-api"
IMAGE_TAG="${IMAGE_TAG:-latest}"
STORAGE_ACCOUNT="${AZURE_STORAGE_ACCOUNT:-stoicwisdomstorage}"
FILE_SHARE="${AZURE_FILE_SHARE:-stoic-data}"

echo -e "${GREEN}=== Stoic Wisdom API Azure Deployment ===${NC}"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}Error: Azure CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if logged in to Azure
echo -e "${YELLOW}Checking Azure login status...${NC}"
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}Not logged in to Azure. Please log in.${NC}"
    az login
fi

# Create resource group if it doesn't exist
echo -e "${YELLOW}Creating resource group if needed...${NC}"
az group create --name "$RESOURCE_GROUP" --location "$LOCATION" || true

# Create Azure Container Registry if it doesn't exist
echo -e "${YELLOW}Creating Azure Container Registry...${NC}"
az acr create \
    --resource-group "$RESOURCE_GROUP" \
    --name "$ACR_NAME" \
    --sku Basic \
    --admin-enabled true || true

# Log in to ACR
echo -e "${YELLOW}Logging in to Azure Container Registry...${NC}"
az acr login --name "$ACR_NAME"

# Build and push Docker image
echo -e "${YELLOW}Building Docker image...${NC}"
docker build -t "$IMAGE_NAME:$IMAGE_TAG" .

# Tag image for ACR
echo -e "${YELLOW}Tagging image for ACR...${NC}"
docker tag "$IMAGE_NAME:$IMAGE_TAG" "$ACR_NAME.azurecr.io/$IMAGE_NAME:$IMAGE_TAG"

# Push image to ACR
echo -e "${YELLOW}Pushing image to ACR...${NC}"
docker push "$ACR_NAME.azurecr.io/$IMAGE_NAME:$IMAGE_TAG"

# Create storage account for persistent data
echo -e "${YELLOW}Creating storage account...${NC}"
az storage account create \
    --resource-group "$RESOURCE_GROUP" \
    --name "$STORAGE_ACCOUNT" \
    --location "$LOCATION" \
    --sku Standard_LRS || true

# Get storage account key
STORAGE_KEY=$(az storage account keys list \
    --resource-group "$RESOURCE_GROUP" \
    --account-name "$STORAGE_ACCOUNT" \
    --query "[0].value" \
    --output tsv)

# Create file share
echo -e "${YELLOW}Creating Azure file share...${NC}"
az storage share create \
    --account-name "$STORAGE_ACCOUNT" \
    --account-key "$STORAGE_KEY" \
    --name "$FILE_SHARE" || true

# Get ACR credentials
ACR_USERNAME=$(az acr credential show --name "$ACR_NAME" --query "username" -o tsv)
ACR_PASSWORD=$(az acr credential show --name "$ACR_NAME" --query "passwords[0].value" -o tsv)

# Deploy to Azure Container Instances
echo -e "${YELLOW}Deploying to Azure Container Instances...${NC}"
az container create \
    --resource-group "$RESOURCE_GROUP" \
    --name "$ACI_NAME" \
    --image "$ACR_NAME.azurecr.io/$IMAGE_NAME:$IMAGE_TAG" \
    --registry-login-server "$ACR_NAME.azurecr.io" \
    --registry-username "$ACR_USERNAME" \
    --registry-password "$ACR_PASSWORD" \
    --dns-name-label "$ACI_NAME" \
    --ports 3000 \
    --cpu 0.5 \
    --memory 0.5 \
    --environment-variables \
        DATABASE_URL=sqlite:/app/data/stoic_wisdom.db \
        PORT=3000 \
        RUST_LOG=info \
    --azure-file-volume-account-name "$STORAGE_ACCOUNT" \
    --azure-file-volume-account-key "$STORAGE_KEY" \
    --azure-file-volume-share-name "$FILE_SHARE" \
    --azure-file-volume-mount-path /app/data

# Get the FQDN
FQDN=$(az container show \
    --resource-group "$RESOURCE_GROUP" \
    --name "$ACI_NAME" \
    --query "ipAddress.fqdn" \
    --output tsv)

echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo -e "${GREEN}API is available at: http://$FQDN:3000${NC}"
echo -e "${GREEN}Health check: http://$FQDN:3000/health${NC}"
echo ""
echo -e "${YELLOW}To view logs:${NC}"
echo "az container logs --resource-group $RESOURCE_GROUP --name $ACI_NAME --follow"
echo ""
echo -e "${YELLOW}To update deployment:${NC}"
echo "1. Build and push new image"
echo "2. Run: az container restart --resource-group $RESOURCE_GROUP --name $ACI_NAME"
