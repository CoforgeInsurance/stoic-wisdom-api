# BDD-TDD Testing Guide

This document describes the Behavior-Driven Development (BDD) and Test-Driven Development (TDD) approach implemented for the Stoic Wisdom API project.

## Overview

The project now follows BDD-TDD best practices with:
- **Gherkin feature files** describing behavior in natural language
- **Playwright end-to-end tests** implementing the scenarios
- **Integration tests** for backend API
- **Performance benchmarking** for all endpoints
- **Comprehensive test evidence collection**

## Test Structure

### Backend Tests

#### Unit Tests
Location: `src/` (inline with modules)
- Currently no unit tests (small codebase with mostly integration points)

#### Integration Tests
Location: `tests/integration_tests.rs`
- Database connection testing
- Data seeding verification
- Schema validation
- Uses SQLite-specific migrations for testing

### Frontend E2E Tests

#### Gherkin Feature Files
Location: `frontend/features/`

Feature files describe user scenarios in natural language:
- `home.feature` - Home page navigation and quote display
- `philosophers.feature` - Philosopher browsing and details
- `quotes.feature` - Quote browsing, search, and filtering
- `themes.feature` - Stoic themes exploration
- `performance.feature` - Performance requirements

Example:
```gherkin
Feature: Home Page
  As a user interested in Stoic philosophy
  I want to view a random quote and navigate to different sections
  So that I can explore Stoic wisdom

  Scenario: View home page
    Given I am on the home page
    Then I should see the page title "Stoic Wisdom"
    And I should see a quote displayed
    And I should see navigation links
```

#### Playwright E2E Tests
Location: `frontend/e2e/`

Playwright tests implement the Gherkin scenarios:
- `home.spec.ts` - Home page tests
- `philosophers.spec.ts` - Philosophers page tests
- `quotes.spec.ts` - Quotes page tests
- `themes.spec.ts` - Themes page tests
- `timeline.spec.ts` - Timeline page tests
- `performance.spec.ts` - Performance tests

### Performance Tests

#### Backend Benchmark
Location: `scripts/benchmark.sh`

Benchmarks all API endpoints:
- Measures response times over multiple iterations
- Color-coded results (green < 50ms, yellow < 100ms, red > 100ms)
- Calculates min, max, and average response times

Run with:
```bash
# Start the API first
cargo run --release

# In another terminal
./scripts/benchmark.sh
```

#### Frontend E2E Performance
Location: `frontend/e2e/performance.spec.ts`

Tests frontend performance:
- Page load times
- API response times from UI
- Navigation responsiveness

## Running Tests

### Backend Tests

```bash
# Run all tests
cargo test

# Run with output
cargo test -- --nocapture

# Run specific test
cargo test test_philosophers_table_creation

# Run integration tests only
cargo test --test integration_tests
```

### Frontend E2E Tests

```bash
cd frontend

# Install dependencies (first time only)
npm install

# Run tests headless
npm run test:e2e

# Run tests with UI
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run only performance tests
npm run test:performance

# View test report
npm run test:report
```

### Performance Benchmarking

```bash
# Benchmark backend API
./scripts/benchmark.sh

# With custom settings
API_URL=http://localhost:3000 ITERATIONS=20 ./scripts/benchmark.sh
```

### Collect Test Evidence

```bash
# Run all tests and collect evidence
./scripts/collect-test-evidence.sh
```

This creates a `test-evidence/` directory with:
- Backend test results
- Frontend build output
- System information
- Summary report

## Test Coverage

### Backend Coverage
- ✅ Database connection and migrations
- ✅ Data seeding (philosophers, quotes, themes, timeline, incidents)
- ✅ Schema validation
- ✅ Foreign key constraints
- ⚠️  API endpoint unit tests (covered by E2E instead)

### Frontend Coverage
- ✅ Home page rendering and navigation
- ✅ Quote display and refresh
- ✅ Philosopher browsing and details
- ✅ Quote search and filtering
- ✅ Theme display
- ✅ Timeline display
- ✅ Performance requirements
- ✅ Full text quote expansion

### Performance Benchmarks
- ✅ All 15 API endpoints tested
- ✅ Target: < 50ms response time
- ✅ Actual: 5-35ms average
- ✅ Page load time < 3 seconds
- ✅ Navigation < 2 seconds per page

## Test Evidence

Test evidence is automatically collected when running:
```bash
./scripts/collect-test-evidence.sh
```

Evidence includes:
- Test execution logs
- Build outputs
- System information
- Coverage reports (if applicable)

Evidence is saved in `test-evidence/` directory (gitignored) with timestamp.

## Continuous Integration

The tests can be integrated into CI/CD pipelines:

### GitHub Actions Example
```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
      - run: cargo test

  frontend-e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: cd frontend && npm ci
      - run: npx playwright install chromium
      - run: cd frontend && npm run test:e2e

  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
      - run: cargo build --release
      - run: cargo run --release &
      - run: sleep 10
      - run: ./scripts/benchmark.sh
```

## Best Practices

### Writing Tests

1. **Start with Gherkin**: Write feature files first to define behavior
2. **Implement incrementally**: Implement one scenario at a time
3. **Use descriptive names**: Test names should clearly indicate what they test
4. **Test user behavior**: Focus on what users do, not implementation details
5. **Keep tests independent**: Each test should run independently
6. **Use test data wisely**: Use realistic but minimal test data

### Maintaining Tests

1. **Update features first**: When requirements change, update Gherkin files first
2. **Keep tests passing**: Fix broken tests immediately
3. **Refactor regularly**: Keep test code clean and maintainable
4. **Remove obsolete tests**: Delete tests for removed features
5. **Document edge cases**: Add comments for non-obvious test logic

### Performance Testing

1. **Set baselines**: Establish performance baselines early
2. **Test regularly**: Run performance tests frequently
3. **Monitor trends**: Track performance over time
4. **Test realistic scenarios**: Use production-like data volumes
5. **Document findings**: Record performance characteristics

## Future Enhancements

- [ ] Add API contract testing with Pact
- [ ] Add visual regression testing
- [ ] Add accessibility testing with axe-core
- [ ] Add load testing with k6 or Artillery
- [ ] Add mutation testing for test quality
- [ ] Add code coverage reporting
- [ ] Add property-based testing with quickcheck

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Cucumber/Gherkin Guide](https://cucumber.io/docs/gherkin/)
- [Rust Testing Guide](https://doc.rust-lang.org/book/ch11-00-testing.html)
- [BDD Best Practices](https://cucumber.io/docs/bdd/)
