---
title: TypeScript-first Design Tokens with salt-theme-gen
published: false
description: All exported types, typed theme consumers, IntentName/StateName patterns, exhaustive switches, and tsconfig recommendations for strict token usage.
tags: typescript, javascript, designsystem, webdev
series: salt-theme-gen — Design Tokens for Every Framework
cover_image:
---

`salt-theme-gen` is authored in TypeScript with full type exports. No `@types` package needed, no casting, no `any`. This article covers the type system from consumer perspective — how to write typed components, exhaustive switches, and module augmentation for CSS-in-JS libraries.

## Exported types

```ts
import type {
  GeneratedTheme,      // { light: GeneratedThemeMode, dark: GeneratedThemeMode }
  GeneratedThemeMode,  // colors, states, surfaceElevation, spacing, radius, fontSizes, accessibility
  ThemeOptions,        // options for generateTheme()
  ThemeDiff,          // return type of diffTheme()
  ParseResult,        // { success: true, theme } | { success: false, error }
  IntentName,         // 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'danger' | 'success' | 'warning' | 'info' | 'neutral'
  StateName,          // 'hover' | 'pressed' | 'focused' | 'disabled'
  SpacingScale,       // 'compact' | 'default' | 'spacious'
  RadiusScale,        // 'sharp' | 'default' | 'rounded' | 'pill'
  FontScale,          // 'compact' | 'default' | 'large'
} from 'salt-theme-gen';
```

## Typing theme consumers

When a component accepts an intent prop:

```tsx
import type { IntentName } from 'salt-theme-gen';

interface BadgeProps {
  label:  string;
  intent: IntentName;
}

export function Badge({ label, intent }: BadgeProps) {
  const { mode } = useTheme();

  const bg = mode.colors[intent];
  const fg = mode.colors[`on${intent[0].toUpperCase()}${intent.slice(1)}` as keyof typeof mode.colors];

  return (
    <span style={{ backgroundColor: bg, color: fg, padding: '2px 8px', borderRadius: 'var(--radius-pill)' }}>
      {label}
    </span>
  );
}
```

`IntentName` constrains the prop to exactly the intents that exist — no invalid values at compile time.

## Exhaustive switch on StateName

```ts
import type { StateName } from 'salt-theme-gen';

function getStateDescription(state: StateName): string {
  switch (state) {
    case 'hover':    return 'User is hovering';
    case 'pressed':  return 'User is pressing';
    case 'focused':  return 'Element has focus';
    case 'disabled': return 'Element is disabled';
    default: {
      const _never: never = state; // TypeScript error if new state added
      return _never;
    }
  }
}
```

If `salt-theme-gen` adds a new `StateName` value in a future version, the `never` branch causes a compile error at every exhaustive switch — you can't miss handling it.

## Accessing nested token paths safely

```ts
import { generateTheme } from 'salt-theme-gen';
import type { IntentName, StateName } from 'salt-theme-gen';

const theme = generateTheme({ preset: 'ocean' });

function getStateColor(intent: IntentName, state: StateName): string {
  const states = theme.light.states[intent as keyof typeof theme.light.states];
  return states[state];
}
```

Both `intent` and `state` are constrained to valid values. Passing an invalid string is a compile error.

## Module augmentation for styled-components

```ts
// src/theme/styled.d.ts
import type { GeneratedThemeMode } from 'salt-theme-gen';
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme extends GeneratedThemeMode {}
}
```

After this, every `${({ theme }) => theme.colors.primary}` interpolation is fully typed — hover states, spacing values, font sizes, all with autocomplete.

## Module augmentation for Emotion

```ts
// src/theme/emotion.d.ts
import type { GeneratedThemeMode } from 'salt-theme-gen';
import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme extends GeneratedThemeMode {}
}
```

## ParseResult narrowing

The discriminated union pattern:

```ts
import { parseThemeJSON } from 'salt-theme-gen';
import type { ParseResult } from 'salt-theme-gen';

function processTheme(result: ParseResult) {
  if (result.success) {
    // TypeScript: result.theme is GeneratedTheme
    return result.theme.light.colors.primary;
  }
  // TypeScript: result.error is string
  throw new Error(result.error);
}
```

No `as` assertions, no `!` non-null assertions.

## Utility types from GeneratedThemeMode

```ts
import type { GeneratedThemeMode } from 'salt-theme-gen';

// Extract just the colors object type
type ThemeColors = GeneratedThemeMode['colors'];

// Extract just the spacing object type
type ThemeSpacing = GeneratedThemeMode['spacing'];

// Color key names
type ColorKey = keyof GeneratedThemeMode['colors'];
// = 'primary' | 'secondary' | 'background' | 'surface' | 'text' | ...

// Spacing key names
type SpacingKey = keyof GeneratedThemeMode['spacing'];
// = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
```

## tsconfig recommendations

```json
{
  "compilerOptions": {
    "strict":           true,   // catches unsafe accesses
    "noUncheckedIndexedAccess": true, // catches theme.colors[unknownKey]
    "exactOptionalPropertyTypes": true
  }
}
```

With `noUncheckedIndexedAccess`, accessing `theme.light.colors[someVariable]` returns `string | undefined` — forcing you to handle the case where `someVariable` isn't a valid color key. Use `IntentName` and `keyof` to avoid this where the key is known.

## Inference at the call site

`generateTheme()` returns `GeneratedTheme` without any explicit annotation needed:

```ts
const theme = generateTheme({ preset: 'ocean' });
// TypeScript infers: theme: GeneratedTheme

const primary = theme.light.colors.primary;
// TypeScript infers: primary: string
```

If you store the theme module-level:

```ts
// src/lib/theme.ts
import { generateTheme } from 'salt-theme-gen';
export const theme = generateTheme({ preset: 'ocean' });
export type AppTheme = typeof theme; // GeneratedTheme
```

Full guide: [learn.esalt.net/salt-theme-gen/guide/11-typescript/](https://learn.esalt.net/salt-theme-gen/guide/11-typescript/)

---

*Part of the **salt-theme-gen — Design Tokens for Every Framework** series · Article 22 of 24*

[← 21. parseThemeJSON()](./21-validation.md) &nbsp;·&nbsp; [23. With AI Assistants →](./23-ai-assistants.md)
