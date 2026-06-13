import type { GeneratedThemeMode } from 'salt-theme-gen';
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme extends GeneratedThemeMode {}
}
