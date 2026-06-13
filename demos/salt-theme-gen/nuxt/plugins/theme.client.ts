import { generateTheme } from 'salt-theme-gen';

function kebab(str: string) {
  return str.replace(/([A-Z])/g, m => '-' + m.toLowerCase());
}

function modeToVars(mode: ReturnType<typeof generateTheme>['light']): string {
  const vars: string[] = [];
  for (const [k, v] of Object.entries(mode.colors)) vars.push(`  --color-${kebab(k)}: ${v};`);
  for (const [k, v] of Object.entries(mode.spacing)) vars.push(`  --space-${k}: ${v}px;`);
  for (const [k, v] of Object.entries(mode.radius)) vars.push(`  --radius-${k}: ${v}px;`);
  for (const [k, v] of Object.entries(mode.fontSizes)) vars.push(`  --text-${k}: ${v}px;`);
  return vars.join('\n');
}

export default defineNuxtPlugin(() => {
  const theme = generateTheme({ preset: 'ocean' });
  const style = document.createElement('style');
  style.id = 'salt-theme';
  style.textContent = [
    `:root {\n${modeToVars(theme.light)}\n}`,
    `:root[data-theme="dark"] {\n${modeToVars(theme.dark)}\n}`,
  ].join('\n');
  document.head.appendChild(style);
});
