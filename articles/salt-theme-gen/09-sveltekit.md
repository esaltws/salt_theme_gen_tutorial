---
title: salt-theme-gen with SvelteKit — Writable Store, svelte:head, Static CSS
published: false
description: Two approaches for SvelteKit: static CSS file generation at build time, or dynamic injection via a layout load. Writable store for reactive dark mode.
tags: svelte, sveltekit, css, webdev
series: salt-theme-gen — Design Tokens for Every Framework
cover_image:
---

SvelteKit offers two clean approaches for `salt-theme-gen`: generate a static CSS file at build time (simplest), or inject tokens dynamically via a layout server load (most flexible for multi-tenant). Both use the same writable store for dark mode reactivity.

## Install

```bash
npm install salt-theme-gen
```

## Approach 1 — Static CSS file (recommended)

Generate the CSS once at build time and serve it as a static file.

**Generation script** (`scripts/generate-theme-css.ts`):

```ts
import { generateTheme } from 'salt-theme-gen';
import { writeFileSync } from 'node:fs';

const theme = generateTheme({ preset: 'ocean' });

const kebab = (s: string) => s.replace(/([A-Z])/g, '-$1').toLowerCase();

function modeVars(mode: typeof theme.light) {
  const lines: string[] = [];
  for (const [k, v] of Object.entries(mode.colors))
    lines.push(`  --color-${kebab(k)}: ${v};`);
  for (const [k, v] of Object.entries(mode.spacing))
    lines.push(`  --space-${k}: ${v}px;`);
  for (const [k, v] of Object.entries(mode.radius))
    lines.push(`  --radius-${k}: ${v}px;`);
  for (const [k, v] of Object.entries(mode.fontSizes))
    lines.push(`  --text-${k}: ${v}px;`);
  for (const [k, v] of Object.entries(mode.surfaceElevation))
    lines.push(`  --surface-${k}: ${v};`);
  for (const [intent, states] of Object.entries(mode.states))
    for (const [state, val] of Object.entries(states as Record<string, string>))
      lines.push(`  --state-${intent}-${state}: ${val};`);
  return lines.join('\n');
}

const css = `:root {\n${modeVars(theme.light)}\n}\n\n:root[data-theme="dark"] {\n${modeVars(theme.dark)}\n}`;

writeFileSync('static/theme.css', css, 'utf8');
console.log('✓ static/theme.css written');
```

```json
// package.json
{
  "scripts": {
    "build:theme": "tsx scripts/generate-theme-css.ts",
    "build": "npm run build:theme && vite build",
    "dev": "npm run build:theme && vite dev"
  }
}
```

**Link in `src/app.html`:**

```html
<!doctype html>
<html lang="en" %sveltekit.attributes%>
  <head>
    %sveltekit.head%
    <link rel="stylesheet" href="/theme.css" />

    <!-- FOUC prevention -->
    <script>
      var t = localStorage.getItem('theme');
      if (t) document.documentElement.setAttribute('data-theme', t);
    </script>
  </head>
  <body>%sveltekit.body%</body>
</html>
```

## Approach 2 — Dynamic injection via layout load

When the theme CSS changes per-request (multi-tenant, user preferences stored server-side):

```ts
// src/routes/+layout.server.ts
import { generateTheme } from 'salt-theme-gen';

export function load() {
  const theme = generateTheme({ preset: 'ocean' });
  // buildThemeCSS returns the CSS string
  return { themeCSS: buildThemeCSS(theme) };
}
```

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  export let data;
</script>

<svelte:head>
  {@html `<style>${data.themeCSS}</style>`}
</svelte:head>

<slot />
```

## Theme store

```ts
// src/lib/stores/theme.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createThemeStore() {
  const { subscribe, set } = writable<'light' | 'dark'>('light');

  return {
    subscribe,
    init() {
      if (!browser) return;
      const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial = saved ?? (prefersDark ? 'dark' : 'light');
      set(initial);
      document.documentElement.setAttribute('data-theme', initial);
    },
    toggle() {
      let next: 'light' | 'dark';
      subscribe(v => { next = v === 'dark' ? 'light' : 'dark'; })();
      set(next!);
      if (browser) {
        document.documentElement.setAttribute('data-theme', next!);
        localStorage.setItem('theme', next!);
      }
    },
  };
}

export const theme = createThemeStore();
```

Initialize in root layout:

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { theme } from '$lib/stores/theme';

  onMount(() => theme.init());
</script>
```

## Toggle component

```svelte
<!-- src/lib/components/ThemeToggle.svelte -->
<script lang="ts">
  import { theme } from '$lib/stores/theme';
</script>

<button on:click={theme.toggle} class="toggle">
  {$theme === 'dark' ? '☀ Light' : '◐ Dark'}
</button>

<style>
.toggle {
  background:    var(--color-surface);
  border:        1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding:       var(--space-xs) var(--space-sm);
  color:         var(--color-text);
  cursor:        pointer;
  font-size:     var(--text-sm);
}
</style>
```

## Using tokens in components

```svelte
<!-- src/lib/components/Card.svelte -->
<script lang="ts">
  export let title: string;
  export let body:  string;
</script>

<div class="card">
  <h3 class="title">{title}</h3>
  <p class="body">{body}</p>
</div>

<style>
.card {
  background:    var(--surface-card);
  border:        1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding:       var(--space-xl);
}
.title {
  font-size:     var(--text-lg);
  font-weight:   700;
  color:         var(--color-text);
  margin-bottom: var(--space-sm);
}
.body {
  font-size:  var(--text-md);
  color:      var(--color-muted);
  line-height: 1.7;
  margin: 0;
}
</style>
```

Svelte's scoped styles work with CSS variables — `var()` resolves globally even inside scoped `<style>` blocks.

Full guide: [learn.esalt.net/salt-theme-gen/integrations/sveltekit/](https://learn.esalt.net/salt-theme-gen/integrations/sveltekit/)

---

*Part of the **salt-theme-gen — Design Tokens for Every Framework** series · Article 9 of 24*

[← 08. With Vue 3](./08-vue.md) &nbsp;·&nbsp; [10. With Angular →](./10-angular.md)
