---
trigger: always_on
---

# Nina Labs Web Apps Documentation

This document serves as a guide for AI agents working on the **Nina Labs Web Apps** monorepo. It outlines the project structure, tooling choices, and architectural conventions that **MUST** be followed to ensure consistency and correctness.

## 1. Project Structure

This is a **Bun-managed monorepo** organized into:

- **`apps/`**: Contains Next.js applications (`nina-fit`, `nina-quick`, `nina-journal`).
- **`packages/`**: Contains shared libraries/packages (`ui-components`, `nina-core`).
- **`docs/`**: Documentation files.

### Key Workspaces
- `@nina/ui-components`: The single source of truth for UI components (Shadcn/Radix) and styling.
- `@nina/nina-core`: Shared core logic and utilities.

## 2. Tooling

- **Package Manager**: **Bun**.
    - Always use `bun install`, `bun add`, and `bun run`.
    - Do **NOT** use `npm` or `yarn`.
- **Linting & Formatting**: **Biome**.
    - Configuration: `biome.json` at root.
    - Ignore file: `.biomeignore` at root.
    - Command: `bun run lint` (or `bun run lint:fix`).
    - Note: Biome is configured to ignore `node_modules` and build artifacts to avoid false positives.

## 3. Styling Architecture

We use **Tailwind CSS** with a centralized configuration.

### `@nina/ui-components`
- Exports shared components (Button, Card, etc.).
- Defines the base Tailwind theme variables (HSL).
- **CRITICAL**: The `Button` component base styles must include `cursor-pointer` to ensure proper hover behavior.

### Consumer Applications (`apps/*`)
- **`globals.css` Configuration**:
    - **MUST** import `@nina/ui-components` via `node_modules` resolution to avoid long relative paths:
      ```css
      @import "tailwindcss";
      @source "../../node_modules/@nina/ui-components";
      ```
    - **MUST NOT** include `@plugin "tailwindcss-animate"`. This breaks Turbopack builds. Animations are polyfilled or handled in the theme.
    - **MUST NOT** include `@media (prefers-color-scheme: dark)` if the app is intended to be Light Mode only. We enforce light mode variables in `:root`.

## 4. Creating New Applications

1.  **Bootstrap**: Use `bun create next-app`.
2.  **Dependencies**: Add workspace packages (`"workspace:*"`) to `package.json`.
3.  **Tailwind Animate**: Install `tailwindcss-animate` in the app or rely on the root installation (preferred is explicit dependency for clarity).
4.  **Verification**: Always add a "Style Check" button (`variant="destructive"`) to the homepage to verify that `ui-components` styles are passing through correctly.

## 5. Typical Workflow

1.  **Plan**: Analyze requirements.
2.  **Implementation**:
    - If modifying UI, check `@nina/ui-components` first.
    - If creating logic, see if it fits in `@nina/nina-core`.
3.  **Verification**:
    - Run `bun run build` in the specific app directory.
    - Run `bun run a:build` (if script exists) or build all affected apps.
    - Run `bun run lint` to ensure Biome compliance.
