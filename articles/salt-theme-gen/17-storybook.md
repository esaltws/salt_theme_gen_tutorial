---
title: salt-theme-gen with Storybook — Token-aware Stories, Dark Mode Toolbar
published: false
description: Inject tokens into Storybook's preview iframe and add a Light/Dark toolbar toggle with withThemeByDataAttribute. Stories see the same tokens as your app.
tags: storybook, css, react, webdev
series: salt-theme-gen — Design Tokens for Every Framework
cover_image:
---

The most common Storybook pain: components look correct in the app but wrong in stories — because Storybook doesn't know about your CSS variables or theme context. This article fixes that in 15 minutes.

## Install

```bash
npm install salt-theme-gen
npm install --save-dev @storybook/addon-themes
```

## Step 1 — Inject CSS variables into preview

In `.storybook/preview.ts`, inject your theme CSS before any story renders:

```ts
// .storybook/preview.ts
import type { Preview } from '@storybook/react';
import { generateTheme } from 'salt-theme-gen';
import type { GeneratedThemeMode } from 'salt-theme-gen';

const theme = generateTheme({ preset: 'ocean' });

const kebab = (s: string) => s.replace(/([A-Z])/g, '-$1').toLowerCase();

function modeToVars(mode: GeneratedThemeMode): string {
  const lines: string[] = [];
  for (const [k, v] of Object.entries(mode.colors))
    lines.push(`--color-${kebab(k)}: ${v};`);
  for (const [k, v] of Object.entries(mode.surfaceElevation))
    lines.push(`--surface-${k}: ${v};`);
  for (const [k, v] of Object.entries(mode.spacing))
    lines.push(`--space-${k}: ${v}px;`);
  for (const [k, v] of Object.entries(mode.radius))
    lines.push(`--radius-${k}: ${v}px;`);
  for (const [k, v] of Object.entries(mode.fontSizes))
    lines.push(`--text-${k}: ${v}px;`);
  for (const [intent, states] of Object.entries(mode.states))
    for (const [state, val] of Object.entries(states as Record<string, string>))
      lines.push(`--state-${intent}-${state}: ${val};`);
  return lines.join('\n  ');
}

// Inject into the preview iframe's <head>
const style = document.createElement('style');
style.id = 'salt-theme';
style.textContent = `
  :root {
    ${modeToVars(theme.light)}
  }
  :root[data-theme="dark"] {
    ${modeToVars(theme.dark)}
  }
`;
document.head.appendChild(style);

// Base body styles
const base = document.createElement('style');
base.textContent = `
  body {
    background-color: var(--color-background);
    color: var(--color-text);
    font-family: system-ui, -apple-system, sans-serif;
    line-height: 1.6;
    margin: 0;
  }
`;
document.head.appendChild(base);
```

## Step 2 — Dark mode toolbar toggle

Add the addon to `.storybook/main.ts`:

```ts
const config: StorybookConfig = {
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-themes',  // ← add this
  ],
};
```

Configure in `preview.ts`:

```ts
import { withThemeByDataAttribute } from '@storybook/addon-themes';

export const decorators = [
  withThemeByDataAttribute({
    themes: {
      light: 'light',
      dark:  'dark',
    },
    defaultTheme:  'light',
    attributeName: 'data-theme',
  }),
];

const preview: Preview = {
  parameters: {
    backgrounds: { disable: true }, // use CSS variables instead
  },
};

export default preview;
```

`withThemeByDataAttribute` sets `data-theme="light"` or `data-theme="dark"` on the story root — exactly what your `:root[data-theme="dark"]` CSS targets. The toolbar shows a Light/Dark toggle.

## Step 3 — ThemeProvider decorator (optional)

If your components require a React ThemeContext:

```tsx
// .storybook/preview.tsx
import type { Decorator } from '@storybook/react';
import { ThemeProvider } from '../src/theme/ThemeContext';

const ThemeDecorator: Decorator = (Story) => (
  <ThemeProvider>
    <Story />
  </ThemeProvider>
);

export const decorators = [
  ThemeDecorator,
  withThemeByDataAttribute({
    themes: { light: 'light', dark: 'dark' },
    defaultTheme: 'light',
    attributeName: 'data-theme',
  }),
];
```

Order matters: `ThemeProvider` wraps first, then `withThemeByDataAttribute` controls the `data-theme` attribute.

## Writing token-aware stories

```tsx
// src/components/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title:     'Components/Button',
  component: Button,
  tags:      ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { children: 'Save changes' },
};

export const Danger: Story = {
  args: { children: 'Delete', intent: 'danger' },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
      <Button>Default</Button>
      <Button disabled>Disabled</Button>
      <Button intent="danger">Danger</Button>
      <Button intent="success">Success</Button>
    </div>
  ),
};
```

Stories use `var(--space-sm)` directly — the variables are available because they were injected in `preview.ts`.

## Token showcase story

A living style guide that displays all semantic colors:

```tsx
// src/stories/TokenShowcase.stories.tsx
function TokenGrid() {
  const intents = ['primary', 'secondary', 'danger', 'success', 'warning', 'info'];

  return (
    <div style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-sm)' }}>
        {intents.map(name => (
          <div key={name}>
            <div style={{
              height: 64,
              background:   `var(--color-${name})`,
              borderRadius: 'var(--radius-md)',
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'center',
              color:        `var(--color-on-${name})`,
              fontWeight:   600,
              fontSize:     'var(--text-sm)',
              marginBottom: 'var(--space-xs)',
            }}>
              {name}
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', margin: 0 }}>
              --color-{name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default { title: 'Design System/Token Showcase' };
export const Colors = { render: () => <TokenGrid /> };
```

Toggle to dark mode in the toolbar — all colors switch automatically.

## Chromatic

If you use Chromatic for visual regression testing, each story captures both light and dark variants. To explicitly capture the dark variant:

```ts
export const PrimaryDark: Story = {
  args: { children: 'Save changes' },
  globals: { theme: 'dark' },
};
```

Full guide: [learn.esalt.net/salt-theme-gen/integrations/storybook/](https://learn.esalt.net/salt-theme-gen/integrations/storybook/)
