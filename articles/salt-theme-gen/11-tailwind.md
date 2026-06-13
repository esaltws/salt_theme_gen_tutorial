---
title: salt-theme-gen with Tailwind CSS — Extend Config, No More Arbitrary Values
published: false
description: Map salt-theme-gen tokens to Tailwind's color/spacing/radius config. Replace bg-[#2563eb] with bg-primary. Dark mode via data-theme attribute.
tags: tailwind, css, webdev, javascript
series: salt-theme-gen — Design Tokens for Every Framework
cover_image:
---

Tailwind and `salt-theme-gen` complement each other well. Tailwind handles utility classes and layout; `salt-theme-gen` provides the semantic token values. The integration is a `tailwind.config.ts` update that maps CSS variables to Tailwind tokens — no arbitrary values, no hardcoded hex.

## The problem this solves

Without tokens, Tailwind projects accumulate arbitrary values:

```html
<!-- Before: arbitrary values scattered everywhere -->
<button class="bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-[8px] px-[24px] py-[8px]">
```

With `salt-theme-gen` tokens mapped to Tailwind config:

```html
<!-- After: semantic classes -->
<button class="bg-primary hover:bg-primary-hover text-on-primary rounded px-lg py-sm">
```

## Setup

First, inject the CSS variables (see the [generic dark mode article](https://dev.to/) for the injection pattern). Then update `tailwind.config.ts`:

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,ts,jsx,tsx,vue,svelte,astro}'],

  darkMode: ['attribute', '[data-theme="dark"]'],

  theme: {
    extend: {
      colors: {
        primary:    'var(--color-primary)',
        secondary:  'var(--color-secondary)',
        background: 'var(--color-background)',
        surface:    'var(--color-surface)',
        text:       'var(--color-text)',
        muted:      'var(--color-muted)',
        border:     'var(--color-border)',
        danger:     'var(--color-danger)',
        success:    'var(--color-success)',
        warning:    'var(--color-warning)',
        info:       'var(--color-info)',
        // On-colors (text that sits on intent backgrounds)
        'on-primary': 'var(--color-on-primary)',
        'on-danger':  'var(--color-on-danger)',
        'on-success': 'var(--color-on-success)',
      },
      spacing: {
        xs:  'var(--space-xs)',
        sm:  'var(--space-sm)',
        md:  'var(--space-md)',
        lg:  'var(--space-lg)',
        xl:  'var(--space-xl)',
        xxl: 'var(--space-xxl)',
      },
      borderRadius: {
        sm:   'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        pill: 'var(--radius-pill)',
      },
      fontSize: {
        xs:  ['var(--text-xs)',  { lineHeight: '1.4' }],
        sm:  ['var(--text-sm)',  { lineHeight: '1.5' }],
        md:  ['var(--text-md)',  { lineHeight: '1.6' }],
        lg:  ['var(--text-lg)',  { lineHeight: '1.5' }],
        xl:  ['var(--text-xl)',  { lineHeight: '1.4' }],
        xxl: ['var(--text-xxl)', { lineHeight: '1.3' }],
        '3xl': ['var(--text-3xl)', { lineHeight: '1.2' }],
      },
    },
  },
} satisfies Config;
```

## Classes available after config

```html
<!-- Colors -->
<div class="bg-background text-text border border-border">
<div class="bg-surface text-muted">
<button class="bg-primary text-on-primary">
<button class="bg-danger text-on-danger">

<!-- Spacing (p-md, gap-lg, etc.) -->
<div class="p-xl gap-md">
<button class="px-lg py-sm">

<!-- Border radius -->
<div class="rounded">          <!-- radius-md -->
<div class="rounded-lg">       <!-- radius-lg -->
<button class="rounded-pill">  <!-- radius-pill -->

<!-- Font size -->
<p class="text-md">
<h1 class="text-3xl font-bold">
```

## Dark mode — no dark: variants needed

`darkMode: ['attribute', '[data-theme="dark"]']` tells Tailwind to apply `dark:` variants when `data-theme="dark"` is on any ancestor. But because CSS variables switch automatically, you rarely need the `dark:` prefix:

```html
<!-- This works in both modes automatically — no dark: needed -->
<div class="bg-surface text-text border-border">
```

Only use `dark:` when you want a value that doesn't exist in the token system:

```html
<img class="opacity-100 dark:opacity-80" src="logo.svg" />
```

## Token-to-class reference

| Token | Tailwind class |
| --- | --- |
| `--color-primary` | `bg-primary`, `text-primary`, `border-primary` |
| `--color-background` | `bg-background` |
| `--color-surface` | `bg-surface` |
| `--color-text` | `text-text` |
| `--color-muted` | `text-muted` |
| `--color-border` | `border-border` |
| `--color-danger` | `bg-danger`, `text-danger` |
| `--space-md` | `p-md`, `m-md`, `gap-md`, `px-md`, `py-md` |
| `--radius-md` | `rounded` |
| `--radius-lg` | `rounded-lg` |
| `--text-md` | `text-md` |

## Programmatic config generation

If you want the config to stay in sync with the actual token names automatically:

```ts
import { generateTheme } from 'salt-theme-gen';

const theme = generateTheme({ preset: 'ocean' });
const kebab = (s: string) => s.replace(/([A-Z])/g, '-$1').toLowerCase();

const colors = Object.fromEntries(
  Object.keys(theme.light.colors).map(k => [kebab(k), `var(--color-${kebab(k)})`])
);

// Use in tailwind.config: theme.extend.colors = colors
```

This ensures the Tailwind color config always matches the actual token set regardless of `salt-theme-gen` version updates.

Full guide: [learn.esalt.net/salt-theme-gen/integrations/tailwind-css/](https://learn.esalt.net/salt-theme-gen/integrations/tailwind-css/)
