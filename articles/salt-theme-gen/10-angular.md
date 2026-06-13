---
title: salt-theme-gen with Angular — Injectable Service, Signals, CSS Variables
published: false
description: Angular ThemeService with signals, CSS variable injection via DOCUMENT, and a dark mode toggle that works through ViewEncapsulation.
tags: angular, typescript, css, webdev
series: salt-theme-gen — Design Tokens for Every Framework
cover_image:
---

Angular's dependency injection and signals make for a clean `salt-theme-gen` integration. A single root-level `ThemeService` owns the state, injects the CSS, and exposes a reactive `isDark` signal that any component can read.

## Install

```bash
npm install salt-theme-gen
```

## ThemeService

```ts
// src/app/theme/theme.service.ts
import { Injectable, signal, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { generateTheme } from 'salt-theme-gen';
import type { GeneratedThemeMode } from 'salt-theme-gen';

const theme = generateTheme({ preset: 'ocean' });

function kebab(s: string) {
  return s.replace(/([A-Z])/g, '-$1').toLowerCase();
}

function modeVars(mode: GeneratedThemeMode): string {
  const lines: string[] = [];
  for (const [k, v] of Object.entries(mode.colors))
    lines.push(`--color-${kebab(k)}: ${v}`);
  for (const [k, v] of Object.entries(mode.surfaceElevation))
    lines.push(`--surface-${k}: ${v}`);
  for (const [k, v] of Object.entries(mode.spacing))
    lines.push(`--space-${k}: ${v}px`);
  for (const [k, v] of Object.entries(mode.radius))
    lines.push(`--radius-${k}: ${v}px`);
  for (const [k, v] of Object.entries(mode.fontSizes))
    lines.push(`--text-${k}: ${v}px`);
  for (const [intent, states] of Object.entries(mode.states))
    for (const [state, val] of Object.entries(states as Record<string, string>))
      lines.push(`--state-${intent}-${state}: ${val}`);
  return lines.join('; ');
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private doc = inject(DOCUMENT);

  isDark = signal(false);

  constructor() {
    // Read saved preference
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const startDark = saved === 'dark' || (!saved && prefersDark);

    this.isDark.set(startDark);
    this.injectCSS();
    this.applyMode(startDark);
  }

  toggle() {
    const next = !this.isDark();
    this.isDark.set(next);
    this.applyMode(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  private injectCSS() {
    let el = this.doc.getElementById('salt-theme') as HTMLStyleElement;
    if (!el) {
      el = this.doc.createElement('style');
      el.id = 'salt-theme';
      this.doc.head.appendChild(el);
    }
    el.textContent = `
      :root { ${modeVars(theme.light)} }
      :root[data-theme="dark"] { ${modeVars(theme.dark)} }
    `;
  }

  private applyMode(dark: boolean) {
    this.doc.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }
}
```

## Eager instantiation

Angular services are lazy by default — `ThemeService` won't run its constructor until first injected. Force it to run on app start:

```ts
// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { ThemeService } from './app/theme/theme.service';

bootstrapApplication(AppComponent).then(ref => {
  // Eagerly instantiate — runs constructor, injects CSS, reads localStorage
  ref.injector.get(ThemeService);
});
```

## Toggle component

```ts
// src/app/components/theme-toggle/theme-toggle.component.ts
import { Component, inject } from '@angular/core';
import { ThemeService } from '../../theme/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  template: `
    <button (click)="theme.toggle()" class="toggle-btn">
      {{ theme.isDark() ? '☀ Light' : '◐ Dark' }}
    </button>
  `,
  styles: [`
    .toggle-btn {
      background:    var(--color-surface);
      border:        1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding:       var(--space-xs) var(--space-sm);
      color:         var(--color-text);
      cursor:        pointer;
      font-size:     var(--text-sm);
    }
  `],
})
export class ThemeToggleComponent {
  theme = inject(ThemeService);
}
```

## Using tokens in components

```ts
// src/app/components/card/card.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="card">
      <h3 class="title">{{ title }}</h3>
      <p class="body">{{ body }}</p>
    </div>
  `,
  styles: [`
    .card {
      background:    var(--surface-card);
      border:        1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding:       var(--space-xl);
    }

    .title {
      font-size:     var(--text-lg);
      font-weight:   700;
      color:         var(--color-text);
      margin-bottom: var(--space-sm);
    }

    .body {
      font-size:  var(--text-md);
      color:      var(--color-muted);
      line-height: 1.7;
    }
  `],
})
export class CardComponent {
  @Input() title = '';
  @Input() body  = '';
}
```

## ViewEncapsulation and CSS variables

Angular's default `ViewEncapsulation.Emulated` adds unique attribute selectors to component CSS. This doesn't break CSS variables — `var(--color-primary)` is resolved against the global cascade, not the component's encapsulated styles. You don't need `ViewEncapsulation.None` or `::ng-deep` for token references.

The only case where `::ng-deep` is useful: overriding a **third-party component's** inline styles based on dark mode. In that case, use `:host-context([data-theme="dark"]) ::ng-deep .third-party-class`.

## SSR with Angular Universal

For server-side rendering, guard `localStorage` and `window` accesses:

```ts
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

private platformId = inject(PLATFORM_ID);

constructor() {
  if (isPlatformBrowser(this.platformId)) {
    // localStorage and window are safe here
  }
}
```

Full guide: [learn.esalt.net/salt-theme-gen/integrations/angular/](https://learn.esalt.net/salt-theme-gen/integrations/angular/)
