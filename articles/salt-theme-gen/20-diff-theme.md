---
title: Comparing Themes with diffTheme() — Design Review, A/B Tests, Regressions
published: false
description: diffTheme() returns only the tokens that changed between two themes. Use it for design review sign-off, A/B testing, accessibility regression CI, and migration audits.
tags: css, javascript, designsystem, testing
series: salt-theme-gen — Design Tokens for Every Framework
cover_image:
---

Design system changes often affect more than intended. You update the primary color, but the hover state, the button text color, and three semantic tokens you forgot about also shift. `diffTheme()` surfaces exactly what changed — nothing more, nothing less.

## Basic usage

```ts
import { generateTheme, adjustTheme, diffTheme } from 'salt-theme-gen';

const v1 = generateTheme({ preset: 'ocean' });
const v2 = adjustTheme(v1, {
  light: { colors: { primary: '#6366f1' } },
  dark:  { colors: { primary: '#818cf8' } },
});

const diff = diffTheme(v1, v2);
console.log(diff.light?.colors);
// { primary: { from: 'oklch(0.55 0.2 235)', to: '#6366f1' } }
// All other color keys: undefined (unchanged)
```

`diff.light` and `diff.dark` are deep partials of `GeneratedThemeMode` — only changed paths appear.

## 5 real-world use cases

### 1. Design review sign-off

Before merging a theme change, print a readable summary:

```ts
function printDiff(diff: ReturnType<typeof diffTheme>) {
  for (const [mode, changes] of Object.entries(diff)) {
    if (!changes) continue;
    console.log(`\n── ${mode} mode ──`);
    walkDiff(changes, []);
  }
}

function walkDiff(obj: Record<string, any>, path: string[]) {
  for (const [key, val] of Object.entries(obj)) {
    if (val && typeof val === 'object' && 'from' in val) {
      console.log(`  ${[...path, key].join('.')}`);
      console.log(`    from: ${val.from}`);
      console.log(`    to:   ${val.to}`);
    } else if (val && typeof val === 'object') {
      walkDiff(val, [...path, key]);
    }
  }
}

printDiff(diffTheme(themeV1, themeV2));
```

Output:
```
── light mode ──
  colors.primary
    from: oklch(0.55 0.2 235)
    to:   #6366f1

  states.primary.hover
    from: oklch(0.62 0.2 235)
    to:   oklch(0.62 0.2 265)
```

### 2. Verify adjustTheme touched only what you intended

```ts
const base     = generateTheme({ preset: 'slate' });
const adjusted = adjustTheme(base, { light: { radius: { md: 4 } }, dark: { radius: { md: 4 } } });
const diff     = diffTheme(base, adjusted);

// Should only see radius.md changed
const changedPaths = collectPaths(diff);
console.assert(changedPaths.every(p => p.includes('radius')), 'Unexpected changes!');
```

### 3. A/B test tracking

Run two presets simultaneously and record which token values differ:

```ts
const control  = generateTheme({ preset: 'ocean' });
const variant  = generateTheme({ preset: 'violet' });
const diff     = diffTheme(control, variant);

// Log to analytics
analytics.track('theme_ab_diff', {
  changedColorCount: Object.keys(diff.light?.colors ?? {}).length,
  presets: ['ocean', 'violet'],
});
```

### 4. Accessibility regression CI

```ts
import { generateTheme, diffTheme } from 'salt-theme-gen';

const previous = generateTheme({ preset: 'ocean' });
const current  = generateTheme({ preset: 'ocean' }); // or load from file

const diff = diffTheme(previous, current);

// Check if any accessibility-relevant color changed
if (diff.light?.colors || diff.dark?.colors) {
  // Re-run WCAG checks on current
  const failures = Object.entries(current.light.accessibility)
    .filter(([, c]) => !c.aa)
    .map(([name]) => name);

  if (failures.length > 0) {
    console.error('Color change introduced WCAG AA failures:', failures);
    process.exit(1);
  }
}

console.log('✓ No accessibility regressions');
```

### 5. Migration audit

When migrating from hand-written tokens to generated tokens, verify what changed:

```ts
import { parseThemeJSON } from 'salt-theme-gen';

// Load your old theme as a JSON snapshot (if you have one)
const oldResult = parseThemeJSON(require('./old-theme.json'));
if (!oldResult.success) throw new Error(oldResult.error);

const newTheme = generateTheme({ preset: 'ocean' });
const diff     = diffTheme(oldResult.theme, newTheme);

// Output a migration report
const changed = countChanges(diff);
console.log(`Migration changes: ${changed} tokens differ`);
```

## Counting changed tokens

```ts
function countChanges(diff: ReturnType<typeof diffTheme>): number {
  let count = 0;

  function walk(obj: Record<string, any>) {
    for (const val of Object.values(obj)) {
      if (val && typeof val === 'object' && 'from' in val) count++;
      else if (val && typeof val === 'object') walk(val);
    }
  }

  if (diff.light) walk(diff.light as any);
  if (diff.dark)  walk(diff.dark  as any);
  return count;
}
```

## What diffTheme doesn't tell you

`diffTheme` compares token values — it doesn't know which components use which tokens. A change to `--state-primary-hover` affects every hover state in your app, but `diffTheme` just shows you the value changed from A to B.

For visual regression testing (which components actually look different), pair `diffTheme` in CI to detect token changes, then run Chromatic or Percy to capture which stories changed visually.

Full guide: [learn.esalt.net/salt-theme-gen/guide/09-comparing-themes/](https://learn.esalt.net/salt-theme-gen/guide/09-comparing-themes/)

---

*Part of the **salt-theme-gen — Design Tokens for Every Framework** series · Article 20 of 24*

[← 19. adjustTheme()](./19-adjust-theme.md) &nbsp;·&nbsp; [21. parseThemeJSON() →](./21-validation.md)
