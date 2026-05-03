# Blackjack-Is-Fun Constitution

This document defines the architectural patterns and best practices for the Blackjack-Is-Fun repository. Adhering to these standards ensures consistency, reliability, and maintainability across the codebase.

## 1. Component Structure

Each component should reside in its own directory under `src/components/`, containing:

-   `component-name.tsx`: The React component using TypeScript.
-   `component-name.module.css`: Scoped CSS modules.
-   `component-name.test.tsx`: Unit tests for the component.

### 1.1 State Management

-   Prefer functional components with React Hooks (`useState`, `useEffect`).
-   Lift state to the nearest common ancestor (e.g., `App.tsx`) when components need to share data.
-   Complex logic should be extracted into custom hooks (see `src/hooks`) or service functions.

## 2. Testing Best Practices

We use **Jest** and **React Testing Library** for automated testing.

### 2.1 Unit Test Location

-   Component tests: `src/components/{folder}/{name}.test.tsx`
-   Service/Logic tests: `src/services/{name}.test.ts`

### 2.2 Testing Patterns

-   **Test User Behavior:** Prefer testing what the user sees and interacts with (e.g., `screen.getByText('STAND')`) rather than internal component state.
-   **Mocking Services:** Use `jest.spyOn(service, 'method')` to mock deck operations (dealing, drawing) to create deterministic test scenarios.
-   **Async Handling:** Use `async/await` and `find*` queries when testing components that rely on state updates or effects.

## 3. Styling

-   Use **CSS Modules** to prevent style leakage.
-   Import styles as `import * as styles from './name.module.css'`.
-   Definitions for CSS modules are automatically generated (`*.module.css.d.ts`).

## 4. TypeScript

-   Define interfaces for all component Props and State.
-   Prefer interfaces over types for public-facing contracts.
-   Interfaces should be stored in `src/interfaces/` if shared, or within the component file if local.

## 5. Branching & Commits

-   **Branch Naming:** `{type}/{issue-number}-{summary}` (e.g., `feature/27-unit-tests`).
-   **Commit Messages:** `{issue-number}: {Imperative summary}` (e.g., `27: Add unit tests for dealer`).
