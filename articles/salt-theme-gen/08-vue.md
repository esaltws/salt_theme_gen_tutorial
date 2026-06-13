---
title: salt-theme-gen with Vue 3 — Composable, Provide/Inject, Dark Mode
published: false
description: Wire up design tokens in Vue 3 with a module-level reactive ref, provide/inject for deep access, and CSS variable injection in main.ts.
tags: vue, css, javascript, webdev
series: salt-theme-gen — Design Tokens for Every Framework
cover_image:
---

Vue 3's Composition API maps cleanly to the `salt-theme-gen` pattern. A module-level `ref` gives you shared reactive state across all components without a Pinia store; `provide`/`inject` gives typed access deep in the component tree.

## Install

```bash
npm install salt-theme-gen
```

## Theme setup

```ts
// src/theme/index.ts
import { generateTheme } from 'salt-theme-gen';

export const theme = generateTheme({ preset: 'ocean' });
```

## CSS injection in main.ts

```ts
// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { theme } from './theme';

const kebab = (s: string) => s.replace(/([A-Z])/g, '-$1').toLowerCase();

function buildCSS() {
  const vars = (mode: typeof theme.light) => {
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
    return lines.join('\n');
  };
  return `:root {\n${vars(theme.light)}\n}\n:root[data-theme="dark"] {\n${vars(theme.dark)}\n}`;
}

// Inject theme CSS
const style = document.createElement('style');
style.id = 'salt-theme';
style.textContent = buildCSS();
document.head.appendChild(style);

// Restore preference
const saved = localStorage.getItem('theme');
if (saved) document.documentElement.setAttribute('data-theme', saved);

const app = createApp(App);
app.mount('#app');
```

## Theme composable

The key pattern: `isDark` is module-level so it's shared across all `useThemeMode()` calls — no store needed.

```ts
// src/composables/useThemeMode.ts
import { ref } from 'vue';

const isDark = ref(
  localStorage.getItem('theme') === 'dark' ||
  (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
);

export function useThemeMode() {
  function toggle() {
    isDark.value = !isDark.value;
    const val = isDark.value ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', val);
    localStorage.setItem('theme', val);
  }

  return { isDark, toggle };
}
```

## Provide from App.vue

```vue
<!-- src/App.vue -->
<script setup lang="ts">
import { provide } from 'vue';
import { useThemeMode } from './composables/useThemeMode';

const { isDark, toggle } = useThemeMode();
provide('theme', { isDark, toggle });
</script>

<template>
  <RouterView />
</template>
```

## Inject in child components

```ts
// src/composables/useTheme.ts
import { inject } from 'vue';
import type { Ref } from 'vue';

interface ThemeInject {
  isDark: Ref<boolean>;
  toggle: () => void;
}

export function useTheme(): ThemeInject {
  const ctx = inject<ThemeInject>('theme');
  if (!ctx) throw new Error('useTheme must be used within App (ThemeProvider)');
  return ctx;
}
```

## Dark mode toggle component

```vue
<!-- src/components/ThemeToggle.vue -->
<script setup lang="ts">
import { useTheme } from '../composables/useTheme';
const { isDark, toggle } = useTheme();
</script>

<template>
  <button
    @click="toggle"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    class="theme-toggle"
  >
    {{ isDark ? '☀ Light' : '◐ Dark' }}
  </button>
</template>

<style scoped>
.theme-toggle {
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

```vue
<!-- src/components/Card.vue -->
<template>
  <div class="card">
    <h3 class="card-title">{{ title }}</h3>
    <p class="card-body">{{ body }}</p>
  </div>
</template>

<style scoped>
.card {
  background:    var(--surface-card);
  border:        1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding:       var(--space-xl);
}

.card-title {
  font-size:     var(--text-lg);
  font-weight:   700;
  color:         var(--color-text);
  margin-bottom: var(--space-sm);
}

.card-body {
  font-size:  var(--text-md);
  color:      var(--color-muted);
  line-height: 1.7;
  margin: 0;
}
</style>
```

Scoped styles work fine with CSS variables — `var()` references are resolved globally, not per-component.

## Pinia alternative

If you already use Pinia:

```ts
// src/stores/theme.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false);

  function toggle() {
    isDark.value = !isDark.value;
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light');
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
  }

  return { isDark, toggle };
});
```

The `provide`/`inject` pattern above avoids Pinia as a dependency for theme state alone. Use Pinia if you already have it; skip it if you don't.

Full guide: [learn.esalt.net/salt-theme-gen/integrations/vue/](https://learn.esalt.net/salt-theme-gen/integrations/vue/)

---

*Part of the **salt-theme-gen — Design Tokens for Every Framework** series · Article 8 of 24*

[← 07. With Next.js](./07-nextjs.md) &nbsp;·&nbsp; [09. With SvelteKit →](./09-sveltekit.md)
