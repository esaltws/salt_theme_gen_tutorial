import { generateTheme } from 'salt-theme-gen';

const gen = generateTheme({ preset: 'ocean' });

// React Native uses JS values — extract raw values, not CSS variables
export const LightTheme = {
  colors:    gen.light.colors,
  spacing:   gen.light.spacing,
  radius:    gen.light.radius,
  fontSizes: gen.light.fontSizes,
};

export const DarkTheme = {
  colors:    gen.dark.colors,
  spacing:   gen.dark.spacing,
  radius:    gen.dark.radius,
  fontSizes: gen.dark.fontSizes,
};

export type AppTheme = typeof LightTheme;
