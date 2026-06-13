import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { injectTheme } from './theme';
import { ThemeProvider } from './ThemeContext';
import { App } from './App';

injectTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
