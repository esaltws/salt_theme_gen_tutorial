---
title: salt-theme-gen with CSS-in-JS — styled-components, Emotion, vanilla-extract
published: false
description: Replace your handwritten ThemeProvider theme object with GeneratedThemeMode. Typed tokens in every styled component, dark mode as a prop swap.
tags: css, react, javascript, webdev
series: salt-theme-gen — Design Tokens for Every Framework
cover_image:
---

CSS-in-JS libraries (styled-components, Emotion, vanilla-extract) accept a theme object through a `ThemeProvider`. `salt-theme-gen` outputs exactly that shape — a typed `GeneratedThemeMode` object with every token your components need.

The integration is: **replace your handwritten theme object with `theme.light` / `theme.dark`**.

## styled-components

### Type the theme

```ts
// src/theme/styled.d.ts
import type { GeneratedThemeMode } from 'salt-theme-gen';
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme extends GeneratedThemeMode {}
}
```

This one declaration makes every `useTheme()` call and every `${({ theme }) => ...}` interpolation fully typed.

### Provider

```tsx
// src/App.tsx
import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { generateTheme } from 'salt-theme-gen';

const theme = generateTheme({ preset: 'ocean' });

export function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <ThemeProvider theme={isDark ? theme.dark : theme.light}>
      <button onClick={() => setIsDark(d => !d)}>Toggle</button>
      {/* app */}
    </ThemeProvider>
  );
}
```

Dark mode is a prop swap — swap the theme object, every styled component re-renders with new values.

### Styled components

```tsx
import styled from 'styled-components';

export const Button = styled.button<{ $intent?: 'primary' | 'danger' | 'success' }>`
  background:    ${({ theme, $intent = 'primary' }) => theme.colors[$intent]};
  color:         ${({ theme, $intent = 'primary' }) =>
    theme.colors[`on${$intent[0].toUpperCase()}${$intent.slice(1)}` as keyof typeof theme.colors]
  };
  border:        none;
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding:       ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.lg}px;
  font-size:     ${({ theme }) => theme.fontSizes.md}px;
  font-weight:   600;
  cursor:        pointer;

  &:hover {
    background: ${({ theme, $intent = 'primary' }) =>
      theme.states[$intent as keyof typeof theme.states].hover
    };
  }
`;

export const Card = styled.div`
  background:    ${({ theme }) => theme.surfaceElevation.card};
  border:        1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding:       ${({ theme }) => theme.spacing.xl}px;
`;
```

---

## Emotion

Emotion's API is nearly identical. The main difference is the import paths and type augmentation.

### Type the theme

```ts
// src/theme/emotion.d.ts
import type { GeneratedThemeMode } from 'salt-theme-gen';
import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme extends GeneratedThemeMode {}
}
```

### Provider

```tsx
import { ThemeProvider } from '@emotion/react';
import { generateTheme } from 'salt-theme-gen';

const theme = generateTheme({ preset: 'ocean' });

export function Root({ isDark }: { isDark: boolean }) {
  return (
    <ThemeProvider theme={isDark ? theme.dark : theme.light}>
      {/* app */}
    </ThemeProvider>
  );
}
```

### css prop

```tsx
/** @jsxImportSource @emotion/react */
import { useTheme } from '@emotion/react';

function Card({ title, body }: { title: string; body: string }) {
  const t = useTheme();

  return (
    <div css={{
      background:   t.surfaceElevation.card,
      border:       `1px solid ${t.colors.border}`,
      borderRadius: t.radius.lg,
      padding:      t.spacing.xl,
    }}>
      <h3 css={{ fontSize: t.fontSizes.lg, color: t.colors.text }}>
        {title}
      </h3>
      <p css={{ fontSize: t.fontSizes.md, color: t.colors.muted }}>
        {body}
      </p>
    </div>
  );
}
```

---

## vanilla-extract

vanilla-extract generates CSS at build time — zero runtime overhead. Token values are baked into static CSS files during the build.

### Theme contract

```ts
// src/theme/contract.css.ts
import { createThemeContract } from '@vanilla-extract/css';

export const vars = createThemeContract({
  colors: {
    primary: null, secondary: null, background: null,
    surface: null, text: null, muted: null, border: null,
    danger: null, success: null, warning: null, info: null,
    onPrimary: null, onDanger: null, onSuccess: null,
  },
  spacing:   { xs: null, sm: null, md: null, lg: null, xl: null, xxl: null },
  radius:    { sm: null, md: null, lg: null, xl: null, pill: null },
  fontSizes: { xs: null, sm: null, md: null, lg: null, xl: null, xxl: null, '3xl': null },
});
```

### Implement for each mode

```ts
// src/theme/themes.css.ts
import { createTheme } from '@vanilla-extract/css';
import { generateTheme } from 'salt-theme-gen';
import { vars } from './contract.css';

const t = generateTheme({ preset: 'ocean' });
const px = (n: number) => `${n}px`;

export const lightTheme = createTheme(vars, {
  colors:    { ...t.light.colors },
  spacing:   Object.fromEntries(Object.entries(t.light.spacing).map(([k, v]) => [k, px(v)])) as any,
  radius:    Object.fromEntries(Object.entries(t.light.radius).map(([k, v]) => [k, px(v)])) as any,
  fontSizes: Object.fromEntries(Object.entries(t.light.fontSizes).map(([k, v]) => [k, px(v)])) as any,
});

export const darkTheme = createTheme(vars, {
  colors:    { ...t.dark.colors },
  spacing:   Object.fromEntries(Object.entries(t.dark.spacing).map(([k, v]) => [k, px(v)])) as any,
  radius:    Object.fromEntries(Object.entries(t.dark.radius).map(([k, v]) => [k, px(v)])) as any,
  fontSizes: Object.fromEntries(Object.entries(t.dark.fontSizes).map(([k, v]) => [k, px(v)])) as any,
});
```

### Use in component styles

```ts
// src/components/Button/Button.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '../../theme/contract.css';

export const button = style({
  background:   vars.colors.primary,
  color:        vars.colors.onPrimary,
  border:       'none',
  borderRadius: vars.radius.md,
  padding:      `${vars.spacing.sm} ${vars.spacing.lg}`,
  fontWeight:   600,
  cursor:       'pointer',
});
```

```tsx
// Button.tsx
import * as styles from './Button.css';

export function Button({ children }) {
  return <button className={styles.button}>{children}</button>;
}
```

## Comparison

| Library | Runtime | Dark mode | Type safety | Best for |
| --- | --- | --- | --- | --- |
| styled-components | Medium | Re-render | Excellent | React + dynamic styles |
| Emotion | Low-medium | Re-render | Excellent | React/Next.js |
| vanilla-extract | Zero | Class swap | Excellent | SSR, performance |

Full guide: [learn.esalt.net/salt-theme-gen/integrations/css-in-js/](https://learn.esalt.net/salt-theme-gen/integrations/css-in-js/)
