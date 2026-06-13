import { generateTheme } from 'salt-theme-gen';

const gen = generateTheme({ preset: 'ocean' });

// Expo uses JS objects — no CSS variables. Extract raw color values.
export const LightTheme = {
  colors:    gen.light.colors,
  spacing:   gen.light.spacing,
  radius:    gen.light.radius,
  fontSizes: gen.light.fontSizes,
  states:    gen.light.states,
};

export const DarkTheme = {
  colors:    gen.dark.colors,
  spacing:   gen.dark.spacing,
  radius:    gen.dark.radius,
  fontSizes: gen.dark.fontSizes,
  states:    gen.dark.states,
};

export type AppTheme = typeof LightTheme;
