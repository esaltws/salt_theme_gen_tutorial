import { generateTheme } from 'salt-theme-gen';
import type { GeneratedThemeMode } from 'salt-theme-gen';

export const theme = generateTheme({ preset: 'ocean' });

function kebab(str: string): string {
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

export function injectTheme(): void {
  const style = document.createElement('style');
  style.id = 'salt-theme';
  style.textContent = [
    `:root {\n${modeToVars(theme.light)}\n}`,
    `:root[data-theme="dark"] {\n${modeToVars(theme.dark)}\n}`,
  ].join('\n');
  document.head.appendChild(style);
}

// Typed theme object for styled-components ThemeProvider
export const styledTheme = theme.light;
