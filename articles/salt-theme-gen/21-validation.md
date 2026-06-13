---
title: Runtime Theme Validation with parseThemeJSON()
published: false
description: parseThemeJSON() validates unknown data as a GeneratedTheme at runtime. Five patterns for file loading, API responses, user uploads, localStorage, and migration.
tags: typescript, javascript, designsystem, webdev
series: salt-theme-gen — Design Tokens for Every Framework
cover_image:
---

`generateTheme()` always produces a valid theme. But the moment you load a theme from a file, API, user upload, or `localStorage`, you're dealing with unknown data — and TypeScript's type system can't help you there.

`parseThemeJSON()` validates arbitrary data against the `GeneratedTheme` shape at runtime and returns a discriminated union.

## The return type

```ts
type ParseResult =
  | { success: true;  theme: GeneratedTheme }
  | { success: false; error: string };
```

Always check `result.success` before using `result.theme`. TypeScript narrows the type correctly after the check.

## Pattern 1 — Loading from file

```ts
import { parseThemeJSON } from 'salt-theme-gen';
import { readFileSync } from 'node:fs';

const raw    = readFileSync('theme.json', 'utf8');
const result = parseThemeJSON(JSON.parse(raw));

if (!result.success) {
  console.error('Invalid theme.json:', result.error);
  process.exit(1);
}

// result.theme is GeneratedTheme — fully typed
const { light, dark } = result.theme;
```

## Pattern 2 — API response

```ts
async function loadTeamTheme(teamId: string) {
  const res  = await fetch(`/api/themes/${teamId}`);
  const data = await res.json();

  const result = parseThemeJSON(data);
  if (!result.success) {
    // Fall back to default
    console.warn('Invalid theme from API, using default:', result.error);
    return generateTheme({ preset: 'ocean' });
  }

  return result.theme;
}
```

## Pattern 3 — User theme upload

When users upload their own theme JSON:

```ts
async function handleThemeUpload(file: File) {
  const text   = await file.text();
  const result = parseThemeJSON(JSON.parse(text));

  if (!result.success) {
    showError(`Invalid theme file: ${result.error}`);
    return;
  }

  // Safe to apply
  applyTheme(result.theme);
}
```

`result.error` contains a human-readable message describing what was wrong — good for surfacing to users.

## Pattern 4 — localStorage with fallback

```ts
import { generateTheme, parseThemeJSON } from 'salt-theme-gen';

const DEFAULT = generateTheme({ preset: 'ocean' });

function loadSavedTheme() {
  const raw = localStorage.getItem('custom-theme');
  if (!raw) return DEFAULT;

  try {
    const result = parseThemeJSON(JSON.parse(raw));
    return result.success ? result.theme : DEFAULT;
  } catch {
    return DEFAULT; // JSON.parse failed
  }
}

export const theme = loadSavedTheme();
```

The fallback guarantees the app always has a valid theme, even if `localStorage` contains a stale or corrupted value.

## Pattern 5 — Library upgrade migration

When `salt-theme-gen` releases a new version, the `GeneratedTheme` shape may have new fields. `parseThemeJSON()` validates against the current schema:

```ts
// Upgrade migration script
import { parseThemeJSON, generateTheme } from 'salt-theme-gen';
import themes from './theme-snapshots.json';

let migrated = 0, failed = 0;

for (const [id, raw] of Object.entries(themes)) {
  const result = parseThemeJSON(raw);
  if (result.success) {
    migrated++;
  } else {
    console.warn(`Theme ${id} needs regeneration:`, result.error);
    // Re-generate from preserved options
    failed++;
  }
}

console.log(`Migrated: ${migrated}, needs regeneration: ${failed}`);
```

## TypeScript narrowing

After checking `result.success`, TypeScript knows the exact type:

```ts
const result = parseThemeJSON(unknownData);

if (result.success) {
  // TypeScript: result.theme is GeneratedTheme
  const primary = result.theme.light.colors.primary; // string ✓

} else {
  // TypeScript: result.error is string
  console.error(result.error); // string ✓
}
```

No type assertions (`as`), no non-null assertions (`!`), no runtime surprises.

## The difference from type assertions

```ts
// ❌ Type assertion — lies to TypeScript, explodes at runtime
const theme = unknownData as GeneratedTheme;
theme.light.colors.primary; // might throw if light is undefined

// ✓ Runtime validation — TypeScript and runtime agree
const result = parseThemeJSON(unknownData);
if (result.success) {
  result.theme.light.colors.primary; // safe
}
```

The type assertion approach is common but dangerous at system boundaries. `parseThemeJSON()` is the correct tool when you don't control the data source.

Full guide: [learn.esalt.net/salt-theme-gen/guide/10-validation/](https://learn.esalt.net/salt-theme-gen/guide/10-validation/)
