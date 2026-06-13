---
title: Using salt-theme-gen with Claude, Cursor, and v0.dev
published: false
description: Prompt templates that give AI coding assistants the exact context to wire up salt-theme-gen correctly. Generic setup, per-framework, and Cursor rules.
tags: ai, css, webdev, javascript
series: salt-theme-gen — Design Tokens for Every Framework
cover_image:
---

AI coding assistants are good at pattern-following. Give them the exact token names, the injection pattern, and the dark mode strategy, and they wire up `salt-theme-gen` correctly in one shot. Give them nothing and they hallucinate a different API.

This article covers the prompts that work.

## The generic setup prompt

Works with Claude, ChatGPT, Cursor chat, and GitHub Copilot:

```
Add salt-theme-gen design tokens to this project.

INSTALL: npm install salt-theme-gen

GENERATE: Create src/theme.ts with:
  import { generateTheme } from 'salt-theme-gen';
  export const theme = generateTheme({ preset: 'ocean' });

INJECT CSS INTO <head>:
  Build :root { ... } from theme.light and :root[data-theme="dark"] { ... } from theme.dark.
  Token naming:
    colors.primary        → --color-primary
    colors.onPrimary      → --color-on-primary  (camelCase → kebab-case)
    surfaceElevation.card → --surface-card
    spacing.md            → --space-md
    radius.md             → --radius-md
    fontSizes.md          → --text-md
    states.primary.hover  → --state-primary-hover

DARK MODE: toggle data-theme="dark" on <html>. Add a synchronous inline script
(no defer/async) in <head> that reads localStorage and sets data-theme before paint.

REPLACE: All hardcoded hex/rgb/hsl in the codebase with var(--color-*), var(--space-*), etc.
```

## Claude Code — file system access

Claude Code can read files and run commands, so you can be more direct:

```
Install salt-theme-gen (npm install salt-theme-gen).
Then wire it up for this [React/Next.js/Vue/etc] project:
1. Create src/theme.ts — generateTheme({ preset: 'ocean' })
2. Inject CSS variables before the app renders
3. Add flash-prevention inline script in index.html
4. Create a ThemeContext with toggle and localStorage persistence
5. Audit all files for hardcoded colors and replace them with CSS variables
```

Claude Code will find the entry file, modify it, create the context, and grep for hardcoded colors.

**Change preset:**
```
Change the salt-theme-gen preset from ocean to rose.
Find generateTheme() in src/theme.ts and update the preset argument.
No other changes needed.
```

**Audit hardcoded colors:**
```
Search all source files for hardcoded color values (hex, rgb, rgba, hsl, hsla).
List every occurrence with file and line number.
Then replace each with the appropriate salt-theme-gen CSS variable:
brand/action → --color-primary
background → --color-background
surface/panel → --color-surface or --surface-card
body text → --color-text
secondary text → --color-muted
borders → --color-border
errors → --color-danger
```

## Cursor rules

Create `.cursor/rules/design-tokens.mdc`:

```markdown
---
description: Enforce salt-theme-gen design tokens
globs: ["**/*.tsx", "**/*.ts", "**/*.css", "**/*.scss"]
alwaysApply: true
---

This project uses salt-theme-gen CSS custom properties for all design values.

REQUIRED — use these variables, never hardcode values:
- Colors: var(--color-primary), var(--color-secondary), var(--color-background),
  var(--color-surface), var(--color-text), var(--color-muted), var(--color-border),
  var(--color-danger), var(--color-success), var(--color-warning), var(--color-info)
- On-colors: var(--color-on-primary), var(--color-on-danger), var(--color-on-success)
- Spacing: var(--space-xs) var(--space-sm) var(--space-md) var(--space-lg) var(--space-xl) var(--space-xxl)
- Radius: var(--radius-sm) var(--radius-md) var(--radius-lg) var(--radius-pill)
- Font size: var(--text-xs) var(--text-sm) var(--text-md) var(--text-lg) var(--text-xl)
- States: var(--state-primary-hover), var(--state-primary-focused), etc.

NEVER write: hex values, rgb(), rgba(), hsl(), arbitrary Tailwind values like bg-[#xxx]
DARK MODE: toggle data-theme="dark" on <html> — do not duplicate styles for dark mode
```

With `alwaysApply: true`, Cursor applies these rules to every edit in the matched files.

## v0.dev — component generation

Tell v0 which CSS variables to expect so generated components use the right names:

```
Build a [card/button/modal/form] component.

Assume these CSS variables are available globally:
--color-primary, --color-on-primary, --color-background, --color-surface,
--color-text, --color-muted, --color-border, --color-danger, --color-success
--space-xs, --space-sm, --space-md, --space-lg, --space-xl
--radius-sm, --radius-md, --radius-lg, --radius-pill
--state-primary-hover, --state-primary-focused, --state-primary-disabled

Use CSS variables in inline styles or className strings. Do not hardcode colors.
```

v0's output uses `var(--color-primary)` etc. — drop it into any project that has salt-theme-gen injected.

## What AI assistants get wrong without a prompt

Without explicit guidance, AI assistants tend to:
- Invent a `salt-theme-gen` API that doesn't exist
- Hardcode hex values instead of using tokens
- Use `class="text-blue-500"` Tailwind arbitrary classes
- Put `generateTheme()` in a React component (expensive, regenerates on every render)
- Forget the synchronous flash-prevention script

The prompts above give the assistant enough context to avoid all five.

Full AI resources: [learn.esalt.net/salt-theme-gen/ai/](https://learn.esalt.net/salt-theme-gen/ai/)
