---
title: Dark Mode in 5 Minutes with salt-theme-gen (No Flash, Zero Extra Dependencies)
published: false
description: Generate light and dark token sets from one call, inject as CSS variables, toggle with data-theme. Zero flash of wrong theme on load.
tags: css, darkmode, webdev, javascript
series: salt-theme-gen — Design Tokens for Every Framework
cover_image:
---

The flash of wrong theme on page load is one of the most annoying unsolved problems in web development. You store the user's preference in `localStorage`, but JavaScript runs after the HTML and CSS, so there's a brief moment where the page renders in the wrong theme.

This article shows the complete pattern: generate both themes, inject CSS variables, and prevent the flash with a synchronous inline script. The whole setup takes under 5 minutes.

## Generate both themes in one call

```ts
import { generateTheme } from 'salt-theme-gen';

const theme = generateTheme({ preset: 'ocean' });
// theme.light — all light mode tokens
// theme.dark  — all dark mode tokens
```

`theme.light` and `theme.dark` are both `GeneratedThemeMode` objects — same shape, different values. No separate calls, no configuration.

## Build the CSS

Convert both modes to CSS custom properties:

```ts
function kebab(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

function modeToVars(mode: GeneratedThemeMode): string {
  const lines: string[] = [];

  for (const [k, v] of Object.entries(mode.colors))
    lines.push(`  --color-${kebab(k)}: ${v};`);
  for (const [k, v] of Object.entries(mode.surfaceElevation))
    lines.push(`  --surface-${k}: ${v};`);
  for (const [k, v] of Object.entries(mode.spacing))
    lines.push(`  --space-${k}: ${v}px;`);
  for (const [k, v] of Object.entries(mode.radius))
    lines.push(`  --radius-${k}: ${v}px;`);
  for (const [k, v] of Object.entries(mode.fontSizes))
    lines.push(`  --text-${k}: ${v}px;`);
  for (const [intent, states] of Object.entries(mode.states))
    for (const [state, val] of Object.entries(states as Record<string, string>))
      lines.push(`  --state-${intent}-${state}: ${val};`);

  return lines.join('\n');
}

export const themeCSS = `
:root {
${modeToVars(theme.light)}
}

:root[data-theme="dark"] {
${modeToVars(theme.dark)}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${modeToVars(theme.dark).split('\n').map(l => '  ' + l).join('\n')}
  }
}
`;
```

The three blocks in order:
1. `:root {}` — light mode default, always applies
2. `:root[data-theme="dark"] {}` — explicit dark, overrides when user toggled
3. `@media (prefers-color-scheme: dark)` — OS dark preference as fallback when no stored choice

## Inject it into `<head>`

This goes in your HTML `<head>` before any component styles:

```html
<style>
  /* paste themeCSS content here */
</style>
```

Or dynamically (React/Next.js):

```tsx
<style dangerouslySetInnerHTML={{ __html: themeCSS }} />
```

Astro:

```astro
<Fragment set:html={`<style>${themeCSS}</style>`} />
```

## The flash-prevention script

This is the critical piece. It must run **synchronously** — no `defer`, no `async`, no `DOMContentLoaded`. Put it in `<head>` before the stylesheet:

```html
<script>
  (function () {
    var stored = localStorage.getItem('theme');
    if (stored) {
      document.documentElement.setAttribute('data-theme', stored);
    }
  })();
</script>
```

**Why it works:** The browser processes `<head>` top to bottom before rendering. This tiny script runs, reads the stored preference, sets `data-theme` on `<html>`, and then the CSS (which comes after) applies the correct `:root[data-theme="dark"]` rules. By the time the first pixel is painted, the right theme is already active.

## Toggle function

```ts
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}
```

Wire it to a button:

```ts
document.getElementById('theme-toggle')
  .addEventListener('click', toggleTheme);
```

## Use tokens in CSS

```css
body {
  background-color: var(--color-background);
  color:            var(--color-text);
  font-size:        var(--text-md);
}

.card {
  background:    var(--surface-card);
  border:        1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding:       var(--space-xl);
}

.btn-primary {
  background: var(--color-primary);
  color:      var(--color-on-primary);
}

.btn-primary:hover {
  background: var(--state-primary-hover);
}
```

When `data-theme="dark"` is set on `<html>`, all CSS variables update instantly — no JavaScript re-rendering, no class toggling on individual components.

## OS preference + stored preference

The three-rule CSS handles both cases:
- User has never toggled: `@media (prefers-color-scheme: dark)` matches their OS setting
- User toggled manually: `[data-theme="dark"]` or `[data-theme="light"]` overrides the media query
- User toggles back to match OS: clear `localStorage` and remove the attribute

```ts
function resetToSystem() {
  document.documentElement.removeAttribute('data-theme');
  localStorage.removeItem('theme');
}
```

## Complete setup summary

```
1. npm install salt-theme-gen
2. generateTheme({ preset: 'ocean' })
3. Convert to CSS with modeToVars()
4. Inject into <head>
5. Add synchronous <script> before the <style> for flash prevention
6. Wire toggleTheme() to a button
```

Total time: under 5 minutes. Total JavaScript for the dark mode toggle: 3 lines.

Previous article: [Introducing salt-theme-gen — Generate a Complete Design System from One Color](https://dev.to/hasansarwer/introducing-salt-theme-gen-generate-a-complete-design-system-from-one-color-2a9j)

Full documentation: [learn.esalt.net/salt-theme-gen](https://learn.esalt.net/salt-theme-gen/)

---

*Part of the **salt-theme-gen — Design Tokens for Every Framework** series · Article 2 of 24*

[← 01. Introducing salt-theme-gen](./01-introducing-salt-theme-gen.md) &nbsp;·&nbsp; [03. WCAG Accessibility →](./03-accessibility-built-in.md)
