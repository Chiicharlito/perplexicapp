# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PerplexicApp is a cross-platform mobile client for [Perplexica](https://github.com/ItzCrazyKns/Perplexica) (open-source Perplexity AI alternative), built with Expo SDK 54, React 19.1, and React Native 0.81.5.

**Upstream dependency**: This app consumes the Perplexica API. Before implementing new features, check the [Perplexica source](https://github.com/ItzCrazyKns/Perplexica) for latest API changes to maintain feature parity. The app must stay ISO with the upstream project's API surface.

## Commands

```bash
npm run start        # Start Expo dev server
npm run ios          # Start on iOS simulator
npm run android      # Start on Android emulator
npm run web          # Start web version (Metro bundler, static output)
npm run test         # Jest in watch mode (jest --watchAll)
npm run test:ci      # CI mode with coverage and thresholds
npm run typecheck    # TypeScript type checking (tsc --noEmit)
npm run validate     # Full pipeline: typecheck + lint + test:ci
npm run lint         # ESLint via expo lint (flat config)
npm run format       # Prettier (all files)
```

To run a single test file: `npx jest path/to/test --no-coverage`

**Pre-commit hook**: Husky runs `lint-staged` on commit — Prettier + ESLint (`--max-warnings 0`) on `*.{ts,tsx}` files.

## Architecture

### Routing (Expo Router 6 / file-based)

Routes live in `app/` using expo-router with typed routes enabled (`experiments.typedRoutes: true`):

- `app/(tabs)/` — Tab navigator: Home (`index.tsx`), Discover (`explore.tsx`), Library (`chats/index.tsx`)
- `app/result.tsx` — Search results page with WebSocket streaming
- `app/browser.tsx` — In-app browser for source links
- `app/settings.tsx` — Server configuration
- `app/modals/` — Modal screens: `server`, `wsserver`, `focusMode`, `optimizationMode`
- `app/_layout.tsx` — Root layout wraps everything in `ThemeProvider` > `SearchProvider` > `Stack`

### State Management

Simple Context API — no Redux/MobX. `SearchProvider` (`providers/searchProvider.tsx`) holds:

- `query`, `focusMode` (webSearch/academicSearch/youtube/reddit/wolfram/writing), `optimizationMode` (speed/balanced), `history`

Persistent storage uses AsyncStorage via `services/storage.ts` and `hooks/useStorage.ts` for `serverURL` and `wsServerURL`.

### API Layer (`services/api.ts`)

Generic `fetchApi<T>()` wrapper that reads `serverURL` from AsyncStorage and calls `${serverURL}/api${endpoint}`. Endpoints:

- `POST /search` — Search with chat model config (hardcoded ollama/llama3.1:latest), focus mode, history
- `POST /suggestions` — Related query suggestions
- `GET /chats`, `GET /chats/:id` — Chat history
- `GET /discover`, `GET /images` — News and images for Discover tab

**Note**: API requests append French language instructions to queries. This is hardcoded in `searchApi()` and `getSuggestions()`.

### WebSocket Streaming Protocol

Search results stream via WebSocket in `app/result.tsx` using `wsServerURL`. Connection URL includes query params: `?chatModelProvider=ollama&chatModel=llama3.1:latest`.

**Outbound message** (sent on `onopen`):

```json
{ "type": "message", "focusMode": "...", "optimizationMode": "...", "history": [...], "message": { "content": "...", "chatId": "...", "messageId": "..." } }
```

**Inbound message types**: `message` (streamed text chunks), `sources` (array of sources), `messageEnd` (stream complete), `error` (error string).

### Theme System

Light/dark mode via `useColorScheme()` hook + `constants/Colors.ts`. Use `ThemedText` and `ThemedView` components for automatic theme support. Primary accent: `#008080` (teal).

### Key Directories

- `components/` — Reusable UI: `Header`, `BottomInput`, `Suggestions`, `SourceItem`, `Skeleton`, themed wrappers
- `hooks/` — `useColorScheme`, `useThemeColor`, `useStorage`, `usePreferences`
- `services/` — API client, AsyncStorage helpers, icon mappings
- `types/` — TypeScript interfaces for API, chat, message, history, explore, preferences
- `constants/` — Colors, SearchTypes (6 focus modes), OptimizationsModes

## Conventions

- **TypeScript strict mode** enabled. Path alias `@/*` maps to project root.
- **Imports**: Use `@/` path alias (e.g., `import { Chat } from "@/types/chat"`).
- **Components**: Functional components only. Use React 19 patterns (ref-as-prop supported).
- **Testing**: jest-expo preset with @testing-library/react-native. Tests go in `<module>/__tests__/`.
- **Icons**: Use `lucide-react-native` as the primary icon library.
- **No `any`**: ESLint enforces `@typescript-eslint/no-explicit-any` as error.

## TDD Workflow

All development follows strict TDD. See `TESTING.md` for full details.

- **New features**: Write failing test first, then implement
- **Bug fixes**: Write regression test first, then fix
- **Test utilities**: Import from `@/testing` (custom render, factories, mocks)
- **Custom render**: `render()` from `@/testing` wraps components in `SearchContext.Provider`. Pass `{ searchContext: { query: "test" } }` as second arg to override context values.
- **Validation**: Run `npm run validate` before considering work complete

# currentDate

Today's date is 2026-02-18.
