# Creating a New Application

This guide documents the steps required to create a new application in this monorepo, ensuring correct integration with shared packages (`@nina/ui-components`, `@nina/nina-core`) and consistent styling.

## 1. Create the Application

Use `bun` to create a new Next.js application within the `apps` directory.

```bash
cd apps
bun create next-app my-new-app
```
*Select your preferences (TypeScript, Tailwind, etc.).*

## 2. Configure Dependencies

Update `package.json` in your new app (`apps/my-new-app/package.json`) to include the workspace packages.

```json
{
  "dependencies": {
    "@nina/ui-components": "workspace:*",
    "@nina/nina-core": "workspace:*",
    "tailwindcss-animate": "^1.0.7"
    // ... other dependencies
  }
}
```

Run `bun install` from the **root** of the monorepo to link the packages.

**Note:** While `tailwindcss-animate` is installed in the root, adding it to your app's `package.json` ensures consistent resolution.

## 3. Configure Styling

### `src/app/globals.css`

Replace the content of `src/app/globals.css` with the following configuration. This ensures that:
1.  Tailwind is initialized.
2.  The shared UI components are scanned by Tailwind (via `@source`).
3.  CSS variables are defined (HSL format) for the shared theme.
4.  Light mode is enforced (no dark mode media query).

```css
@import "tailwindcss";

/* 
 * Point to the shared ui-components package relative to this file.
 * Ensure this path correctly resolves to the symlink in your app's node_modules.
 */
@source "../../node_modules/@nina/ui-components";

:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;

  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;

  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;

  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;

  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;

  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;

  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;

  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;

  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;

  --radius: 0.5rem;
}

@theme inline {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
  
  --animate-accordion-down: accordion-down 0.2s ease-out;
  --animate-accordion-up: accordion-up 0.2s ease-out;

  @keyframes accordion-down {
    from { height: 0; }
    to { height: var(--radix-accordion-content-height); }
  }
  @keyframes accordion-up {
    from { height: var(--radix-accordion-content-height); }
    to { height: 0; }
  }
}

/* Force light mode defaults by applying base styles */
body {
  @apply bg-background text-foreground;
  font-family: var(--font-geist-sans), Arial, Helvetica, sans-serif;
}
```

### Important Styling Notes
- **Do NOT** add `@plugin "tailwindcss-animate";` to `globals.css`. It can cause build resolution errors with Turbopack. The necessary animations are polyfilled in the `@theme` block.
- **Do NOT** add `@media (prefers-color-scheme: dark)` if you want to enforce light mode.

## 4. Usage

You can now import and use shared components in your pages.

```tsx
import { Button } from "@nina/ui-components";

export default function Page() {
  return (
    <div>
      <Button>Click me</Button>
    </div>
  );
}
```
