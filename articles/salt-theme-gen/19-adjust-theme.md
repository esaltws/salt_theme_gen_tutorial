---
title: Customizing Tokens with adjustTheme() — Override Without Regenerating
published: false
description: adjustTheme() lets you override specific token values while keeping everything else generated. Six common patterns for real-world customization needs.
tags: css, javascript, designsystem, typescript
series: salt-theme-gen — Design Tokens for Every Framework
cover_image:
---

`generateTheme()` gets you 90% of the way there. `adjustTheme()` covers the other 10% — overriding specific tokens for brand alignment, special cases, or fine-tuning without discarding the generated base.

## Basic usage

```ts
import { generateTheme, adjustTheme } from 'salt-theme-gen';

const base = generateTheme({ preset: 'ocean' });

const adjusted = adjustTheme(base, {
  light: {
    colors: {
      primary: '#6366f1', // override just primary
    },
  },
  dark: {
    colors: {
      primary: '#818cf8', // different dark-mode value
    },
  },
});
```

`adjustTheme` accepts a deep partial of `GeneratedTheme` — you only specify what you want to change. Everything else stays as generated.

## 6 common patterns

### 1. Brand color alignment

Your brand hex doesn't exactly match any preset. Override the primary and let everything else derive from the generated base:

```ts
const theme = adjustTheme(
  generateTheme({ preset: 'indigo' }), // closest preset
  {
    light: { colors: { primary: '#4f46e5', onPrimary: '#ffffff' } },
    dark:  { colors: { primary: '#6366f1', onPrimary: '#ffffff' } },
  }
);
```

### 2. Looser spacing for a landing page section

One section needs more room. Override just the XL values:

```ts
const heroTheme = adjustTheme(generateTheme({ preset: 'ocean' }), {
  light: { spacing: { xl: 64, xxl: 96 } },
  dark:  { spacing: { xl: 64, xxl: 96 } },
});
```

### 3. Stronger dark mode background

The generated dark background is too light for an AMOLED-first app:

```ts
const amoledTheme = adjustTheme(generateTheme({ preset: 'midnight' }), {
  dark: {
    colors: {
      background: '#000000',
      surface:    '#0a0a0a',
    },
  },
});
```

### 4. Less rounded buttons

Your design language is slightly sharper than the `default` radius scale allows:

```ts
const theme = adjustTheme(generateTheme({ preset: 'slate' }), {
  light: { radius: { md: 4, lg: 6 } },
  dark:  { radius: { md: 4, lg: 6 } },
});
```

### 5. Accessible warning color

`warning` yellow can fail WCAG contrast on white backgrounds. Force a darker value:

```ts
const accessible = adjustTheme(generateTheme({ preset: 'amber' }), {
  light: {
    colors: {
      warning:   'oklch(0.55 0.18 80)',  // darker than default
      onWarning: '#000000',
    },
  },
});
```

Then verify: `accessible.light.accessibility.warningOnBackground.aa` should be `true`.

### 6. Multi-tenant preset switching

Each tenant has a brand color. Generate a base and adjust per-tenant:

```ts
function tenantTheme(brandHex: string) {
  return adjustTheme(
    generateTheme({ preset: 'ocean' }),
    {
      light: { colors: { primary: brandHex } },
      dark:  { colors: { primary: lighten(brandHex) } }, // your lighten util
    }
  );
}
```

## Chaining adjustments

`adjustTheme` returns a `GeneratedTheme` — you can chain:

```ts
const theme = adjustTheme(
  adjustTheme(
    generateTheme({ preset: 'rose' }),
    { light: { colors: { primary: '#e11d48' } }, dark: { colors: { primary: '#fb7185' } } }
  ),
  { light: { spacing: { xl: 40 } }, dark: { spacing: { xl: 40 } } }
);
```

Or branch — same base, two variant themes for A/B testing:

```ts
const base    = generateTheme({ preset: 'ocean' });
const variantA = adjustTheme(base, { light: { radius: { md: 8  } }, dark: { radius: { md: 8  } } });
const variantB = adjustTheme(base, { light: { radius: { md: 16 } }, dark: { radius: { md: 16 } } });
```

## When to use adjustTheme vs re-generating

| Situation | Use |
| --- | --- |
| One or two specific overrides | `adjustTheme()` |
| Completely different color palette | `generateTheme()` with new preset or hex |
| Per-user or per-tenant brand | `adjustTheme()` on a base theme |
| Fine-tuning after seeing output | `adjustTheme()` |
| Fundamental change in design language | New `generateTheme()` call |

## Comparing before/after

Use `diffTheme()` to verify what actually changed:

```ts
import { diffTheme } from 'salt-theme-gen';

const base     = generateTheme({ preset: 'ocean' });
const adjusted = adjustTheme(base, { light: { colors: { primary: '#6366f1' } } });
const diff     = diffTheme(base, adjusted);

// diff.light.colors.primary → { from: 'oklch(...)', to: '#6366f1' }
// All other fields: undefined (unchanged)
```

`diffTheme()` returns only the changed keys — useful for verifying that an adjustment touched exactly what you intended.

Full guide: [learn.esalt.net/salt-theme-gen/guide/08-adjusting-themes/](https://learn.esalt.net/salt-theme-gen/guide/08-adjusting-themes/)

---

*Part of the **salt-theme-gen — Design Tokens for Every Framework** series · Article 19 of 24*

[← 18. With Sass/SCSS](./18-sass.md) &nbsp;·&nbsp; [20. diffTheme() →](./20-diff-theme.md)
