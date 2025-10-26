# Stoic Wisdom

A complete full-stack application providing access to Stoic philosophy through a high-performance Rust API and a vintage-themed Next.js frontend.

<!-- Deployment trigger for workflow run #19 -->

## 🌟 Overview

**Backend API**: High-performance Rust API delivering Stoic wisdom through RESTful endpoints  
**Frontend**: Vintage-themed Next.js web application with server-side rendering

**Deployment**: Render.com (PostgreSQL + Docker + Node.js SSR)
- Easy one-click deployment via Blueprint
- Automatic CI/CD from GitHub
- Free tier available

See [Render.com Deployment Guide](RENDER_DEPLOYMENT_GUIDE.md) for deployment instructions.

## ✨ Features

### Backend API
- **75+ High-Quality Quotes**: Carefully curated quotes from Marcus Aurelius, Seneca, and Epictetus with modern interpretations
- **3 Philosopher Profiles**: Rich biographies detailing their lives, key works, and core teachings
- **7 Core Stoic Themes**: With connections to CBT, neuroscience, and modern psychology
- **Historical Timeline**: 24 key events in Stoic philosophy from 300 BCE to present
- **15 Historical Incidents**: Stories with lessons and modern relevance
- **High Performance**: Response times < 50ms, Docker image < 50MB
- **Production Ready**: Render.com deployment with PostgreSQL

### Frontend Application
- **Vintage Design**: Classic serif typography and aged paper aesthetic
- **Responsive Layout**: Mobile-friendly design that works on all devices
- **Interactive Features**:
  - Random quote generator with refresh
  - Philosophers explorer with detailed biographies
  - Searchable quotes with filtering
  - Stoic themes with modern applications
  - Historical timeline visualization
  - "Surprise Me" page with random content
- **Modern Tech**: Next.js 15 SSR, TypeScript, Tailwind CSS, SWR
- **Performance**: Server-side rendering, optimized builds, fast page loads

## 🏗️ Tech Stack

### Backend
- **Framework**: Axum (async web framework)
- **Runtime**: Tokio (async runtime)
- **Database**: PostgreSQL with sqlx (type-safe queries, SQLite also supported)
- **Containerization**: Docker with multi-stage builds
- **Cloud**: Render.com Web Services
- **CI/CD**: Automatic deployment from GitHub

### Frontend
- **Framework**: Next.js 15 (App Router with SSR)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Data Fetching**: SWR
- **Fonts**: Crimson Text (serif), Lato (sans-serif)
- **Deployment**: Render.com Web Services (Node.js)

## 🚀 Quick Start

### Backend API

#### Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/CoforgeInsurance/stoic-wisdom-api.git
cd stoic-wisdom-api

# Start the application
docker-compose up

# The API will be available at http://localhost:3000
```

#### Using Cargo (Development)

```bash
# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Clone and build
git clone https://github.com/CoforgeInsurance/stoic-wisdom-api.git
cd stoic-wisdom-api
cargo build --release

# Run the application
cargo run --release

# The API will be available at http://localhost:3000
```

### Frontend Application

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# The app will be available at http://localhost:3000
```

For production deployment to Render.com, see [RENDER_DEPLOYMENT_GUIDE.md](RENDER_DEPLOYMENT_GUIDE.md).

## 📸 Screenshots

### Landing Page
![Landing Page](https://github.com/user-attachments/assets/1c746830-c109-446d-ae40-6f0dac18b7e2)

### Philosophers Page
![Philosophers](https://github.com/user-attachments/assets/56f88cb8-9ba2-47a9-a8e2-9a4429137285)

## API Endpoints

### Philosophers

- `GET /philosophers` - List all philosophers
- `GET /philosophers/:id` - Get philosopher details
- `GET /philosophers/:id/quotes` - Get philosopher with all their quotes

### Quotes

- `GET /quotes` - List all quotes (supports filtering)
  - Query parameters:
    - `theme` - Filter by theme name
    - `philosopher` - Filter by philosopher name
    - `search` - Search in quote text and interpretations
- `GET /quotes/random` - Get a random quote
- `GET /quotes/daily` - Get the quote of the day (consistent per day)

### Themes

- `GET /themes` - List all Stoic themes
- `GET /themes/:id` - Get theme details with scientific connections

### Timeline

- `GET /timeline` - Get historical timeline of Stoicism

### Incidents

- `GET /incidents` - List all historical incidents
- `GET /incidents/:id` - Get incident details

### Health Check

- `GET /health` - Health check endpoint

## API Examples

### Get All Philosophers

```bash
curl http://localhost:3000/philosophers
```

<details>
<summary>Response</summary>

```json
[
  {
    "id": 1,
    "name": "Marcus Aurelius",
    "era": "Roman Empire",
    "birth_year": 121,
    "death_year": 180,
    "biography": "Marcus Aurelius was Roman Emperor from 161 to 180 CE...",
    "key_works": "Meditations (Ta eis heauton)",
    "core_teachings": "Focus on what you can control; Accept fate with equanimity..."
  }
]
```
</details>

### Get Daily Quote

```bash
curl http://localhost:3000/quotes/daily
```

<details>
<summary>Response</summary>

```json
{
  "id": 1,
  "philosopher_id": 1,
  "philosopher_name": "Marcus Aurelius",
  "text": "You have power over your mind - not outside events. Realize this, and you will find strength.",
  "source": "Meditations, Book 8",
  "context": "Written during the Marcomannic Wars while dealing with plague and military challenges",
  "modern_interpretation": "This encapsulates the dichotomy of control..."
}
```
</details>

### Search Quotes by Theme

```bash
curl "http://localhost:3000/quotes?theme=Dichotomy%20of%20Control"
```

### Get All Themes

```bash
curl http://localhost:3000/themes
```

<details>
<summary>Response</summary>

```json
[
  {
    "id": 1,
    "name": "Dichotomy of Control",
    "description": "The fundamental distinction between what is within our control...",
    "principle": "Focus on what you can control, accept what you cannot.",
    "scientific_connection": "Research in stress psychology shows...",
    "cbt_connection": "CBT's core principle of separating thoughts from events...",
    "neuroscience_connection": "Neuroscience research shows that the prefrontal cortex...",
    "psychology_connection": "Aligns with locus of control research by Rotter..."
  }
]
```
</details>

## Development

### Running Tests

```bash
# Run all tests
cargo test

# Run with output
cargo test -- --nocapture

# Run specific test
cargo test test_philosophers_table_creation
```

### Code Quality

```bash
# Format code
cargo fmt

# Run linter
cargo clippy

# Check for issues
cargo clippy -- -D warnings
```

### Database Migrations

Migrations are automatically applied on startup. Manual migration:

```bash
# Install sqlx-cli
cargo install sqlx-cli --no-default-features --features sqlite

# Run migrations
sqlx migrate run
```

## Deployment

### Render.com Deployment (Recommended)

The easiest way to deploy is using Render's Blueprint feature.

**One-Click Deploy:**

1. Sign in to [Render.com](https://render.com)
2. Click "New +" → "Blueprint"
3. Connect to `CoforgeInsurance/stoic-wisdom-api`
4. Render automatically detects `render.yaml`
5. Click "Apply" and wait for deployment

**Services Created:**
- PostgreSQL database (managed)
- Backend API (Docker)
- Frontend SSR app (Node.js)

**Complete Guide:** See [RENDER_DEPLOYMENT_GUIDE.md](RENDER_DEPLOYMENT_GUIDE.md) for detailed instructions.

### Local Development with PostgreSQL

Use Docker Compose to run PostgreSQL locally:

```bash
# Start PostgreSQL and API
docker-compose up

# The database will be available at postgresql://postgres:postgres@localhost:5432/stoic_wisdom
```

### CI/CD

Render.com automatically deploys when you push to `main`:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Deployment happens automatically - no GitHub Actions configuration needed!

## Performance

- **Response Time**: < 50ms for most endpoints
- **Docker Image**: < 50MB (multi-stage build with Alpine)
- **Memory Footprint**: ~50MB running container
- **Database**: PostgreSQL with connection pooling (SQLite supported for local dev)
- **Optimization**: Release build with LTO and stripped binaries

## Project Structure

```
stoic-wisdom-api/
├── src/
│   ├── main.rs           # Application entry point
│   ├── models.rs         # Data models
│   └── handlers.rs       # API route handlers
├── migrations/           # Database migrations and seed data
│   ├── 001_initial_schema.sql
│   ├── 002_seed_philosophers_themes.sql
│   ├── 003_seed_quotes.sql
│   ├── 004_seed_timeline_incidents.sql
│   └── 005_seed_quote_themes.sql
├── frontend/             # Next.js SSR frontend
│   ├── app/              # Next.js app router
│   ├── components/       # React components
│   ├── lib/              # API client and utilities
│   └── public/           # Static assets
├── scripts/              # Deployment and migration scripts
│   └── migrate_sqlite_to_postgres.sh
├── tests/                # Integration tests
├── Cargo.toml            # Rust dependencies
├── Dockerfile            # Multi-stage Docker build
├── docker-compose.yml    # Local development setup
├── render.yaml           # Render.com deployment config
└── .env.example          # Environment variable template
```

## Architecture

### Technology Choices

- **Axum**: High-performance async web framework built on Tokio
- **PostgreSQL**: Robust relational database with excellent scalability (SQLite also supported)
- **sqlx**: Compile-time checked SQL queries for type safety
- **Tower**: Middleware for CORS and tracing

### Performance Optimizations

1. **Async/Await**: Non-blocking I/O for high concurrency
2. **Connection Pooling**: Efficient database connection management
3. **Compile-Time Checks**: SQL queries validated at compile time
4. **Release Optimizations**: LTO, single codegen unit, stripped binaries
5. **Multi-Stage Docker**: Minimal runtime image (~45MB)

### Scalability

- **Horizontal Scaling**: Stateless API design allows multiple instances on Render.com
- **Database Scaling**: PostgreSQL supports read replicas and vertical scaling
- **Caching**: Easy to add Redis for frequently accessed data
- **CDN**: Responses can be cached at edge locations

## Content Quality

### Quotes (75 total)
- 25 from Marcus Aurelius
- 25 from Seneca
- 25 from Epictetus
- All with sources, context, and modern interpretations

### Themes (7 core principles)
1. Dichotomy of Control
2. Negative Visualization
3. Virtue as the Sole Good
4. Amor Fati
5. Memento Mori
6. Cosmopolitanism
7. Present Moment Focus

Each theme includes scientific connections to CBT, neuroscience, and psychology.

### Historical Content
- 24 timeline events from 300 BCE to 2015 CE
- 15 incidents with lessons and modern relevance
- Rich biographical content for all three philosophers

## Testing Evidence

### Backend API

Run tests to verify implementation:

```bash
# Run tests and save output
cargo test 2>&1 | tee test-results.txt

# Test specific functionality
cargo test test_philosophers_seeded
cargo test test_quotes_seeded
cargo test test_themes_seeded
```

All tests verify:
- Database schema creation
- Data seeding (philosophers, quotes, themes, timeline, incidents)
- Data integrity and counts

### Frontend Application

```bash
# Navigate to frontend directory
cd frontend

# Build for production
npm run build

# Run development server for testing
npm run dev
```

Manual testing checklist:
- All navigation links work
- Random quote refreshes properly
- Search and filtering work correctly
- Responsive design on mobile devices
- No console errors
- CORS configuration works

## 📚 Documentation

- **[Render.com Deployment Guide](RENDER_DEPLOYMENT_GUIDE.md)** - Complete deployment guide for Render.com
- **[API Examples](API_EXAMPLES.md)** - Comprehensive API usage guide with examples
- **[Frontend Summary](FRONTEND_SUMMARY.md)** - Complete frontend implementation details
- **[Frontend README](frontend/README.md)** - Frontend-specific documentation
- **[Architecture](ARCHITECTURE.md)** - System architecture overview
- **[API Specification](SPECIFICATION.md)** - API specification and data models
- **[Project Structure](PROJECT_STRUCTURE.md)** - Complete project structure guide

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `cargo test` (backend) or `npm run build` (frontend)
5. Run linter: `cargo clippy` (backend)
6. Format code: `cargo fmt` (backend)
7. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check the [Render.com Deployment Guide](RENDER_DEPLOYMENT_GUIDE.md)
- Review the [API Examples](API_EXAMPLES.md)
- Review the API specification in [SPECIFICATION.md](SPECIFICATION.md)

---

**Built with ❦ for learning and exploration of Stoic philosophy**
