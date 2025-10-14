# Project Overview

This project, Stoic Wisdom API, is designed to provide an API that allows users to explore the teachings of Stoic philosophers through curated quotes, themes, and incidents. Below are the key features and components of the project.

## Features
- Access to quotes from famous Stoic philosophers.
- Exploration of Stoic themes and their modern scientific connections.
- Rich historical context and incidents related to Stoicism.

## Tech Stack
- Rust with Axum for the web framework.
- SQLite for the database.
- Docker for containerization.
- Azure ACI and ACR for deployment.

## Quick Start Guide
To get started with the Stoic Wisdom API:
1. Clone the repository.
2. Run `docker-compose up` to start the application.

## API Endpoints
- `/philosophers`: Get a list of philosophers.
- `/quotes`: Retrieve curated quotes.
- `/themes`: Explore Stoic themes.

## Deployment Instructions
This project can be deployed to Azure Container Instances (ACI) and Azure Container Registry (ACR). Follow the instructions in the `azure/aci-deployment.yaml` file for deployment.

## Development Guidelines
- Ensure the code follows Rust best practices.
- Write tests for all new features.