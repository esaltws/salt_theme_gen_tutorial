import { generateTheme } from 'salt-theme-gen';
import type { GeneratedThemeMode } from 'salt-theme-gen';

// Ocean preset: hue 235, chroma 0.13 — matches esalt brand
export const theme = generateTheme({
  preset: 'ocean',
  spacing: 'default',
  radius: 'default',
  fontSize: 'default',
});

function kebab(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

function modeToVars(mode: GeneratedThemeMode): string {
  const lines: string[] = [];

  // Semantic colors → --color-{key}
  for (const [key, val] of Object.entries(mode.colors)) {
    lines.push(`  --color-${kebab(key)}: ${val};`);
  }

  // Surface elevation → --surface-{key}
  for (const [key, val] of Object.entries(mode.surfaceElevation)) {
    lines.push(`  --surface-${key}: ${val};`);
  }

  // Spacing → --space-{key}
  for (const [key, val] of Object.entries(mode.spacing)) {
    lines.push(`  --space-${key}: ${val}px;`);
  }

  // Radius → --radius-{key}
  for (const [key, val] of Object.entries(mode.radius)) {
    lines.push(`  --radius-${key}: ${val}px;`);
  }

  // Font sizes → --text-{key}
  for (const [key, val] of Object.entries(mode.fontSizes)) {
    lines.push(`  --text-${key}: ${val}px;`);
  }

  // State colors → --state-{intent}-{state}
  for (const [intent, states] of Object.entries(mode.states)) {
    for (const [state, val] of Object.entries(states as Record<string, string>)) {
      lines.push(`  --state-${intent}-${state}: ${val};`);
    }
  }

  return lines.join('\n');
}

const lightVars = modeToVars(theme.light);
const darkVars = modeToVars(theme.dark);

// Full CSS string injected into <head> — defines :root vars for light + dark
export const themeCSS = `
:root {
${lightVars}
}

@media (prefers-color-scheme: dark) {
  :root {
${darkVars}
  }
}

:root[data-theme="dark"] {
${darkVars}
}

:root[data-theme="light"] {
${lightVars}
}
`.trim();
