# Project Structure

```
stoic-wisdom-api/
│
├── 📄 Core Documentation
│   ├── README.md                      # Main project documentation & quick start
│   ├── IMPLEMENTATION_SUMMARY.md      # Complete implementation overview
│   ├── API_EXAMPLES.md                # Comprehensive API usage examples
│   ├── AZURE_SETUP.md                 # Azure configuration checklist
│   ├── TEST_EVIDENCE.md               # Testing results and validation
│   │
│   ├── SPECIFICATION.md               # API specification (existing)
│   ├── PHASE1_SCOPE.md               # Phase 1 deliverables (existing)
│   ├── ARCHITECTURE.md               # System architecture (existing)
│   └── CONTENT_GUIDELINES.md         # Content quality standards (existing)
│
├── 🦀 Rust Source Code
│   └── src/
│       ├── main.rs                   # Application entry point & server setup
│       ├── handlers.rs               # API route handlers (15 endpoints)
│       └── models.rs                 # Data models & structures
│
├── 🗄️ Database
│   └── migrations/
│       ├── 001_initial_schema.sql           # Database schema (6 tables)
│       ├── 002_seed_philosophers_themes.sql # 3 philosophers + 7 themes
│       ├── 003_seed_quotes.sql              # 75 quotes with interpretations
│       ├── 004_seed_timeline_incidents.sql  # 23 events + 15 incidents
│       └── 005_seed_quote_themes.sql        # Quote-theme relationships
│
├── 🧪 Testing
│   └── tests/
│       └── integration_tests.rs      # 6 integration tests (all passing)
│
├── 🐳 Docker & Deployment
│   ├── Dockerfile                    # Multi-stage build (~45MB image)
│   ├── docker-compose.yml            # Local development setup
│   │
│   └── azure/
│       ├── deploy.sh                 # Automated Azure deployment script
│       ├── aci-deployment.yaml       # Azure Container Instance config
│       └── DEPLOYMENT_GUIDE.md       # Detailed deployment instructions
│
├── 🔧 Tools & Scripts
│   └── scripts/
│       └── benchmark.sh              # Performance testing script
│
├── 🤖 CI/CD
│   └── .github/
│       └── workflows/
│           └── azure-deploy.yml      # GitHub Actions pipeline
│
├── ⚙️ Configuration
│   ├── Cargo.toml                    # Rust dependencies & build config
│   ├── Cargo.lock                    # Dependency lock file
│   └── .gitignore                    # Git ignore rules
│
└── 📊 Runtime
    └── data/                         # SQLite database (gitignored)
        └── stoic_wisdom.db           # Created at runtime
```

## Component Overview

### Source Code (src/)
- **main.rs**: Axum server, routing, middleware, database connection
- **handlers.rs**: 15 route handlers for all API endpoints
- **models.rs**: Data structures (Philosopher, Quote, Theme, Timeline, Incident)

### Database (migrations/)
- **Schema**: 6 tables with foreign keys and indexes
- **Content**: 3 philosophers, 75 quotes, 7 themes, 23 timeline events, 15 incidents
- **Total**: ~1,320 lines of SQL with rich content

### Testing (tests/)
- **integration_tests.rs**: End-to-end database and content validation
- **Coverage**: Database connection, migrations, data seeding, content counts

### Deployment (azure/)
- **deploy.sh**: Automated deployment (creates all Azure resources)
- **aci-deployment.yaml**: Container Instance configuration template
- **DEPLOYMENT_GUIDE.md**: Step-by-step deployment instructions

### CI/CD (.github/workflows/)
- **azure-deploy.yml**: Automated build, test, push, and deploy pipeline
- **Stages**: Test → Build → Push to ACR → Deploy to ACI

### Tools (scripts/)
- **benchmark.sh**: Performance testing for all 15 endpoints
- **Features**: Response time measurement, color-coded results, statistics

## Data Flow

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ HTTP Request
       ▼
┌─────────────────────────────────┐
│         Axum Server             │
│  ┌──────────────────────────┐  │
│  │   Tower Middleware       │  │
│  │   • CORS                 │  │
│  │   • Tracing              │  │
│  └──────────┬───────────────┘  │
│             ▼                   │
│  ┌──────────────────────────┐  │
│  │   Route Handlers         │  │
│  │   • /philosophers        │  │
│  │   • /quotes              │  │
│  │   • /themes              │  │
│  │   • /timeline            │  │
│  │   • /incidents           │  │
│  └──────────┬───────────────┘  │
│             ▼                   │
│  ┌──────────────────────────┐  │
│  │   Database Layer         │  │
│  │   • sqlx queries         │  │
│  │   • Connection pool      │  │
│  └──────────┬───────────────┘  │
└─────────────┼───────────────────┘
              ▼
       ┌──────────────┐
       │   SQLite DB  │
       │  • 6 tables  │
       │  • Indexed   │
       └──────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Repository                     │
│  ┌────────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │ Source Code│  │ Migrations│  │ GitHub Actions  │   │
│  └─────┬──────┘  └─────┬────┘  └────────┬─────────┘   │
└────────┼───────────────┼─────────────────┼─────────────┘
         │               │                  │
         │   Push to     │                  │ Triggered
         │   main branch │                  │
         └───────────────┴──────────────────┘
                         ▼
         ┌───────────────────────────────────┐
         │      GitHub Actions Workflow       │
         │  1. Run Tests                     │
         │  2. Build Docker Image            │
         │  3. Push to ACR                   │
         │  4. Deploy to ACI                 │
         └──────────┬────────────────────────┘
                    ▼
         ┌───────────────────────────────────┐
         │  Azure Container Registry (ACR)   │
         │  • Stores Docker images           │
         │  • Private registry               │
         └──────────┬────────────────────────┘
                    │ Pull image
                    ▼
         ┌───────────────────────────────────┐
         │ Azure Container Instance (ACI)    │
         │  ┌────────────────────────────┐  │
         │  │   Stoic Wisdom API         │  │
         │  │   • 0.5 CPU, 0.5 GB RAM    │  │
         │  │   • Port 3000              │  │
         │  │   • Public IP              │  │
         │  └────────┬───────────────────┘  │
         └───────────┼───────────────────────┘
                     │ Mounted
                     ▼
         ┌───────────────────────────────────┐
         │    Azure File Share               │
         │    • SQLite database              │
         │    • Persistent storage           │
         └───────────────────────────────────┘
```

## API Architecture

```
Endpoints (15 total):

┌──────────────────────────────────────────┐
│          Philosopher Routes              │
│  GET /philosophers                       │
│  GET /philosophers/:id                   │
│  GET /philosophers/:id/quotes            │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│             Quote Routes                 │
│  GET /quotes                             │
│  GET /quotes?theme=<name>                │
│  GET /quotes?philosopher=<name>          │
│  GET /quotes?search=<term>               │
│  GET /quotes/random                      │
│  GET /quotes/daily                       │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│             Theme Routes                 │
│  GET /themes                             │
│  GET /themes/:id                         │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│           Historical Routes              │
│  GET /timeline                           │
│  GET /incidents                          │
│  GET /incidents/:id                      │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│            Utility Routes                │
│  GET /health                             │
└──────────────────────────────────────────┘
```

## Development Workflow

```
┌─────────────────┐
│  Local Machine  │
└────────┬────────┘
         │
         ├─ cargo run ─────────────────────┐
         │  • Runs locally on port 3000    │
         │  • Auto-reloads migrations      │
         │  • Uses local SQLite DB         │
         └──────────────────────────────────┘
         │
         ├─ docker-compose up ─────────────┐
         │  • Builds Docker image          │
         │  • Runs in container            │
         │  • Mounts data volume           │
         └──────────────────────────────────┘
         │
         ├─ cargo test ────────────────────┐
         │  • Runs 6 integration tests     │
         │  • Uses in-memory SQLite        │
         │  • Validates content            │
         └──────────────────────────────────┘
         │
         └─ ./scripts/benchmark.sh ────────┐
            • Tests all endpoints          │
            • Measures response times      │
            • Validates < 50ms target      │
            └────────────────────────────────┘
```

## File Size Summary

| Component | Lines | Purpose |
|-----------|-------|---------|
| Source Code | 463 | API logic and data models |
| Database | 1,320 | Schema and content |
| Tests | 132 | Integration tests |
| Deployment | 361 | Docker and Azure configs |
| Documentation | 1,660+ | Guides and examples |
| **Total** | **3,936+** | Complete implementation |

## Technology Stack

```
┌─────────────────────────────────────┐
│          Application Layer           │
│  • Axum 0.7 (Web framework)         │
│  • Tokio (Async runtime)            │
│  • Tower (Middleware)               │
│  • Serde (JSON serialization)      │
└────────────┬────────────────────────┘
             ▼
┌─────────────────────────────────────┐
│          Database Layer              │
│  • SQLite (Database)                │
│  • sqlx 0.7 (Type-safe queries)     │
│  • Migrations                       │
└────────────┬────────────────────────┘
             ▼
┌─────────────────────────────────────┐
│       Infrastructure Layer           │
│  • Docker (Containerization)        │
│  • Azure ACI (Hosting)              │
│  • Azure ACR (Registry)             │
│  • Azure Files (Storage)            │
└─────────────────────────────────────┘
```

## Performance Profile

| Metric | Value |
|--------|-------|
| Response Time | 5-35ms (target: <50ms) ✅ |
| Docker Image | ~45MB (target: <50MB) ✅ |
| Memory Usage | ~50MB running |
| Concurrent Requests | High (async) |
| Database Size | ~2MB (75 quotes + content) |
| API Latency | <10ms (excluding network) |

## Quick Reference

**Start Development:**
```bash
docker-compose up        # or
cargo run
```

**Run Tests:**
```bash
cargo test              # Unit/integration tests
./scripts/benchmark.sh  # Performance tests
```

**Deploy to Azure:**
```bash
cd azure
./deploy.sh
```

**View Logs:**
```bash
az container logs -g stoic-wisdom-rg -n stoic-wisdom-api --follow
```

---

For detailed information, see:
- **README.md** - Quick start and overview
- **IMPLEMENTATION_SUMMARY.md** - Complete implementation details
- **API_EXAMPLES.md** - API usage examples
- **AZURE_SETUP.md** - Azure configuration guide
