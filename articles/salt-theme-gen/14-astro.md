---
title: salt-theme-gen with Astro — Fragment set:html, Islands, Zero Runtime
published: false
description: Inject design tokens in Astro with Fragment set:html (not a regular style tag). Pass typed tokens to React/Vue islands as props. Zero JS overhead.
tags: astro, css, javascript, webdev
series: salt-theme-gen — Design Tokens for Every Framework
cover_image:
---

Astro is the ideal target for `salt-theme-gen`: generate tokens at build time, inject them server-side, ship zero JavaScript for the theme itself. The one non-obvious detail is how to inject the CSS — a regular `<style>` tag in Astro won't work.

## The critical detail — why you can't use a regular `<style>` tag

Astro scopes `<style>` tags to the component where they appear. If you put `:root { --color-primary: ... }` in a `<style>` tag, Astro transforms it to something like `[data-astro-cid-xxx] { --color-primary: ... }` — which only applies to elements inside that component.

Use `<Fragment set:html>` instead:

```astro
---
// src/layouts/BaseLayout.astro
import { themeCSS } from '../lib/theme';
---

<html lang="en">
  <head>
    <!-- Fragment bypasses Astro's style scoping -->
    <Fragment set:html={`<style>${themeCSS}</style>`} />

    <!-- Synchronous script — restore preference before paint -->
    <script is:inline>
      var t = localStorage.getItem('theme');
      if (t) document.documentElement.setAttribute('data-theme', t);
    </script>
  </head>
  <body>
    <slot />
  </body>
</html>
```

`<Fragment set:html>` tells Astro "inject this as raw HTML" — no scoping, no transformation.

## Theme generation

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

## Dark mode toggle

```astro
---
// src/components/Nav.astro
---

<button id="theme-toggle" aria-label="Toggle dark mode">◐</button>

<script>
  const btn = document.getElementById('theme-toggle');
  const html = document.documentElement;

  btn?.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
</script>
```

## Using tokens in Astro components

```astro
---
interface Props {
  title: string;
  body:  string;
}
const { title, body } = Astro.props;
---

<div class="card">
  <h3>{title}</h3>
  <p>{body}</p>
</div>

<style>
  .card {
    background:    var(--surface-card);
    border:        1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding:       var(--space-xl);
  }

  h3 {
    font-size:     var(--text-lg);
    font-weight:   700;
    color:         var(--color-text);
    margin-bottom: var(--space-sm);
  }

  p {
    font-size:  var(--text-md);
    color:      var(--color-muted);
    line-height: 1.7;
    margin: 0;
  }
</style>
```

Even though `<style>` tags in `.astro` components are scoped, `var()` references are still resolved globally. The scoping only affects the *selector* (e.g. `.card`), not the variable lookup inside.

## Passing typed tokens to React/Vue islands

When a React or Vue island needs typed access (not just CSS variables):

```astro
---
import { theme } from '../lib/theme';
import ReactChart from '../components/ReactChart';
---

<!-- Pass token values as props — no context needed -->
<ReactChart
  client:visible
  colors={theme.light.colors}
  spacing={theme.light.spacing}
/>
```

Inside the React component:

```tsx
interface Props {
  colors:  typeof theme.light.colors;
  spacing: typeof theme.light.spacing;
}

export function ReactChart({ colors, spacing }: Props) {
  // Typed access to exact token values
  return <div style={{ padding: spacing.xl, background: colors.surface }}>...</div>;
}
```

## Why Astro is the ideal target

| Advantage | Detail |
| --- | --- |
| Zero runtime | `generateTheme()` runs at build time — no JS shipped for the theme |
| SSR-correct | CSS is in the HTML on first byte — no FOUC possible |
| Island-compatible | Pass tokens as props to any framework's island |
| `is:inline` safety | Synchronous preference restore with no bundler transforms |

Full guide: [learn.esalt.net/salt-theme-gen/integrations/astro/](https://learn.esalt.net/salt-theme-gen/integrations/astro/)

---

*Part of the **salt-theme-gen — Design Tokens for Every Framework** series · Article 14 of 24*

[← 13. With Expo](./13-expo.md) &nbsp;·&nbsp; [15. With Remix →](./15-remix.md)
