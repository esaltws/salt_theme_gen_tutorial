import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { injectTheme } from './theme';

try {
  const stored = localStorage.getItem('theme');
  if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
} catch {}

injectTheme();

bootstrapApplication(AppComponent).catch(console.error);
