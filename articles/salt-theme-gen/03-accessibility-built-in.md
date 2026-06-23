---
title: You finish the UI, run Lighthouse, and suddenly six color pairs fail WCAG AA
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

Every check is a `{ ratio: number; level: 'AAA' | 'AA' | 'fail' }` object:

```ts
accessibility.primaryOnBackground
// { ratio: 4.51, level: 'AA' }

accessibility.textOnBackground
// { ratio: 18.4, level: 'AAA' }

accessibility.onPrimaryOnPrimary
// { ratio: 4.9, level: 'AA' }
```

18 checks + OKLCH auto-correction + CI-friendly report:

**Text legibility** (2):

- `textOnBackground` — body text on page background
- `textOnSurface` — body text on card/input surfaces

**Brand colors on background** (4):

- `primaryOnBackground` — primary accent as text/icon on background
- `secondaryOnBackground` — secondary accent as text/icon on background
- `tertiaryOnBackground` — tertiary accent as text/icon on background
- `quaternaryOnBackground` — quaternary accent as text/icon on background

**On-color text — button/badge labels** (4):

- `onPrimaryOnPrimary` — text inside a primary button
- `onSecondaryOnSecondary` — text inside a secondary button
- `onTertiaryOnTertiary` — text inside a tertiary button
- `onQuaternaryOnQuaternary` — text inside a quaternary button

**Semantic colors on background** (4):

- `dangerOnBackground`, `successOnBackground`, `warningOnBackground`, `infoOnBackground`

**On-semantic foregrounds** (4):

- `onDangerOnDanger`, `onSuccessOnSuccess`, `onWarningOnWarning`, `onInfoOnInfo`

All built-in presets pass WCAG AA for every check. Many pass AAA.

## Fail fast in CI

The accessibility report is just JavaScript — you can assert on it anywhere Node.js runs:

```ts
import { generateTheme } from 'salt-theme-gen';

const theme = generateTheme({ preset: 'ocean' });

const failures = Object.entries(theme.light.accessibility)
  .filter(([, check]) => check.level === 'fail')
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
const theme = generateTheme({ primary: '#f59e0b' }); // amber
const { accessibility } = theme.light;

// Check automatically
if (accessibility.primaryOnBackground.level === 'fail') {
  // amber on white fails — but the package already handled it:
  // OKLCH lightness was auto-adjusted to meet AA
}
```

When a generated color would fail AA contrast, `salt-theme-gen` auto-corrects it by shifting OKLCH lightness while preserving hue and chroma. You get the closest color to your input that still passes — without hand-tuning.

## Checking dark mode too

Dark mode needs its own accessibility verification — colors that pass in light mode can fail in dark:

```ts
const lightFailures = Object.entries(theme.light.accessibility)
  .filter(([, c]) => c.level === 'fail');

const darkFailures = Object.entries(theme.dark.accessibility)
  .filter(([, c]) => c.level === 'fail');

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

Color contrast in design tokens can be handled before components are built. Running 18 WCAG checks on every theme means:

- A junior developer can change the preset and know whether it passes
- CI catches contrast regressions before they ship
- Dark mode is verified separately, not assumed to be fine

Previous article: [Introducing salt-theme-gen — Generate a Complete Design System from One Color](https://dev.to/hasansarwer/introducing-salt-theme-gen-generate-a-complete-design-system-from-one-color-2a9j)

Full documentation: [learn.esalt.net/salt-theme-gen](https://learn.esalt.net/salt-theme-gen/)

Next in the series: [20 color presets — which one fits your project](https://learn.esalt.net/salt-theme-gen/guide/04-color-presets/)

---

*Part of the **salt-theme-gen — Design Tokens for Every Framework** series · Article 3 of 24*

[← 02. Dark Mode in 5 Minutes](./02-dark-mode-in-5-minutes.md) &nbsp;·&nbsp; [04. Color Presets →](./04-color-presets.md)
