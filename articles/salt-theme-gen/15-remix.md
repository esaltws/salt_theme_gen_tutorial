---
title: salt-theme-gen with Remix — Cookie-based Dark Mode, Zero FOUC
published: false
description: Remix runs on the server, so you can read theme preference from a cookie before the first byte. True server-side dark mode with no flash whatsoever.
tags: remix, react, css, webdev
series: salt-theme-gen — Design Tokens for Every Framework
cover_image:
---

Remix is the one framework where you can achieve true zero-FOUC dark mode without a synchronous inline script. Because Remix loaders run on the server before the response is sent, you can read the theme preference cookie and render the correct CSS in the initial HTML.

## Install

```bash
npm install salt-theme-gen
```

## Theme setup

```ts
// app/lib/theme.server.ts
import { generateTheme } from 'salt-theme-gen';
import type { GeneratedThemeMode } from 'salt-theme-gen';
import { createCookie } from '@remix-run/node';

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

export function getThemeCSS(isDark: boolean): string {
  const light = `:root {\n${modeVars(theme.light)}\n}`;
  const dark  = `:root[data-theme="dark"] {\n${modeVars(theme.dark)}\n}`;
  const base  = isDark ? `${dark}\n${light.replace(':root', ':root[data-theme="light"]')}` : `${light}\n${dark}`;
  return base;
}

export const themeCookie = createCookie('theme', {
  maxAge: 60 * 60 * 24 * 365, // 1 year
  httpOnly: false,             // needs to be readable by client JS for toggle
  sameSite: 'lax',
});
```

## Root loader

```ts
// app/root.tsx
import { json } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { themeCookie, getThemeCSS } from './lib/theme.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const pref = await themeCookie.parse(cookieHeader);
  const isDark = pref === 'dark';

  return json({
    isDark,
    themeCSS: getThemeCSS(isDark),
  });
}
```

## Root component

```tsx
// app/root.tsx (continued)
import { useLoaderData } from '@remix-run/react';

export default function App() {
  const { themeCSS, isDark } = useLoaderData<typeof loader>();

  return (
    <html lang="en" data-theme={isDark ? 'dark' : 'light'}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      </head>
      <body>
        <Outlet />
      </body>
    </html>
  );
}
```

Because `themeCSS` is rendered server-side and `data-theme` is set on `<html>` before the response reaches the browser, there is no flash at all — not even for 1ms.

## Theme toggle action

```tsx
// app/routes/api.theme.tsx
import { redirect } from '@remix-run/node';
import type { ActionFunctionArgs } from '@remix-run/node';
import { themeCookie } from '../lib/theme.server';

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const next = form.get('theme') as 'light' | 'dark';
  const referer = request.headers.get('Referer') ?? '/';

  return redirect(referer, {
    headers: {
      'Set-Cookie': await themeCookie.serialize(next),
    },
  });
}
```

## Toggle component (no JavaScript required)

The toggle works as a plain HTML form — no React state, no JavaScript:

```tsx
import { useFetcher } from '@remix-run/react';
import { useLoaderData } from '@remix-run/react';

export function ThemeToggle() {
  const { isDark } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post" action="/api/theme">
      <input type="hidden" name="theme" value={isDark ? 'light' : 'dark'} />
      <button type="submit" style={{
        background:    'var(--color-surface)',
        border:        '1px solid var(--color-border)',
        borderRadius:  'var(--radius-md)',
        padding:       'var(--space-xs) var(--space-sm)',
        color:         'var(--color-text)',
        cursor:        'pointer',
      }}>
        {isDark ? '☀ Light' : '◐ Dark'}
      </button>
    </fetcher.Form>
  );
}
```

`useFetcher` submits without a full page navigation. The server sets the cookie, returns a redirect, and the page re-renders with the new theme. No JavaScript needed for the theme mechanism itself.

## Using tokens in components

```tsx
// Exactly the same as any React component
export function Card({ title, body }: { title: string; body: string }) {
  return (
    <div style={{
      background:    'var(--surface-card)',
      border:        '1px solid var(--color-border)',
      borderRadius:  'var(--radius-lg)',
      padding:       'var(--space-xl)',
    }}>
      <h3 style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)' }}>{title}</h3>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--color-muted)' }}>{body}</p>
    </div>
  );
}
```

## Cookie vs localStorage — which wins?

| | Cookie (Remix) | localStorage (React/Next.js/Vue) |
| --- | --- | --- |
| FOUC possible? | No — server reads it | Yes — requires inline script workaround |
| Works without JS? | Yes | No |
| SSR-correct? | Yes | Requires `suppressHydrationWarning` |
| Complexity | Slightly more setup | Simple |

Use the cookie approach in Remix because you can. Use the localStorage + inline script approach in SPAs because cookies require a server.

Full guide: [learn.esalt.net/salt-theme-gen/integrations/remix/](https://learn.esalt.net/salt-theme-gen/integrations/remix/)

---

*Part of the **salt-theme-gen — Design Tokens for Every Framework** series · Article 15 of 24*

[← 14. With Astro](./14-astro.md) &nbsp;·&nbsp; [16. With CSS-in-JS →](./16-css-in-js.md)
