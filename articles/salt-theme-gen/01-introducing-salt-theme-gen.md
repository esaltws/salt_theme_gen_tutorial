---
title: Introducing salt-theme-gen: Generate a Complete Design System from One Color
published: true
description: Stop maintaining two 200-line color files. salt-theme-gen generates a full light/dark token set — colors, spacing, radius, typography — from a single generateTheme() call.
tags: css, webdev, javascript, designsystem
series: salt-theme-gen — Design Tokens for Every Framework
cover_image:
---

---

title: Introducing salt-theme-gen: Generate a Complete Design System from One Color
published: true
description: Stop maintaining scattered color files. salt-theme-gen generates a full light/dark design-token system — colors, states, spacing, radius, typography, elevation, and accessibility reports — from one generateTheme() call.
tags: css, webdev, javascript, designsystem
series: salt-theme-gen — Design Tokens for Every Framework
cover_image:
------------

You have a design system problem if any of these sound familiar:

* Your `_variables.scss` has dozens of hardcoded colors, and nobody knows which ones are still used
* Dark mode is a second file someone maintains by hand
* Changing the primary color means searching through components and hoping nothing was hardcoded
* Hover, pressed, focused, and disabled states are all slightly inconsistent
* The designer asks for "slightly more rounded corners" and you spend time finding every `border-radius` value

The problem is not only color.

The problem is that the UI has no system.

`salt-theme-gen` is a zero-dependency TypeScript package that generates a complete design-token system from one function call.

One preset or one brand color goes in.

A full light/dark theme comes out.

## What you get

```ts
import { generateTheme } from 'salt-theme-gen';

const theme = generateTheme({
  preset:   'ocean',    // one of 20 named presets
  spacing:  'default',
  radius:   'default',
  fontSize: 'default',
});
```

One call. That's it.

The generated theme includes:

* **21 semantic colors** — brand colors, surface colors, text colors, border, intent colors, and readable `on*` foregrounds
* **32 interaction states** — `hover`, `pressed`, `focused`, and `disabled` for all 8 intents
* **4 surface elevation layers** — `card`, `elevated`, `modal`, and `popover`
* **7 spacing values** — `none` through `xxl`
* **7 border-radius values** — `none` through `pill`
* **7 font sizes** — `xs` through `3xl`
* **18 WCAG contrast checks** — built into every generated theme

All of that is generated for both:

```ts
theme.light
theme.dark
```

Light mode and dark mode have the same structure, so your components can switch modes without changing how they read tokens.

## The generated theme shape

Each mode contains the same seven top-level fields:

```ts
theme.light.colors
theme.light.states
theme.light.surfaceElevation
theme.light.spacing
theme.light.radius
theme.light.fontSizes
theme.light.accessibility
```

And the same structure exists in dark mode:

```ts
theme.dark.colors
theme.dark.states
theme.dark.surfaceElevation
theme.dark.spacing
theme.dark.radius
theme.dark.fontSizes
theme.dark.accessibility
```

That means your component logic stays simple.

A button can use the same token names in both modes:

```tsx
<button
  style={{
    backgroundColor: theme.light.colors.primary,
    color: theme.light.colors.onPrimary,
    borderRadius: theme.light.radius.md,
    padding: `${theme.light.spacing.sm}px ${theme.light.spacing.lg}px`,
  }}
>
  Save changes
</button>
```

Switch to `theme.dark`, and the same component reads dark-mode values.

## Why OKLCH instead of hex or HSL

Most developers are used to HEX:

```css
#2563eb
```

or HSL:

```css
hsl(221, 83%, 53%)
```

They are convenient, but they are not ideal for generating a full theme.

The problem is perceptual consistency.

In HSL, two colors can have the same lightness value but look very different to the human eye. Yellow usually looks much brighter than blue at the same HSL lightness.

That makes dark mode, hover states, and accessible contrast harder to generate reliably.

`salt-theme-gen` uses OKLCH internally.

OKLCH separates color into:

* **L** — lightness
* **C** — chroma, or color intensity
* **H** — hue

This makes color transformations more predictable.

When the library adjusts lightness for dark mode, hover states, or accessibility correction, the change looks more natural because OKLCH is designed around human perception.

You do not have to write OKLCH yourself.

You can start with a preset:

```ts
generateTheme({ preset: 'ocean' });
```

Or pass your own brand color:

```ts
generateTheme({ primary: '#6366f1' });
```

The library handles the color math.

## Semantic colors, not random palette values

The generated color tokens are semantic.

Instead of thinking in color names like `blue500` or `gray900`, you work with UI meaning:

```ts
theme.light.colors.primary
theme.light.colors.background
theme.light.colors.surface
theme.light.colors.text
theme.light.colors.muted
theme.light.colors.border
theme.light.colors.danger
theme.light.colors.success
theme.light.colors.warning
theme.light.colors.info
```

You also get foreground colors for colored backgrounds:

```ts
theme.light.colors.onPrimary
theme.light.colors.onDanger
theme.light.colors.onSuccess
theme.light.colors.onWarning
theme.light.colors.onInfo
```

These `on*` colors are important.

They answer a common question:

> If this is my button background, what text color should go on top?

Example:

```tsx
<button
  style={{
    backgroundColor: theme.light.colors.primary,
    color: theme.light.colors.onPrimary,
  }}
>
  Continue
</button>
```

You do not have to guess whether the text should be white, black, or another shade. The theme already provides the correct foreground token.

## Interaction states are generated too

A design system is not complete if it only has base colors.

Interactive UI needs states:

```ts
theme.light.states.primary.hover
theme.light.states.primary.pressed
theme.light.states.primary.focused
theme.light.states.primary.disabled
```

`salt-theme-gen` generates four states for each of the 8 intents:

```text
primary
secondary
tertiary
quaternary
danger
success
warning
info
```

That gives you:

```text
8 intents × 4 states = 32 state colors
```

No more random `opacity: 0.8`.

No more manually picking hover colors.

No more one developer making disabled buttons too faint and another making them too strong.

The state colors are derived consistently from the same theme system.

## Surface elevation

Flat UIs still need depth.

`salt-theme-gen` gives you four surface elevation tokens:

```ts
theme.light.surfaceElevation.card
theme.light.surfaceElevation.elevated
theme.light.surfaceElevation.modal
theme.light.surfaceElevation.popover
```

Use them for:

* cards
* side panels
* modals
* dropdowns
* tooltips
* popovers

The values are subtle color shifts from the base surface color, so your UI can have depth without manually inventing new background shades.

## Design scales

Color controls identity.

Spacing, radius, and font size control product feel.

`salt-theme-gen` includes three independent scale systems:

```ts
generateTheme({
  preset:   'ocean',
  spacing:  'compact',   // 'compact' | 'default' | 'relaxed' | 'spacious'
  radius:   'rounded',   // 'sharp' | 'default' | 'rounded' | 'pill'
  fontSize: 'large',     // 'small' | 'default' | 'large' | 'editorial'
});
```

A dense developer tool might use:

```ts
generateTheme({
  preset: 'midnight',
  spacing: 'compact',
  radius: 'sharp',
  fontSize: 'small',
});
```

A marketing site might use:

```ts
generateTheme({
  preset: 'sunset',
  spacing: 'spacious',
  radius: 'rounded',
  fontSize: 'default',
});
```

A modern consumer app might use:

```ts
generateTheme({
  preset: 'aurora',
  spacing: 'spacious',
  radius: 'pill',
  fontSize: 'large',
});
```

The component CSS does not need to change. Regenerate the tokens, and the feel of the product changes consistently.

## Built-in accessibility report

Every generated theme includes an accessibility report:

```ts
theme.light.accessibility.primaryOnBackground
// { ratio: 4.51, level: 'AA' }

theme.light.accessibility.textOnBackground
// { ratio: 18.4, level: 'AAA' }
```

The report contains 18 WCAG contrast checks for important color pairings:

* text on background
* text on surface
* brand colors on background
* semantic colors on background
* text on primary, secondary, tertiary, and quaternary backgrounds
* text on danger, success, warning, and info backgrounds

The goal is simple:

> catch color contrast problems at token generation time, not after the UI is already built.

The accessibility article in this series goes deeper into all 18 checks and how to use the report in CI.

## Three steps to use it anywhere

### Step 1 — Generate the theme

```ts
import { generateTheme } from 'salt-theme-gen';

const theme = generateTheme({ preset: 'ocean' });
```

### Step 2 — Convert the theme to CSS custom properties

```ts
function modeToVars(mode) {
  const lines = [];
  const kebab = s => s.replace(/([A-Z])/g, '-$1').toLowerCase();

  for (const [key, value] of Object.entries(mode.colors)) {
    lines.push(`  --color-${kebab(key)}: ${value};`);
  }

  for (const [key, value] of Object.entries(mode.spacing)) {
    lines.push(`  --space-${key}: ${value}px;`);
  }

  for (const [key, value] of Object.entries(mode.radius)) {
    lines.push(`  --radius-${key}: ${value}px;`);
  }

  for (const [key, value] of Object.entries(mode.fontSizes)) {
    lines.push(`  --text-${key}: ${value}px;`);
  }

  return lines.join('\n');
}

const css = `
:root {
${modeToVars(theme.light)}
}

:root[data-theme="dark"] {
${modeToVars(theme.dark)}
}
`;
```

### Step 3 — Use the variables in CSS

```css
.btn-primary {
  background: var(--color-primary);
  color: var(--color-on-primary);
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-md);
}

.card {
  background: var(--surface-elevation-card);
  color: var(--color-text);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
}
```

The same idea works in React, Next.js, Vue, Svelte, Angular, Astro, Remix, plain HTML, or any system that can consume CSS variables.

## 20 built-in presets

You do not have to start from a blank color picker.

`salt-theme-gen` includes 20 presets:

```text
ocean
arctic
sapphire
storm
peacock
mint
emerald
forest
lavender
twilight
aurora
rose-gold
cherry-blossom
coral-reef
sunset
honey
desert
autumn
volcano
midnight
```

A few examples:

| Preset     | Character                         |
| ---------- | --------------------------------- |
| `ocean`    | Calm, professional, SaaS-friendly |
| `midnight` | Dark-first, developer-focused     |
| `forest`   | Natural, grounded, reliable       |
| `sunset`   | Warm, energetic, startup-like     |
| `emerald`  | Fresh, confident, growth-oriented |
| `lavender` | Soft, creative, calm              |
| `volcano`  | Bold, intense, high-energy        |

Or skip presets and use your own primary color:

```ts
generateTheme({ primary: '#6366f1' });
```

Both approaches return the same theme structure.

## What this series covers

This article is the start of a 24-part series on using `salt-theme-gen` across frameworks and workflows.

The series covers:

* dark mode
* WCAG accessibility
* color presets
* design scales
* React
* Next.js
* Vue
* SvelteKit
* Angular
* Astro
* Remix
* Tailwind CSS
* React Native
* Expo
* Flutter
* Storybook
* CSS-in-JS
* Sass
* TypeScript
* AI coding tools like Claude Code, Cursor, and v0.dev

Install and follow along:

```bash
npm install salt-theme-gen
```

Full documentation:

https://learn.esalt.net/salt-theme-gen/



---

*Part of the **salt-theme-gen — Design Tokens for Every Framework** series · Article 1 of 24*



