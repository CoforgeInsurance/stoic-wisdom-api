# API Usage Examples

This document provides comprehensive examples for using the Stoic Wisdom API.

## Base URL

- **Local Development**: `http://localhost:3000`
- **Azure Deployment**: `http://<your-fqdn>:3000`

## Table of Contents

- [Philosophers Endpoints](#philosophers-endpoints)
- [Quotes Endpoints](#quotes-endpoints)
- [Themes Endpoints](#themes-endpoints)
- [Timeline Endpoint](#timeline-endpoint)
- [Incidents Endpoints](#incidents-endpoints)
- [Health Check](#health-check)
- [Response Formats](#response-formats)
- [Error Handling](#error-handling)

## Philosophers Endpoints

### List All Philosophers

Retrieve all three Stoic philosophers with full biographical information.

```bash
curl http://localhost:3000/philosophers
```

**Response:**
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
  },
  {
    "id": 2,
    "name": "Seneca",
    "era": "Roman Empire",
    "birth_year": -4,
    "death_year": 65,
    "biography": "Lucius Annaeus Seneca, known as Seneca the Younger...",
    "key_works": "Letters from a Stoic; On the Shortness of Life...",
    "core_teachings": "Time is our most precious resource..."
  },
  {
    "id": 3,
    "name": "Epictetus",
    "era": "Roman Empire",
    "birth_year": 50,
    "death_year": 135,
    "biography": "Epictetus was born a slave in Hierapolis...",
    "key_works": "The Discourses; The Enchiridion (Handbook)",
    "core_teachings": "Master the dichotomy of control..."
  }
]
```

### Get Specific Philosopher

```bash
curl http://localhost:3000/philosophers/1
```

### Get Philosopher with All Their Quotes

```bash
curl http://localhost:3000/philosophers/1/quotes
```

**Response:**
```json
{
  "id": 1,
  "name": "Marcus Aurelius",
  "era": "Roman Empire",
  "birth_year": 121,
  "death_year": 180,
  "biography": "...",
  "key_works": "Meditations (Ta eis heauton)",
  "core_teachings": "Focus on what you can control...",
  "quotes": [
    {
      "id": 1,
      "philosopher_id": 1,
      "text": "You have power over your mind - not outside events...",
      "source": "Meditations, Book 8",
      "context": "Written during the Marcomannic Wars...",
      "modern_interpretation": "This encapsulates the dichotomy of control..."
    }
    // ... 24 more quotes
  ]
}
```

## Quotes Endpoints

### List All Quotes

Retrieve all 75 quotes with philosopher names.

```bash
curl http://localhost:3000/quotes
```

**Response:**
```json
[
  {
    "id": 1,
    "philosopher_id": 1,
    "philosopher_name": "Marcus Aurelius",
    "text": "You have power over your mind - not outside events. Realize this, and you will find strength.",
    "source": "Meditations, Book 8",
    "context": "Written during the Marcomannic Wars while dealing with plague and military challenges",
    "modern_interpretation": "This encapsulates the dichotomy of control. In modern terms: focus on your response, not the situation."
  }
  // ... 74 more quotes
]
```

### Get Random Quote

Returns a different random quote each time.

```bash
curl http://localhost:3000/quotes/random
```

**Use Case:** Daily inspiration apps, random quote widgets

### Get Daily Quote

Returns the same quote for the entire day (changes at midnight UTC).

```bash
curl http://localhost:3000/quotes/daily
```

**Use Case:** Daily meditation apps, email newsletters

### Filter Quotes by Theme

Find quotes related to specific Stoic principles.

```bash
# Dichotomy of Control quotes
curl "http://localhost:3000/quotes?theme=Dichotomy"

# Memento Mori quotes
curl "http://localhost:3000/quotes?theme=Memento%20Mori"

# Amor Fati quotes
curl "http://localhost:3000/quotes?theme=Amor%20Fati"
```

### Filter Quotes by Philosopher

```bash
# Marcus Aurelius quotes
curl "http://localhost:3000/quotes?philosopher=Marcus"

# Seneca quotes
curl "http://localhost:3000/quotes?philosopher=Seneca"

# Epictetus quotes
curl "http://localhost:3000/quotes?philosopher=Epictetus"
```

### Search Quotes

Search in quote text and modern interpretations.

```bash
# Search for quotes about control
curl "http://localhost:3000/quotes?search=control"

# Search for quotes about time
curl "http://localhost:3000/quotes?search=time"

# Search for quotes about death
curl "http://localhost:3000/quotes?search=death"
```

### Combine Filters

```bash
# Marcus Aurelius quotes about control
curl "http://localhost:3000/quotes?philosopher=Marcus&search=control"

# Quotes about virtue from any philosopher
curl "http://localhost:3000/quotes?theme=Virtue&search=virtue"
```

## Themes Endpoints

### List All Themes

Get all 7 core Stoic themes with scientific connections.

```bash
curl http://localhost:3000/themes
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Dichotomy of Control",
    "description": "The fundamental distinction between what is within our control...",
    "principle": "Focus on what you can control, accept what you cannot.",
    "scientific_connection": "Research in stress psychology shows that perceived control is a key factor in resilience...",
    "cbt_connection": "CBT's core principle of separating thoughts from events mirrors this Stoic teaching...",
    "neuroscience_connection": "Neuroscience research shows that the prefrontal cortex activates...",
    "psychology_connection": "Aligns with locus of control research by Rotter..."
  }
  // ... 6 more themes
]
```

### Get Specific Theme

```bash
curl http://localhost:3000/themes/1
```

### Available Themes

1. **Dichotomy of Control** - Focus on what you can control
2. **Negative Visualization** - Prepare for adversity mentally
3. **Virtue as the Sole Good** - Character over circumstances
4. **Amor Fati** - Love your fate
5. **Memento Mori** - Remember mortality
6. **Cosmopolitanism** - We are all citizens of the world
7. **Present Moment Focus** - Live in the now

Each theme includes:
- Full description
- Core principle
- Scientific research connections
- CBT (Cognitive Behavioral Therapy) connections
- Neuroscience connections
- Psychology research connections

## Timeline Endpoint

### Get Historical Timeline

Retrieve 23 key events in Stoic philosophy from 300 BCE to 2015 CE.

```bash
curl http://localhost:3000/timeline
```

**Response:**
```json
[
  {
    "id": 1,
    "year": -300,
    "title": "Birth of Stoicism",
    "description": "Zeno of Citium founds the Stoic school in Athens...",
    "significance": "Marks the beginning of Stoicism as a formal philosophical school..."
  },
  {
    "id": 2,
    "year": -280,
    "title": "Early Development",
    "description": "Cleanthes succeeds Zeno as head of the Stoic school...",
    "significance": "Cleanthes' Hymn to Zeus becomes a classic expression..."
  }
  // ... 21 more events
]
```

**Timeline Coverage:**
- Ancient Period: -300 BCE to 180 CE (classical Stoicism)
- Medieval Period: 250-529 CE (integration with Christianity)
- Renaissance: 1584 CE (Neo-Stoicism)
- Modern Period: 1958-2015 CE (modern applications)

## Incidents Endpoints

### List All Incidents

Get all 15 historical incidents with lessons and modern relevance.

```bash
curl http://localhost:3000/incidents
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Zeno's Shipwreck",
    "philosopher_id": null,
    "philosopher_name": null,
    "year": -300,
    "description": "Zeno of Citium was a wealthy merchant until a shipwreck destroyed his cargo...",
    "lesson": "Apparent disasters can redirect us to our true calling...",
    "modern_relevance": "Career setbacks, financial losses, or life disruptions often redirect people..."
  }
  // ... 14 more incidents
]
```

### Get Specific Incident

```bash
curl http://localhost:3000/incidents/1
```

### Notable Incidents Include:

- **Zeno's Shipwreck** - From merchant to philosopher
- **Epictetus' Broken Leg** - Grace under torture
- **Cato's Final Stand** - Principle over survival
- **Seneca's Exile** - Productivity in isolation
- **Marcus' Meditations at War** - Philosophy in action
- **The Antonine Plague** - Leadership during crisis

## Health Check

### Check API Status

```bash
curl http://localhost:3000/health
```

**Response:**
```
OK
```

Use this endpoint for:
- Load balancer health checks
- Monitoring systems
- Deployment verification

## Response Formats

All responses are in JSON format with appropriate HTTP status codes.

### Success Response (200 OK)

```json
{
  "id": 1,
  "name": "Marcus Aurelius",
  ...
}
```

### Not Found (404)

```json
{
  "error": "Philosopher not found"
}
```

### Server Error (500)

```json
{
  "error": "Internal server error message"
}
```

## Error Handling

The API uses standard HTTP status codes:

- **200 OK** - Request succeeded
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

## Integration Examples

### JavaScript/TypeScript

```typescript
// Fetch daily quote
const response = await fetch('http://localhost:3000/quotes/daily');
const quote = await response.json();

console.log(`"${quote.text}" - ${quote.philosopher_name}`);
```

### Python

```python
import requests

# Get all themes
response = requests.get('http://localhost:3000/themes')
themes = response.json()

for theme in themes:
    print(f"{theme['name']}: {theme['principle']}")
```

### Curl with jq

```bash
# Get just the text of daily quote
curl -s http://localhost:3000/quotes/daily | jq -r '.text'

# Count quotes by each philosopher
curl -s http://localhost:3000/quotes | jq 'group_by(.philosopher_name) | map({philosopher: .[0].philosopher_name, count: length})'

# Get all theme names
curl -s http://localhost:3000/themes | jq -r '.[].name'
```

## Use Cases

### Daily Meditation App
```bash
# Get daily quote - same all day
curl http://localhost:3000/quotes/daily

# Get specific theme for focus
curl http://localhost:3000/themes/1
```

### Philosophy Education Platform
```bash
# Get philosopher with all quotes
curl http://localhost:3000/philosophers/1/quotes

# Get historical context
curl http://localhost:3000/timeline
```

### Mental Health Application
```bash
# Get CBT-related themes
curl http://localhost:3000/themes

# Search quotes about specific topics
curl "http://localhost:3000/quotes?search=anxiety"
```

### Quote of the Day Service
```bash
# Daily quote API
curl http://localhost:3000/quotes/daily

# Random for variety
curl http://localhost:3000/quotes/random
```

## Performance

All endpoints respond in < 50ms for typical queries:

- Single philosopher: ~5-10ms
- All quotes: ~20-30ms
- Filtered queries: ~15-25ms
- Timeline: ~10-15ms
- Themes: ~10-15ms

## Rate Limiting

Currently no rate limiting is implemented. For production deployments, consider:
- Adding rate limiting at the API level
- Using Azure Front Door for CDN and rate limiting
- Implementing caching for frequently accessed endpoints

## CORS

CORS is enabled for all origins in the current configuration. Adjust in production as needed.

## Next Steps

1. **Try the API**: Use the examples above with your local or deployed instance
2. **Build an Application**: Integrate quotes into your app
3. **Explore Themes**: Dive deep into Stoic philosophy with scientific connections
4. **Learn History**: Follow the timeline and incident stories

## Support

For issues or questions:
- Check the main README.md
- Review the Azure Deployment Guide
- Open an issue on GitHub
