# Bubble.io — API Connector Setup Guide

Use the `api-connector-config.json` alongside these steps to wire up Claude in your Bubble app.

---

## 1. Install the API Connector Plugin

1. Go to **Plugins** → **Add Plugins**
2. Search for **API Connector** → Install it

---

## 2. Create the API

In the API Connector plugin panel:

| Field | Value |
|---|---|
| API Name | `ClaudeAPI` |
| Authentication | `Private key in header` |
| Key name | `x-api-key` |
| Key value | `YOUR_ANTHROPIC_API_KEY` |

---

## 3. Add the API Call

Click **Add another API call** and fill in:

| Field | Value |
|---|---|
| Name | `Generate 3 Replies` |
| Method | `POST` |
| URL | `https://api.anthropic.com/v1/messages` |
| Use as | `Action` |

### Headers

| Key | Value |
|---|---|
| `Content-Type` | `application/json` |
| `anthropic-version` | `2023-06-01` |

### Body (JSON)

```json
{
  "model": "claude-opus-4-5",
  "max_tokens": 1000,
  "system": "You are a charming, witty flirt coach. Given a message someone received, generate exactly 3 flirty, playful reply options. Respond ONLY with a JSON array of exactly 3 strings. No markdown, no keys. Example: [\"reply one\", \"reply two\", \"reply three\"]",
  "messages": [
    {
      "role": "user",
      "content": "<prompt>"
    }
  ]
}
```

> **Important:** `<prompt>` is a Bubble dynamic parameter. Bubble detects it automatically and creates an input field for it.

---

## 4. Initialize / Test the Call

1. Set a test value for `prompt` e.g. `"You free this weekend?"`
2. Click **Initialize call**
3. Bubble will detect the response shape — confirm the returned fields

The key field returned is:
```
content[0].text  →  "[\"reply 1\", \"reply 2\", \"reply 3\"]"
```

---

## 5. Page & UI Setup

Create a page with:

| Element | Type | Name |
|---|---|---|
| Text input / Multiline | Input | `InputPrompt` |
| Button | Button | `BtnGenerate` |
| Text | Text | `TextReply1` |
| Text | Text | `TextReply2` |
| Text | Text | `TextReply3` |

---

## 6. Workflow — Button Click

On `BtnGenerate` click, add these steps:

### Step 1 — Call the API
- Action: **Plugins → ClaudeAPI - Generate 3 Replies**
- `prompt` → `InputPrompt's value`

### Step 2 — Set State (store raw response)
- Add a **Custom State** to the page called `raw_replies` (type: text)
- Action: **Set state**
- Value: `Result of Step 1's content[0].text`

### Step 3 — Display Reply 1
- Action: **Set text of TextReply1**
- Value: `raw_replies:parsed as JSON:item 1` *(Bubble's JSON parser, index 1 = first item)*

### Step 4 — Display Reply 2
- Value: `raw_replies:parsed as JSON:item 2`

### Step 5 — Display Reply 3
- Value: `raw_replies:parsed as JSON:item 3`

---

## 7. Optional Enhancements

| Feature | How |
|---|---|
| Loading spinner | Show a loading group while Step 1 is running using "This workflow is running" condition |
| Copy button | Use the **Clipboard** plugin — copy `TextReplyN's text` on click |
| Usage limits | Store a `reply_count` field on the User, increment each run, gate behind a condition |
| Paywall | Check `User's reply_count > 5` → redirect to upgrade page before Step 1 |

---

## Notes

- **Never expose your API key** in client-side Bubble elements or URL params — the API Connector stores it server-side safely.
- The `anthropic-version` header is required by Anthropic and must be `2023-06-01`.
- Model used: `claude-opus-4-5` — you can swap to `claude-haiku-4-5-20251001` for faster/cheaper responses.
