---
title: Dark Mode in 5 Minutes with salt-theme-gen (No Flash, Zero Extra Dependencies)
published: true
description: Generate light and dark token sets from one call, inject as CSS variables, toggle with data-theme. Zero flash of wrong theme on load.
tags: css, darkmode, webdev, javascript
series: salt-theme-gen — Design Tokens for Every Framework
cover_image:
---

---

title: Dark Mode in 5 Minutes with salt-theme-gen
published: true
description: Generate light and dark design tokens from one generateTheme() call, expose them as CSS variables, and prevent theme flash with a tiny inline script.
tags: css, darkmode, webdev, javascript
series: salt-theme-gen — Design Tokens for Every Framework
cover_image:
------------

Dark mode often looks simple until you try to ship it properly.

You need:

* light mode tokens
* dark mode tokens
* a toggle button
* stored user preference
* system preference fallback
* no flash of the wrong theme on page load

The flash is the annoying part.

You store the user's preference in `localStorage`, but your app JavaScript usually runs after the browser has already started parsing HTML and CSS. For a moment, the page can render in the wrong theme.

This article shows a simple pattern:

1. Generate light and dark tokens with `salt-theme-gen`
2. Convert them to CSS custom properties
3. Toggle using `data-theme`
4. Prevent theme flash with a tiny synchronous script

No extra dependencies.

## Generate both themes in one call

```ts
import { generateTheme } from 'salt-theme-gen';

const theme = generateTheme({ preset: 'ocean' });
```

The generated theme includes both modes:

```ts
theme.light;
theme.dark;
```

Both modes have the same structure:

```ts
theme.light.colors;
theme.light.states;
theme.light.surfaceElevation;
theme.light.spacing;
theme.light.radius;
theme.light.fontSizes;
theme.light.accessibility;
```

And the same structure exists in dark mode:

```ts
theme.dark.colors;
theme.dark.states;
theme.dark.surfaceElevation;
theme.dark.spacing;
theme.dark.radius;
theme.dark.fontSizes;
theme.dark.accessibility;
```

That means your components can use the same token names in both modes.

Only the values change.

## Build the CSS variables

First, convert a generated theme mode into CSS custom properties.

```ts
import { generateTheme } from 'salt-theme-gen';

const theme = generateTheme({ preset: 'ocean' });

function kebab(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

function modeToVars(mode: typeof theme.light): string {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(mode.colors)) {
    lines.push(`  --color-${kebab(key)}: ${value};`);
  }

  for (const [key, value] of Object.entries(mode.surfaceElevation)) {
    lines.push(`  --surface-${key}: ${value};`);
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

  for (const [intent, states] of Object.entries(mode.states)) {
    for (const [state, value] of Object.entries(states)) {
      lines.push(`  --state-${intent}-${state}: ${value};`);
    }
  }

  return lines.join('\n');
}
```

Now generate the full CSS:

```ts
export const themeCSS = `
:root {
  color-scheme: light;
${modeToVars(theme.light)}
}

:root[data-theme="dark"] {
  color-scheme: dark;
${modeToVars(theme.dark)}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
${modeToVars(theme.dark)
  .split('\n')
  .map(line => `  ${line}`)
  .join('\n')}
  }
}
`;
```

This gives you three layers:

1. `:root` — light mode default
2. `:root[data-theme="dark"]` — explicit dark mode
3. `@media (prefers-color-scheme: dark)` — system dark mode fallback

The important part is this selector:

```css
:root:not([data-theme="light"])
```

It means:

> Use system dark mode only when the user has not explicitly chosen light mode.

## Inject the CSS into `<head>`

Put the generated CSS in the document `<head>` before your component styles.

Plain HTML:

```html
<style>
  /* paste generated themeCSS here */
</style>
```

React or Next.js:

```tsx
<style dangerouslySetInnerHTML={{ __html: themeCSS }} />
```

Astro:

```astro
<Fragment set:html={`<style>${themeCSS}</style>`} />
```

Once this is loaded, your app can use CSS variables everywhere.

## Prevent the flash of wrong theme

This is the critical part.

The script must run before the CSS is applied.

Put this in `<head>` before the theme `<style>`:

```html
<script>
  (function () {
    try {
      var stored = localStorage.getItem('theme');

      if (stored === 'light' || stored === 'dark') {
        document.documentElement.setAttribute('data-theme', stored);
      }
    } catch (_) {}
  })();
</script>
```

Do not add:

```html
defer
async
DOMContentLoaded
```

The script should run immediately.

Why?

The browser reads the document from top to bottom. If this script runs before the stylesheet, it can set `data-theme="dark"` on `<html>` before the first paint.

So when the CSS variables are applied, the correct theme is already active.

## Add a toggle function

```ts
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');

  const next = current === 'dark' ? 'light' : 'dark';

  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}
```

Attach it to a button:

```ts
document
  .getElementById('theme-toggle')
  ?.addEventListener('click', toggleTheme);
```

Example HTML:

```html
<button id="theme-toggle" type="button">
  Toggle theme
</button>
```

## Reset to system preference

Sometimes you want a third option:

* light
* dark
* system

To return to system preference, remove the attribute and clear storage:

```ts
function resetToSystemTheme() {
  document.documentElement.removeAttribute('data-theme');
  localStorage.removeItem('theme');
}
```

Now the media query controls the theme again:

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* dark variables */
  }
}
```

## Use tokens in CSS

Now your components can use theme variables without caring about the active mode.

```css
body {
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: var(--text-md);
}

.card {
  background: var(--surface-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-on-primary);
  border-radius: var(--radius-md);
  padding: var(--space-sm) var(--space-lg);
}

.btn-primary:hover {
  background: var(--state-primary-hover);
}

.btn-primary:active {
  background: var(--state-primary-pressed);
}

.btn-primary:disabled {
  background: var(--state-primary-disabled);
}
```

When `data-theme="dark"` is set on `<html>`, all variables update instantly.

No JavaScript re-rendering.

No class changes on every component.

No duplicate dark-mode CSS for each button, card, input, or modal.

## Why this works well with design tokens

The clean part is that the component CSS does not change between modes.

This button:

```css
.btn-primary {
  background: var(--color-primary);
  color: var(--color-on-primary);
}
```

works in light mode and dark mode.

The variable values change.

The component contract stays the same.

That is the main benefit of using generated design tokens instead of manually writing separate color rules for every component.

## Complete setup summary

```text
1. Install salt-theme-gen
2. Generate a theme with generateTheme()
3. Convert theme.light and theme.dark to CSS variables
4. Add a synchronous theme script in <head>
5. Inject the CSS variables after the script
6. Toggle data-theme on <html>
7. Use CSS variables in your components
```

Install:

```bash
npm install salt-theme-gen
```

Generate:

```ts
import { generateTheme } from 'salt-theme-gen';

const theme = generateTheme({ preset: 'ocean' });
```

Use:

```css
body {
  background: var(--color-background);
  color: var(--color-text);
}
```

## The bottom line

Dark mode should not require a second design system.

With `salt-theme-gen`, light and dark mode are generated together from the same source:

```ts
theme.light;
theme.dark;
```

The browser handles switching through CSS variables.

A tiny inline script prevents the wrong theme from flashing on load.

And your components keep reading the same semantic tokens in both modes.



Full documentation:

https://learn.esalt.net/salt-theme-gen/



---

*Part of the **salt-theme-gen — Design Tokens for Every Framework** series · Article 2 of 24*
