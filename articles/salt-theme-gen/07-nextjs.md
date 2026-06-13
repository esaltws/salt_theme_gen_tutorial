---
title: salt-theme-gen with Next.js — App Router, No FOUC, Server-Side Tokens
published: false
description: Inject design tokens server-side in Next.js App Router. No flash of wrong theme, typed token access in Client Components, and Tailwind integration.
tags: nextjs, react, css, webdev
series: salt-theme-gen — Design Tokens for Every Framework
cover_image:
---

Next.js App Router adds a wrinkle that pure React doesn't have: the root layout renders on the server, but `localStorage` is client-only. Get the order wrong and you get a flash of wrong theme on every page load.

This article covers the App Router pattern that avoids the flash, wires up typed token access in Client Components, and optionally maps tokens to Tailwind classes.

## Install

```bash
npm install salt-theme-gen
```

## Theme setup

```ts
// src/lib/theme.ts
import { generateTheme } from 'salt-theme-gen';
import type { GeneratedThemeMode } from 'salt-theme-gen';

export const theme = generateTheme({ preset: 'ocean' });

const kebab = (s: string) => s.replace(/([A-Z])/g, '-$1').toLowerCase();

function modeVars(mode: GeneratedThemeMode): string {
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
${modeVars(theme.light)}
}
:root[data-theme="dark"] {
${modeVars(theme.dark)}
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${modeVars(theme.dark).split('\n').map(l => '  ' + l).join('\n')}
  }
}
`;
```

## Root layout — the key piece

```tsx
// app/layout.tsx
import { themeCSS } from '@/lib/theme';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme CSS injected server-side — no hydration needed */}
        <style dangerouslySetInnerHTML={{ __html: themeCSS }} />

        {/* Synchronous script — runs before browser paints, reads localStorage */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

Two things make this work without FOUC:
1. The `<style>` tag is server-rendered — CSS is available immediately
2. The inline `<script>` runs synchronously before the browser paints, setting `data-theme` from localStorage

`suppressHydrationWarning` on `<html>` prevents React from warning about the `data-theme` attribute mismatch between server (no attribute) and client (restored from localStorage).

## ThemeProvider — Client Component

```tsx
// src/components/ThemeProvider.tsx
'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ThemeCtx {
  isDark: boolean;
  toggle: () => void;
}

const Ctx = createContext<ThemeCtx>({ isDark: false, toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const s = localStorage.getItem('theme');
    return s === 'dark' || (!s && matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const toggle = useCallback(() => {
    setIsDark(d => {
      const next = !d;
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  return <Ctx.Provider value={{ isDark, toggle }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
```

Add to root layout:

```tsx
// app/layout.tsx
import { ThemeProvider } from '@/components/ThemeProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>...</head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

## Using tokens in Server Components

Server Components can access the typed theme object directly (no CSS variables needed for server-rendered data):

```tsx
// app/page.tsx — Server Component
import { theme } from '@/lib/theme';

export default function Page() {
  // Use token values directly for server-rendered content
  const { colors, spacing } = theme.light;
  return <div>...</div>;
}
```

Client Components use CSS variables as normal:

```tsx
'use client';
export function Button({ children }) {
  return (
    <button style={{
      background:   'var(--color-primary)',
      color:        'var(--color-on-primary)',
      borderRadius: 'var(--radius-md)',
      padding:      'var(--space-sm) var(--space-lg)',
    }}>
      {children}
    </button>
  );
}
```

## Tailwind integration (optional)

```ts
// tailwind.config.ts
export default {
  darkMode: ['attribute', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary:    'var(--color-primary)',
        background: 'var(--color-background)',
        surface:    'var(--color-surface)',
        text:       'var(--color-text)',
        muted:      'var(--color-muted)',
        border:     'var(--color-border)',
        danger:     'var(--color-danger)',
        success:    'var(--color-success)',
      },
    },
  },
};
```

With this config, `bg-primary`, `text-muted`, `border-border` all resolve to the salt-theme-gen tokens. The `dark:` Tailwind variants work too — but since tokens switch automatically via CSS variables, you rarely need them.

Full guide: [learn.esalt.net/salt-theme-gen/integrations/next-js/](https://learn.esalt.net/salt-theme-gen/integrations/next-js/)
