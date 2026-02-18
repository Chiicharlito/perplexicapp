# Perplexica API Reference

> Upstream source: https://github.com/ItzCrazyKns/Perplexica
> Last synced: 2026-02-18

## Endpoints Overview

| Endpoint              | Method    | Status in App | Notes                                          |
| --------------------- | --------- | ------------- | ---------------------------------------------- |
| `/api/providers`      | GET, POST | **Missing**   | Dynamic model/provider discovery               |
| `/api/config`         | GET, POST | **Missing**   | Server config + UI sections                    |
| `/api/search`         | POST      | **Outdated**  | API-style search (stream optional)             |
| `/api/chat`           | POST      | **Missing**   | Main streaming chat (SSE, block-based)         |
| `/api/suggestions`    | POST      | **Outdated**  | Now requires `chatModel` param                 |
| `/api/chats`          | GET       | OK            | List all chats (reversed)                      |
| `/api/chats/:id`      | GET       | OK            | Single chat by ID                              |
| `/api/discover`       | GET       | **Outdated**  | Now supports `topic` + `mode` params           |
| `/api/images`         | POST      | **Outdated**  | Changed from GET to POST, requires `chatModel` |
| `/api/videos`         | POST      | **Missing**   | Video search                                   |
| `/api/uploads`        | ?         | **Missing**   | File uploads                                   |
| `/api/weather`        | ?         | **Missing**   | Weather data                                   |
| `/api/reconnect/[id]` | ?         | **Missing**   | Session reconnection                           |

---

## Breaking Changes (Current App vs Upstream)

### 1. WebSocket Removed — Streaming is now SSE over HTTP

The app currently uses WebSocket (`ws://` URL with query params). Upstream has replaced this entirely with:

- `POST /api/chat` — Main interactive endpoint, always streams via SSE
- `POST /api/search` — API-style, optionally streams with `stream: true`

**Impact**: `wsServerURL` setting and all WebSocket code in `app/result.tsx` must be replaced with HTTP SSE.

### 2. Model Selection is Dynamic

Old (hardcoded in app):

```json
{ "provider": "ollama", "model": "llama3.1:latest" }
```

New (dynamic via `/api/providers`):

```json
{ "providerId": "550e8400-...", "key": "gpt-4o-mini" }
```

**Impact**: Must add provider/model selection UI. No more hardcoding.

### 3. `focusMode` Replaced by `sources` Array

Old focus modes: `webSearch`, `academicSearch`, `writingAssistant`, `wolframAlphaSearch`, `youtubeSearch`, `redditSearch`

New sources array: `["web", "academic", "discussions"]` (and potentially more)

**Impact**: `SearchTypes` constants, `focusMode` modal, and all focus mode references need updating.

### 4. `optimizationMode` Gains `quality` Option

Old: `"speed" | "balanced"`
New: `"speed" | "balanced" | "quality"`

### 5. Suggestions/Images/Videos Now Require `chatModel`

These endpoints no longer infer the model server-side. The client must pass:

```json
{ "chatModel": { "providerId": "...", "key": "..." } }
```

---

## Endpoint Details

### GET /api/providers

Fetches available AI providers and their models. Use this to populate model selection UI.

**Response:**

```json
{
  "providers": [
    {
      "id": "uuid",
      "name": "Provider Name",
      "chatModels": [{ "name": "Display Name", "key": "model-key" }],
      "embeddingModels": [{ "name": "Display Name", "key": "embedding-key" }]
    }
  ]
}
```

Providers with error models (key === `"error"`) are filtered out server-side.

### POST /api/providers

Add a new provider.

**Request:**

```json
{ "type": "...", "name": "...", "config": { ... } }
```

### GET /api/config

Returns server config values and UI section definitions, enriched with active model data.

**Response:**

```json
{
  "values": { "modelProviders": [...], ... },
  "fields": [...]
}
```

### POST /api/config

Update a config key.

**Request:**

```json
{ "key": "configKey", "value": "configValue" }
```

---

### POST /api/search

API-style search. Supports optional streaming.

**Request:**

```json
{
  "chatModel": { "providerId": "uuid", "key": "model-key" },
  "embeddingModel": { "providerId": "uuid", "key": "embedding-key" },
  "sources": ["web"],
  "optimizationMode": "speed" | "balanced" | "quality",
  "query": "search query",
  "history": [["human", "msg"], ["assistant", "msg"]],
  "stream": false,
  "systemInstructions": "optional instructions"
}
```

**Non-streaming response:**

```json
{
  "message": "Generated answer...",
  "sources": [{ "content": "...", "metadata": { "title": "...", "url": "..." } }]
}
```

**Streaming response** (`stream: true`): Newline-delimited JSON via SSE:

```
{"type":"init","data":"Stream connected"}
{"type":"sources","data":[...]}
{"type":"response","data":"chunk"}
{"type":"done"}
```

---

### POST /api/chat

Main interactive chat endpoint. Always streams via SSE. Uses Zod validation.

**Request:**

```json
{
  "message": { "messageId": "uuid", "chatId": "uuid", "content": "query" },
  "chatModel": { "providerId": "uuid", "key": "model-key" },
  "embeddingModel": { "providerId": "uuid", "key": "embedding-key" },
  "sources": ["web"],
  "optimizationMode": "speed" | "balanced" | "quality",
  "history": [["human", "msg"], ["assistant", "msg"]],
  "files": ["fileId1"],
  "systemInstructions": "optional"
}
```

**SSE stream events** (newline-delimited JSON):

```
{"type":"block","block":{...}}
{"type":"updateBlock","blockId":"...","patch":{...}}
{"type":"researchComplete"}
{"type":"messageEnd"}
{"type":"error","data":"..."}
```

Note: `/api/chat` uses a block-based response model (not plain text chunks). This is different from `/api/search` streaming.

---

### POST /api/suggestions

**Request:**

```json
{
  "chatHistory": [
    ["human", "msg"],
    ["assistant", "msg"]
  ],
  "chatModel": { "providerId": "uuid", "key": "model-key" }
}
```

**Response:**

```json
{ "suggestions": ["suggestion1", "suggestion2"] }
```

Note: Field is `chatHistory` (not `chat_history` as currently used in app).

---

### GET /api/chats

Returns all chats in reverse chronological order.

**Response:**

```json
{ "chats": [...] }
```

### GET /api/chats/:id

Returns a single chat by ID. _(No changes observed.)_

---

### GET /api/discover

Now supports query parameters.

| Param   | Type   | Default    | Values                                              |
| ------- | ------ | ---------- | --------------------------------------------------- |
| `topic` | string | `"tech"`   | `tech`, `finance`, `art`, `sports`, `entertainment` |
| `mode`  | string | `"normal"` | `"normal"`, `"preview"`                             |

**Response:**

```json
{ "blogs": [...] }
```

---

### POST /api/images

Changed from GET to POST.

**Request:**

```json
{
  "query": "search query",
  "chatHistory": [
    ["human", "msg"],
    ["assistant", "msg"]
  ],
  "chatModel": { "providerId": "uuid", "key": "model-key" }
}
```

**Response:**

```json
{ "images": [...] }
```

---

### POST /api/videos

New endpoint.

**Request:**

```json
{
  "query": "search query",
  "chatHistory": [
    ["human", "msg"],
    ["assistant", "msg"]
  ],
  "chatModel": { "providerId": "uuid", "key": "model-key" }
}
```

**Response:**

```json
{ "videos": [...] }
```

---

## Common Types

### ModelWithProvider

```typescript
interface ModelWithProvider {
  providerId: string; // UUID from /api/providers
  key: string; // model key from provider's chatModels/embeddingModels
}
```

### SearchSources

```typescript
type SearchSources = "web" | "academic" | "discussions"; // potentially more
```

### History Format

```typescript
type History = Array<[string, string]>; // [["human", "content"], ["assistant", "content"]]
```

---

## Migration Checklist

- [ ] Add `GET /api/providers` call and model selection UI
- [ ] Replace WebSocket streaming with SSE (`POST /api/chat` or `POST /api/search` with `stream: true`)
- [ ] Remove `wsServerURL` setting (only `serverURL` needed now)
- [ ] Update `ChatModel` type: `provider`/`model` → `providerId`/`key`
- [ ] Update `EmbeddingModel` type similarly
- [ ] Replace `focusMode` with `sources` array
- [ ] Add `"quality"` optimization mode option
- [ ] Update `searchApi()` request body format
- [ ] Update `getSuggestions()` to pass `chatModel` and use `chatHistory` field name
- [ ] Update `getImages()` from GET to POST with `chatModel` + `chatHistory`
- [ ] Add `getVideos()` API call
- [ ] Update `getNews()` to pass `topic` and `mode` query params
- [ ] Add `systemInstructions` support
- [ ] Add file upload support (`files` param in chat)
- [ ] Handle block-based SSE events from `/api/chat`
- [ ] Remove hardcoded French language instructions (use `systemInstructions` instead)
