# Testing Standards

## TDD Workflow

All development follows strict Test-Driven Development (Red-Green-Refactor):

1. **Red**: Write a failing test that describes the desired behavior
2. **Green**: Write the minimum code to make the test pass
3. **Refactor**: Clean up while keeping tests green

### Bug Fixes

Always write a regression test BEFORE fixing the bug:

1. Write a test that reproduces the bug (should fail)
2. Fix the bug (test should pass)
3. Refactor if needed

## Test Organization

```
components/__tests__/   # Component tests
hooks/__tests__/        # Hook tests
services/__tests__/     # Service/API tests
providers/__tests__/    # Context provider tests
```

## Conventions

### Imports

Always import test utilities from `@/testing`:

```typescript
import { render, screen, fireEvent, waitFor } from "@/testing";
import { buildMessage, buildChat } from "@/testing";
```

### Structure

Use Arrange-Act-Assert pattern:

```typescript
describe("ComponentName", () => {
  it("describes expected behavior", () => {
    // Arrange
    const props = { title: "Test" };

    // Act
    render(<Component {...props} />);

    // Assert
    expect(screen.getByText("Test")).toBeOnTheScreen();
  });
});
```

### Rules

- **No snapshots**: Test behavior, not implementation details
- **No `any`**: ESLint enforces `@typescript-eslint/no-explicit-any` as error
- **Use factories**: Always use `build*()` functions from `@/testing` for test data
- **Descriptive names**: Test names should read as sentences describing behavior
- **One concept per test**: Each `it()` block tests a single behavior
- **Isolated tests**: Tests must not depend on execution order

### Factories

Type-safe builders available in `@/testing`:

| Factory                 | Type             |
| ----------------------- | ---------------- |
| `buildSource()`         | `Source`         |
| `buildSearchResponse()` | `SearchResponse` |
| `buildHistory()`        | `History`        |
| `buildMessage()`        | `Message`        |
| `buildChat()`           | `Chat`           |
| `buildNewsItem()`       | `NewsItem`       |
| `buildSuggestion()`     | `Suggestion`     |
| `buildTheme()`          | `Theme`          |

All accept `Partial<T>` overrides:

```typescript
const message = buildMessage({ role: "user", content: "Hello" });
```

### WebSocket Mocking

```typescript
import { createMockWebSocket } from "@/testing";

const { MockWebSocket, getInstance, simulateOpen, simulateMessage } = createMockWebSocket();
```

## Coverage

- **Thresholds**: 5% global (starting point with 1 test)
- **Goal**: Increase thresholds progressively toward 80% as test suite grows
- Coverage is enforced in CI via `npm run test:ci`

## Commands

| Command                 | Purpose                                   |
| ----------------------- | ----------------------------------------- |
| `npm run test`          | Jest in watch mode (development)          |
| `npm run test:ci`       | CI mode with coverage and thresholds      |
| `npm run test:coverage` | Generate coverage report locally          |
| `npm run typecheck`     | TypeScript type checking                  |
| `npm run validate`      | Full pipeline: typecheck + lint + test:ci |

Run a single test file:

```bash
npx jest path/to/test --no-coverage
```
