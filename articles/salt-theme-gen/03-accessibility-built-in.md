---
title: WCAG Accessibility Built Into Your Design Tokens
published: false
description: salt-theme-gen runs 18 WCAG 2.1 contrast ratio checks on every generated theme. Here's what it checks and how to use it in CI.
tags: accessibility, css, webdev, a11y
series: salt-theme-gen — Design Tokens for Every Framework
cover_image:
---

Accessibility audits usually happen late. A tool runs on the deployed site, flags a dozen low-contrast text/background combinations, and now you're backtracking through component styles to fix values that were baked in months ago.

`salt-theme-gen` runs 18 WCAG 2.1 contrast ratio checks at token generation time — before any components are built. If a token combination fails, you know before writing a line of CSS.

## What gets checked

```ts
const theme = generateTheme({ preset: 'ocean' });
const { accessibility } = theme.light;
```

Every check is a `{ ratio: number; aa: boolean; aaa: boolean }` object:

```ts
accessibility.primaryOnBackground
// { ratio: 4.82, aa: true, aaa: false }

accessibility.textOnBackground
// { ratio: 12.1, aa: true, aaa: true }

accessibility.onPrimaryOnPrimary
// { ratio: 5.1, aa: true, aaa: false }
```

The 18 checks cover:

**Text legibility** — the most common a11y failure:
- `textOnBackground` — body text on page background
- `textOnSurface` — body text on card/panel surfaces
- `mutedOnBackground` — secondary text on page background
- `mutedOnSurface` — secondary text on card surfaces

**Interactive elements** — buttons, links, badges:
- `primaryOnBackground` — primary color used as link/icon color
- `primaryOnSurface` — primary color on card backgrounds

**On-color text** — text inside colored buttons:
- `onPrimaryOnPrimary` — the text that sits inside a primary button
- `onDangerOnDanger` — text inside danger/error buttons
- `onSuccessOnSuccess` — text inside success buttons
- `onWarningOnWarning` — text inside warning buttons

**Semantic colors as text** — danger/success/warning/info as standalone text:
- `dangerOnBackground`, `dangerOnSurface`
- `successOnBackground`, `successOnSurface`
- `warningOnBackground`, `warningOnSurface`
- `infoOnBackground`, `infoOnSurface`

All built-in presets pass WCAG AA for every check. Many pass AAA.

## Fail fast in CI

The accessibility report is just JavaScript — you can assert on it anywhere Node.js runs:

```ts
import { generateTheme } from 'salt-theme-gen';

const theme = generateTheme({ preset: 'ocean' });

const failures = Object.entries(theme.light.accessibility)
  .filter(([, check]) => !check.aa)
  .map(([name, check]) => `${name}: ${check.ratio.toFixed(2)} (needs 4.5)`);

if (failures.length > 0) {
  console.error('WCAG AA failures in light mode:');
  failures.forEach(f => console.error(' ·', f));
  process.exit(1);
}

console.log('✓ All WCAG AA checks pass');
```

Add to `package.json`:

```json
{
  "scripts": {
    "check:a11y": "node scripts/check-accessibility.mjs"
  }
}
```

Or add it as a pre-build step: if accessibility fails, the build fails.

## What happens when you use a custom color

When you pass a hex color instead of a preset, `salt-theme-gen` still runs the checks:

```ts
const theme = generateTheme({ preset: '#f59e0b' }); // amber
const { accessibility } = theme.light;

// Check automatically
if (!accessibility.primaryOnBackground.aa) {
  // amber on white fails — but the package already handled it:
  // OKLCH lightness was auto-adjusted to meet AA
}
```

When a generated color would fail AA contrast, `salt-theme-gen` auto-corrects it by shifting OKLCH lightness while preserving hue and chroma. You get the closest color to your input that still passes — without hand-tuning.

## Checking dark mode too

Dark mode needs its own accessibility verification — colors that pass in light mode can fail in dark:

```ts
const lightFailures = Object.entries(theme.light.accessibility)
  .filter(([, c]) => !c.aa);

const darkFailures = Object.entries(theme.dark.accessibility)
  .filter(([, c]) => !c.aa);

const allClear = lightFailures.length === 0 && darkFailures.length === 0;
```

All built-in presets pass in both modes.

## Manual contrast check

For colors outside the token system — an illustration, a chart color, a third-party component:

```ts
import { contrastRatio } from 'salt-theme-gen';

const ratio = contrastRatio(
  theme.light.colors.primary,
  theme.light.colors.background
);

console.log(ratio);        // e.g. 4.82
console.log(ratio >= 4.5); // true — passes AA
console.log(ratio >= 7.0); // false — doesn't reach AAA
```

Use this when you want to verify a color combination that isn't in the standard 18 checks.

## The bottom line

Accessibility in design tokens is a solved problem. Running 18 WCAG checks on every theme means:

- A junior developer can change the preset and know whether it passes
- CI catches contrast regressions before they ship
- Dark mode is verified separately, not assumed to be fine

Next in the series: [20 color presets — which one fits your project](https://learn.esalt.net/salt-theme-gen/guide/04-color-presets/)

---

*Part of the **salt-theme-gen — Design Tokens for Every Framework** series · Article 3 of 24*

[← 02. Dark Mode in 5 Minutes](./02-dark-mode-in-5-minutes.md) &nbsp;·&nbsp; [04. Color Presets →](./04-color-presets.md)
