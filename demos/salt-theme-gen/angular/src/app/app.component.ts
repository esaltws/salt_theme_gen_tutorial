import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { theme } from '../theme';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  mode: 'light' | 'dark' = 'light';
  colors = Object.entries(theme.light.colors);
  spacing = Object.entries(theme.light.spacing);

  constructor() {
    try {
      const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (stored) this.mode = stored;
    } catch {}
  }

  toggle() {
    this.mode = this.mode === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.mode);
    localStorage.setItem('theme', this.mode);
  }
}
