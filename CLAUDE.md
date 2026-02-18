# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PerplexicApp is a cross-platform mobile client for [Perplexica](https://github.com/ItzCrazyKns/Perplexica) (open-source Perplexity AI alternative), built with Expo SDK 54, React 19.1, and React Native 0.81.5.

## Commands

```bash
npm run start        # Start Expo dev server
npm run ios          # Start on iOS simulator
npm run android      # Start on Android emulator
npm run web          # Start web version (Metro bundler, static output)
npm run test         # Jest in watch mode (jest --watchAll)
npm run lint         # ESLint via expo lint (flat config)
npm run format       # Prettier (all files)
```

To run a single test file: `npx jest path/to/test --no-coverage`

## Architecture

### Routing (Expo Router 6 / file-based)

Routes live in `app/` using expo-router with typed routes enabled (`experiments.typedRoutes: true`):

- `app/(tabs)/` — Tab navigator: Home (`index.tsx`), Discover (`explore.tsx`), Library (`chats/index.tsx`)
- `app/result.tsx` — Search results page with WebSocket streaming
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

Search results stream via WebSocket in `app/result.tsx` using `wsServerURL`.

**Note**: API requests append French language instructions to queries. This is hardcoded in `searchApi()` and `getSuggestions()`.

### Theme System

Light/dark mode via `useColorScheme()` hook + `constants/Colors.ts`. Use `ThemedText` and `ThemedView` components for automatic theme support.

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
- **Testing**: jest-expo preset with @testing-library/react-native. Tests go in `components/__tests__/`.
- **Icons**: Use `lucide-react-native` as the primary icon library.

## TDD Workflow

All development follows strict TDD. See `TESTING.md` for full details.

- **New features**: Write failing test first, then implement
- **Bug fixes**: Write regression test first, then fix
- **Test utilities**: Import from `@/testing` (custom render, factories, mocks)
- **Validation**: Run `npm run validate` before considering work complete
- **No `any`**: ESLint enforces `@typescript-eslint/no-explicit-any` as error
