---
title: Introducing salt-theme-gen: Generate a Complete Design System from One Color
published: false
description: Stop maintaining two 200-line color files. salt-theme-gen generates a full light/dark token set — colors, spacing, radius, typography — from a single generateTheme() call.
tags: css, webdev, javascript, designsystem
series: salt-theme-gen — Design Tokens for Every Framework
cover_image:
---

You have a design system problem if any of these sound familiar:

- Your `_variables.scss` has 80 hardcoded colors, half of them unused
- Dark mode is a second file someone maintains by hand (when they remember)
- Changing the primary color means grepping through a dozen partials and hoping nothing was hardcoded elsewhere
- The designer asked for "slightly more rounded corners" and you spent 45 minutes finding every border-radius value

`salt-theme-gen` is a zero-dependency TypeScript package that generates a complete design token set from a single call.

## What you get

```ts
import { generateTheme } from 'salt-theme-gen';

const theme = generateTheme({
  preset:   'ocean',    // or any hex color: '#6366f1'
  spacing:  'default',
  radius:   'default',
  fontSize: 'default',
});
```

One call. That's it. What comes back:

- **21 semantic colors** — `primary`, `secondary`, `background`, `surface`, `text`, `muted`, `border`, `danger`, `success`, `warning`, `info`, and their on-colors
- **32 interaction states** — `hover`, `pressed`, `focused`, `disabled` for all 8 intents
- **4 surface elevations** — `base`, `raised`, `card`, `overlay`
- **6 spacing values** — xs through xxl
- **7 border-radius values** — sm through pill
- **7 font sizes** — xs through 3xl
- **18 WCAG accessibility checks** — built-in, no extra library

All in light **and** dark mode. Both derived automatically.

## Why OKLCH instead of hex

Most design token libraries give you hex or HSL values. `salt-theme-gen` uses OKLCH — the perceptually uniform color space that ships in all modern browsers.

What this means for you: when `salt-theme-gen` adjusts lightness for dark mode or derives a hover state, the perceived brightness change is consistent. `oklch(0.55 0.2 240)` lightened to `oklch(0.65 0.2 240)` looks the same magnitude of change regardless of hue. In HSL, the same numeric change can look wildly different across colors.

The result: dark mode colors that actually look right, not just mathematically derived.

## Three steps to use it anywhere

**Step 1** — Generate the theme:

```ts
const theme = generateTheme({ preset: 'ocean' });
```

**Step 2** — Convert to CSS custom properties:

```ts
function modeToVars(mode) {
  const lines = [];
  const kebab = s => s.replace(/([A-Z])/g, '-$1').toLowerCase();

  for (const [k, v] of Object.entries(mode.colors))
    lines.push(`  --color-${kebab(k)}: ${v};`);
  for (const [k, v] of Object.entries(mode.spacing))
    lines.push(`  --space-${k}: ${v}px;`);
  for (const [k, v] of Object.entries(mode.radius))
    lines.push(`  --radius-${k}: ${v}px;`);
  for (const [k, v] of Object.entries(mode.fontSizes))
    lines.push(`  --text-${k}: ${v}px;`);

  return lines.join('\n');
}

const css = `
:root { ${modeToVars(theme.light)} }
:root[data-theme="dark"] { ${modeToVars(theme.dark)} }
`;
```

**Step 3** — Inject into `<head>` and use in CSS:

```css
.btn-primary {
  background: var(--color-primary);
  color:      var(--color-on-primary);
  padding:    var(--space-sm) var(--space-lg);
  border-radius: var(--radius-md);
}
```

That's the whole pattern. Works in React, Next.js, Vue, Svelte, Angular, Astro, vanilla JS — anything that can put a `<style>` tag in `<head>`.

## 20 built-in presets

You don't need to pick colors — you pick a character:

| Preset | Character |
| --- | --- |
| `ocean` | Deep blue, calm, professional |
| `rose` | Warm, approachable, consumer |
| `violet` | Creative, bold |
| `emerald` | Fresh, growth |
| `amber` | Energetic, warm |
| `slate` | Neutral, minimal |
| `midnight` | Dark-first, developer |

...plus 13 more: `ruby`, `cobalt`, `forest`, `sunset`, `arctic`, `copper`, `coral`, `sage`, `indigo`, `teal`, `gold`, `plum`, `crimson`.

Or skip presets entirely and pass any hex:

```ts
generateTheme({ preset: '#6366f1' }) // your brand color
```

## Scale presets

Three options each for spacing, radius, and font size:

```ts
generateTheme({
  preset:   'ocean',
  spacing:  'compact',  // or 'default' | 'spacious'
  radius:   'rounded',  // or 'sharp' | 'default' | 'pill'
  fontSize: 'large',    // or 'compact' | 'default'
});
```

A startup UI uses `spacing: 'spacious'` + `radius: 'rounded'`. A developer tool uses `spacing: 'compact'` + `radius: 'sharp'`. The personality of your UI comes from this combination, not just the color.

## What's next in this series

This series covers every major framework and use case:

- **Dark mode with zero JavaScript flash** (next article)
- **WCAG accessibility built-in** — what the 18 checks cover
- **React, Next.js, Vue, SvelteKit, Angular, Astro, Remix** — one article per framework
- **Tailwind CSS, React Native, Expo, Flutter, Storybook, CSS-in-JS, Sass**
- **TypeScript integration** — typed theme objects, exhaustive switches
- **Using with Claude Code, Cursor, and v0.dev** — prompt templates

Install and follow along:

```bash
npm install salt-theme-gen
```

Full documentation: [learn.esalt.net/salt-theme-gen](https://learn.esalt.net/salt-theme-gen/)

---

*Part of the **salt-theme-gen — Design Tokens for Every Framework** series · Article 1 of 24*

[02. Dark Mode in 5 Minutes →](./02-dark-mode-in-5-minutes.md)
