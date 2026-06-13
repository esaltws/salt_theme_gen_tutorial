import type { Preview } from '@storybook/react';
import { generateTheme } from 'salt-theme-gen';
import type { GeneratedThemeMode } from 'salt-theme-gen';

const theme = generateTheme({ preset: 'ocean' });

function kebab(str: string) {
  return str.replace(/([A-Z])/g, m => '-' + m.toLowerCase());
}

function modeToVars(mode: GeneratedThemeMode): string {
  const vars: string[] = [];
  for (const [k, v] of Object.entries(mode.colors)) vars.push(`  --color-${kebab(k)}: ${v};`);
  for (const [k, v] of Object.entries(mode.spacing)) vars.push(`  --space-${k}: ${v}px;`);
  for (const [k, v] of Object.entries(mode.radius)) vars.push(`  --radius-${k}: ${v}px;`);
  for (const [k, v] of Object.entries(mode.fontSizes)) vars.push(`  --text-${k}: ${v}px;`);
  return vars.join('\n');
}

const style = document.createElement('style');
style.textContent = [
  `:root {\n${modeToVars(theme.light)}\n}`,
  `:root[data-theme="dark"] {\n${modeToVars(theme.dark)}\n}`,
].join('\n');
document.head.appendChild(style);

const preview: Preview = {
  globalTypes: {
    themeMode: {
      name: 'Theme',
      description: 'salt-theme-gen mode',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: ['light', 'dark'],
        title: 'Theme mode',
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const mode = context.globals['themeMode'] ?? 'light';
      document.documentElement.setAttribute('data-theme', mode);
      return Story();
    },
  ],
  parameters: {
    controls: { matchers: { color: /(background|color)/i, date: /Date$/i } },
  },
};

export default preview;
