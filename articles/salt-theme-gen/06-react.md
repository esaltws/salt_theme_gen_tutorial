---
title: salt-theme-gen with React — ThemeContext, CSS Injection, Dark Mode
published: false
description: Wire up salt-theme-gen in a React app in 15 minutes. ThemeContext, CSS variable injection, localStorage persistence, and a toggle component.
tags: react, css, javascript, webdev
series: salt-theme-gen — Design Tokens for Every Framework
cover_image:
---

This article covers the complete React integration: generating the theme, injecting CSS variables before the app renders, building a `ThemeContext` for typed access, and wiring up a dark mode toggle that persists to `localStorage`.

## Install

```bash
npm install salt-theme-gen
```

## Step 1 — Generate the theme

```ts
// src/theme/index.ts
import { generateTheme } from 'salt-theme-gen';

export const theme = generateTheme({
  preset:   'ocean',
  spacing:  'default',
  radius:   'default',
  fontSize: 'default',
});
```

## Step 2 — Inject CSS variables

In `src/main.tsx`, inject the theme into `<head>` before React mounts:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { theme } from './theme';
import App from './App';

function kebab(str: string) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

function buildThemeCSS() {
  const vars = (mode: typeof theme.light, selector: string) => {
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
    return `${selector} {\n${lines.join('\n')}\n}`;
  };

  return [
    vars(theme.light, ':root'),
    vars(theme.dark,  ':root[data-theme="dark"]'),
  ].join('\n\n');
}

// Inject before React mounts
const styleEl = document.createElement('style');
styleEl.id = 'salt-theme';
styleEl.textContent = buildThemeCSS();
document.head.appendChild(styleEl);

// Restore saved preference (sync, no flash)
const saved = localStorage.getItem('theme');
if (saved) document.documentElement.setAttribute('data-theme', saved);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>
);
```

## Step 3 — ThemeContext

```tsx
// src/theme/ThemeContext.tsx
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ThemeContextValue {
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('theme');
    return saved === 'dark' ||
      (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const toggle = useCallback(() => {
    setIsDark(d => {
      const next = !d;
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

Wrap `<App />` in `main.tsx`:

```tsx
<ThemeProvider>
  <App />
</ThemeProvider>
```

## Step 4 — Toggle component

```tsx
// src/components/ThemeToggle.tsx
import { useTheme } from '../theme/ThemeContext';

export function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        background:    'var(--color-surface)',
        border:        '1px solid var(--color-border)',
        borderRadius:  'var(--radius-md)',
        padding:       'var(--space-xs) var(--space-sm)',
        cursor:        'pointer',
        color:         'var(--color-text)',
        fontSize:      'var(--text-sm)',
      }}
    >
      {isDark ? '☀ Light' : '◐ Dark'}
    </button>
  );
}
```

## Using tokens in components

```tsx
// src/components/Card.tsx
export function Card({ title, body }: { title: string; body: string }) {
  return (
    <div style={{
      background:    'var(--surface-card)',
      border:        '1px solid var(--color-border)',
      borderRadius:  'var(--radius-lg)',
      padding:       'var(--space-xl)',
    }}>
      <h3 style={{
        fontSize:     'var(--text-lg)',
        fontWeight:   700,
        color:        'var(--color-text)',
        marginBottom: 'var(--space-sm)',
      }}>
        {title}
      </h3>
      <p style={{
        fontSize:  'var(--text-md)',
        color:     'var(--color-muted)',
        lineHeight: 1.7,
        margin: 0,
      }}>
        {body}
      </p>
    </div>
  );
}
```

Or use CSS Modules — the variables work there too:

```css
/* Card.module.css */
.card {
  background:    var(--surface-card);
  border:        1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding:       var(--space-xl);
}
```

## FOUC prevention for Vite projects

In `index.html`, add a synchronous script before any styles:

```html
<head>
  <script>
    var t = localStorage.getItem('theme');
    if (t) document.documentElement.setAttribute('data-theme', t);
  </script>
  <!-- rest of head -->
</head>
```

This runs before CSS loads and prevents the flash of wrong theme on hard refresh.

Full guide: [learn.esalt.net/salt-theme-gen/integrations/react/](https://learn.esalt.net/salt-theme-gen/integrations/react/)

---

*Part of the **salt-theme-gen — Design Tokens for Every Framework** series · Article 6 of 24*

[← 05. Design Scale Presets](./05-design-scales.md) &nbsp;·&nbsp; [07. With Next.js →](./07-nextjs.md)
