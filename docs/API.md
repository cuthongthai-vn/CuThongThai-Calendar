# API Documentation

> REST API endpoints for CuThongThai_Calendar

Base URL: `http://localhost:3000/api` (development)

---

## Authentication

Protected endpoints require API key authentication:

```bash
Authorization: Bearer YOUR_ADMIN_API_KEY
```

Set `ADMIN_API_KEY` in `.env` file.

---

## Endpoints

### Events

#### GET /api/events

Fetch all economic events.

**Access:** Public

**Response:**
```json
[
  {
    "id": "uuid",
    "event_name": "US Non-Farm Payrolls",
    "event_time": "2026-01-10T13:30:00Z",
    "country": "US",
    "actual": 200000,
    "forecast": 180000,
    "previous": 175000,
    "impact_level": "High",
    "ai_commentary": "Strong job growth...",
    "ai_sentiment": "bullish",
    "translated_name": "Việc làm phi nông nghiệp Mỹ"
  }
]
```

#### POST /api/events

Create a new economic event.

**Access:** Protected (requires API key)

**Request Body:**
```json
{
  "event_name": "VN CPI",
  "event_time": "2026-01-15T07:00:00Z",
  "country": "VN",
  "forecast": 3.5,
  "impact_level": "Medium"
}
```

**Response:** Created event object (201)

#### PUT /api/events/[id]

Update an existing event.

**Access:** Protected

**Request Body:** Partial event object

**Response:** Updated event object

#### DELETE /api/events/[id]

Delete an event.

**Access:** Protected

**Response:**
```json
{ "message": "Event deleted" }
```

---

### AI Analysis

#### POST /api/analyze

Trigger AI analysis for an event.

**Access:** Protected

**Request Body:**
```json
{
  "event_id": "uuid-here"
}
```

**Response:** Updated event with AI commentary

**Process:**
1. Fetches event data
2. Analyzes actual vs forecast
3. Generates AI commentary using Gemini
4. Updates event with analysis

---

### Macro Indicators

#### POST /api/macro/manual-entry

Manually enter macro indicator data.

**Access:** Protected

**Request Body (Array format):**
```json
{
  "date": "2026-01-09",
  "items": [
    {
      "key": "USDVND_BLACK_MARKET",
      "value": 25500
    },
    {
      "key": "GOLD_SJC",
      "value": 78500000
    }
  ]
}
```

**Request Body (Flat format):**
```json
{
  "indicator_key": "VNINDEX",
  "date": "2026-01-09",
  "value": 1250.5
}
```

**Response:**
```json
{
  "success": true,
  "inserted": 2
}
```

---

### OG Images

#### GET /api/og?chart=[chartId]

Generate Open Graph images for social sharing.

**Access:** Public

**Query Parameters:**
- `chart`: Chart identifier
  - `vnindex` - VNINDEX chart
  - `exchange-rate` - USD/VND
  - `rates` - Interest rates
  - `gdp-abs` - GDP absolute
  - `gold` - Gold prices
  - `re-vnd` - Real estate

**Response:** 1200x630 PNG image

**Example:**
```html
<meta property="og:image" content="/api/og?chart=vnindex" />
```

---

### Cron Jobs

#### POST /api/cron

Trigger scheduled data fetching jobs.

**Access:** Protected (requires `CRON_SECRET`)

**Request Headers:**
```
Authorization: Bearer YOUR_CRON_SECRET
```

**Response:**
```json
{
  "success": true,
  "timestamp": "2026-01-09T12:00:00Z"
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message",
  "details": "Additional error details (dev only)"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

---

## Rate Limiting

No rate limiting currently implemented. Consider adding for production.

---

## Examples

### cURL Examples

**Fetch events:**
```bash
curl http://localhost:3000/api/events
```

**Create event (protected):**
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "event_name": "Test Event",
    "event_time": "2026-01-10T12:00:00Z",
    "country": "VN"
  }'
```

**Trigger AI analysis:**
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"event_id": "your-event-uuid"}'
```

### JavaScript Fetch

```javascript
// Fetch events
const events = await fetch('/api/events').then(r => r.json());

// Create event (protected)
const created = await fetch('/api/events', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.ADMIN_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    event_name: 'New Event',
    event_time: '2026-01-10T12:00:00Z',
    country: 'VN'
  })
}).then(r => r.json());
```

---

## Database Schema

### economic_events

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| event_name | text | Event name (English) |
| event_time | timestamp | Event datetime |
| country | text | Country code |
| actual | numeric | Actual value |
| forecast | numeric | Forecast value |
| previous | numeric | Previous value |
| impact_level | text | High/Medium/Low |
| ai_commentary | text | AI analysis |
| ai_sentiment | text | bullish/bearish/neutral |
| translated_name | text | Vietnamese name |

### macro_indicators

| Column | Type | Description |
|--------|------|-------------|
| indicator_key | text | Indicator ID (PK with date) |
| date | date | Date (PK with indicator_key) |
| value | numeric | Numeric value |
| text_content | text | Optional text |
| source | text | Data source |

---

## Webhooks

Currently not implemented. Consider adding for:
- Event updates notifications
- Data sync with external systems
- Real-time updates via WebSockets

---

For more information, see [README.md](../README.md)
