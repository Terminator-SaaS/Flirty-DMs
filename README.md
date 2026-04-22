# Claude API Backend

A minimal Node.js/Express server that proxies requests to the Anthropic Claude API and returns 3 responses.

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Add your API key
cp .env.example .env
# Edit .env and set ANTHROPIC_API_KEY

# 3. Run
npm run dev     # development (auto-restarts on file change)
npm start       # production
```

## Endpoints

### `GET /health`
Returns server status.

```json
{ "status": "ok", "timestamp": "2026-04-22T10:00:00.000Z" }
```

---

### `POST /api/generate`
Sends a prompt to Claude and returns N distinct responses.

**Request body:**
```json
{
  "prompt": "Give me ideas for a weekend project",
  "count": 3
}
```
- `prompt` — required, non-empty string
- `count` — optional, integer 1–5 (default: 3)

**Response:**
```json
{
  "responses": [
    "Build a personal finance tracker...",
    "Create a small CLI tool that...",
    "Start a photo-a-day journal..."
  ]
}
```

**Error response:**
```json
{ "error": "prompt is required and must be a non-empty string." }
```

---

## Connecting the Frontend

In your React app, replace the direct Anthropic API call with:

```js
const res = await fetch("http://localhost:3000/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt: input }),
});
const { responses } = await res.json();
```

This keeps your API key secure on the server instead of exposed in the browser.
