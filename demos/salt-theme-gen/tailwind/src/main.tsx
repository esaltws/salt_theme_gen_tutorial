import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { injectTheme } from './theme';
import { App } from './App';
import './index.css';

injectTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
