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
  document.head.insertBefore(style, document.head.firstChild);
}

// Generate SCSS variable map string for use in .scss files
export function buildScssMap(mode: GeneratedThemeMode): string {
  const entries: string[] = [];
  for (const [k, v] of Object.entries(mode.colors)) entries.push(`  '${k}': ${v}`);
  for (const [k, v] of Object.entries(mode.spacing)) entries.push(`  'space-${k}': ${v}px`);
  for (const [k, v] of Object.entries(mode.radius)) entries.push(`  'radius-${k}': ${v}px`);
  for (const [k, v] of Object.entries(mode.fontSizes)) entries.push(`  'text-${k}': ${v}px`);
  return `(\n${entries.join(',\n')}\n)`;
}
