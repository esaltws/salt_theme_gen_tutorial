---
title: 20 Color Presets for Every Brand — Choosing the Right One
published: false
description: salt-theme-gen ships 20 built-in OKLCH color presets. Here's what each one looks like, who it's for, and how to go beyond presets with any hex color.
tags: css, design, webdev, ux
series: salt-theme-gen — Design Tokens for Every Framework
cover_image:
---

One of the friction points in design system setup is the first color decision. You need a primary, then you need its hover state, a lighter tint for backgrounds, a darker shade for dark mode, on-colors for button text, semantic danger/success/warning/info colors that feel consistent with your brand — and all of it needs to pass WCAG contrast.

`salt-theme-gen` handles all of that from a single preset name.

## The 20 presets

Each preset is an OKLCH hue. The package derives the full color system from it.

| Preset | Hue | Character | Best for |
| --- | --- | --- | --- |
| `ocean` | 235 | Deep blue, calm, focused | SaaS, productivity tools |
| `slate` | 215 | Blue-grey, minimal, neutral | Developer tools, admin |
| `cobalt` | 225 | Bright blue, energetic | B2B, enterprise |
| `indigo` | 255 | Classic indigo | Design tools, creative apps |
| `midnight` | 245 | Deep blue-violet, dramatic | Dark-first apps, games |
| `violet` | 270 | Purple, creative | AI products, creative tools |
| `plum` | 290 | Deep purple, rich | Premium, luxury |
| `rose` | 10 | Warm pink-red, approachable | Consumer apps, health |
| `coral` | 20 | Warm coral, friendly | Social, lifestyle |
| `crimson` | 0 | Vivid red, bold | Alerts, sports, media |
| `ruby` | 355 | Rich wine red | Premium consumer |
| `amber` | 45 | Warm orange-yellow | Fintech, energy |
| `gold` | 50 | Rich gold, prestigious | Premium, awards |
| `sunset` | 30 | Orange-amber, warm | Food, travel |
| `copper` | 25 | Metallic warm brown | Professional services |
| `emerald` | 155 | Fresh green | Health, finance, eco |
| `forest` | 140 | Deep earthy green | Sustainability, outdoors |
| `sage` | 150 | Muted sage, calm | Wellness, lifestyle |
| `teal` | 185 | Teal, balanced | Healthcare, tech |
| `arctic` | 200 | Ice blue, clean | Medical, minimal |

## Using a preset

```ts
import { generateTheme } from 'salt-theme-gen';

const theme = generateTheme({ preset: 'violet' });
```

That's all. `theme.light` and `theme.dark` contain a complete token set with violet as the primary brand color.

## Using your brand color

When the brand hex is already defined, pass it directly:

```ts
const theme = generateTheme({ preset: '#6366f1' }); // Indigo
const theme = generateTheme({ preset: '#0f766e' }); // Teal
const theme = generateTheme({ preset: '#b45309' }); // Amber
```

The package converts to OKLCH internally, uses it as the primary hue, and derives all 21 semantic colors from it. You don't pick secondary/tertiary/danger/success — those are derived automatically to feel cohesive with your primary.

## The four-color harmony rule

`salt-theme-gen` generates `primary`, `secondary`, `tertiary`, and `quaternary` using analogous color harmony — hues spaced 15° apart:

```
primary   = your hue       (e.g. 235)
secondary = hue + 15       (250)
tertiary  = hue + 30       (265)
quaternary = hue + 45      (280)
```

This gives you four distinct but harmonious accent colors without any color theory knowledge required.

`danger`, `success`, `warning`, and `info` are **fixed hues** — they don't move with your preset. Red, green, yellow, and blue carry universal meaning. Shifting them to match your brand would confuse users.

## Combining presets with scale presets

The personality of a UI comes from the combination of color + scales:

```ts
// Corporate, efficient
generateTheme({ preset: 'slate',   spacing: 'compact',  radius: 'sharp',   fontSize: 'compact' });

// Modern SaaS
generateTheme({ preset: 'ocean',   spacing: 'default',  radius: 'default', fontSize: 'default' });

// Consumer, friendly
generateTheme({ preset: 'coral',   spacing: 'spacious', radius: 'rounded', fontSize: 'default' });

// Developer tool
generateTheme({ preset: 'midnight', spacing: 'compact', radius: 'sharp',  fontSize: 'compact' });
```

Same preset, different scales = different feel.

## Switching presets at runtime

Because the output is CSS variables, you can switch themes at runtime by regenerating and re-injecting:

```ts
function applyPreset(preset: string) {
  const t = generateTheme({ preset });
  const css = buildThemeCSS(t);
  document.getElementById('salt-theme').textContent = css;
}

// Theme picker
document.querySelectorAll('[data-preset]').forEach(btn => {
  btn.addEventListener('click', () => applyPreset(btn.dataset.preset));
});
```

This works well for multi-tenant SaaS where each organization has a brand color.

## When to use a preset vs a custom hex

Use a **preset** when:
- You're in early development and haven't committed to a brand color
- The preset matches your target audience well

Use a **custom hex** when:
- The brand color is already defined
- You're migrating an existing design system

In both cases, the output is the same shape — you switch between them without changing any code that consumes the tokens.

Next: [Spacing, radius, and font scale presets — the personality of your UI](https://learn.esalt.net/salt-theme-gen/guide/05-design-scales/)

---

*Part of the **salt-theme-gen — Design Tokens for Every Framework** series · Article 4 of 24*

[← 03. WCAG Accessibility](./03-accessibility-built-in.md) &nbsp;·&nbsp; [05. Design Scale Presets →](./05-design-scales.md)
