# Reddit Posts — salt-theme-gen Series

Post 2–3 days apart per subreddit. Never post the same link to two subreddits on the same day.

---

## Post 1 — Article 01 → r/webdev 18/06/26

**Title:**
I stopped maintaining two 200-line color files by hand — here's what replaced them

**Body:**
My design system setup used to be:
- `_variables-light.scss` — 80+ hardcoded colors
- `_variables-dark.scss` — the same file, maintained separately, always slightly wrong

Changing the primary color meant grepping through a dozen partials. Dark mode drifted every sprint because nobody wanted to update both files.

I built a zero-dependency package that generates the whole thing from one call:

```ts
const theme = generateTheme({ preset: 'ocean' });
// theme.light and theme.dark — both complete, both derived automatically
```

You get back: 21 semantic color tokens, 32 interaction states (hover/pressed/focused/disabled for every intent), spacing, radius, font sizes, and 18 WCAG contrast checks. All in light and dark.

Convert to CSS variables and inject into `<head>`. Done.

The key insight: dark mode should be math, not a second file someone maintains. OKLCH makes the lightness adjustments perceptually consistent across hues — HSL doesn't.

Article with the full setup: https://dev.to/hasansarwer/introducing-salt-theme-gen-generate-a-complete-design-system-from-one-color-2a9j

Happy to answer questions about the implementation.

---

## Post 2 — Article 01 → r/javascript

**Title:**
generateTheme() → 21 colors + 32 states + spacing + WCAG checks, light and dark — zero dependencies

**Body:**
Built this because I kept solving the same problem on every project: a coherent token set that covers both themes without maintaining them separately.

```ts
import { generateTheme } from 'salt-theme-gen';

const theme = generateTheme({
  preset:   'ocean',   // or any hex: '#6366f1'
  spacing:  'default',
  radius:   'default',
  fontSize: 'default',
});

theme.light.colors.primary     // oklch(...)
theme.dark.colors.background   // oklch(...)
theme.light.accessibility      // 18 WCAG ratio checks
```

TypeScript, no dependencies, works in Node / browser / Deno / Bun.

Wrote up the full pattern here: [link]

---

## Post 3 — Article 02 → r/webdev

**Title:**
The flash of wrong theme on page load — here's the fix that actually works

**Body:**
You know the one. User prefers dark mode, you save it to localStorage, but JavaScript runs after the HTML renders, so there's a brief flash of light mode on every page load.

The fix is a synchronous inline script in `<head>` — no defer, no async, no DOMContentLoaded:

```html
<script>
  (function () {
    var stored = localStorage.getItem('theme');
    if (stored) document.documentElement.setAttribute('data-theme', stored);
  })();
</script>
```

Why it works: the browser processes `<head>` top to bottom before rendering. This script runs, sets `data-theme` on `<html>`, and THEN the CSS applies `[data-theme="dark"]` rules. By first paint, the right theme is already active.

Pair it with three CSS blocks:

```css
:root { /* light tokens */ }
:root[data-theme="dark"] { /* explicit dark */ }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* OS preference fallback */ }
}
```

That handles: first-time visitors (OS preference), returning users (stored choice), and users who want to reset to system default.

Full article with the token generation side too: [link]

---

## Post 4 — Article 02 → r/javascript

**Title:**
Dark mode with zero flash — the three-rule CSS + synchronous script pattern

**Body:**
Every dark mode tutorial I've seen misses one of these:
1. The synchronous script in `<head>` that reads localStorage before paint (prevents flash)
2. The OS preference fallback for first-time visitors
3. The "reset to system" case when the user wants to undo their manual toggle

The full CSS:

```css
:root { /* light tokens — always applies */ }

:root[data-theme="dark"] {
  /* explicit preference — overrides everything */
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* OS preference — applies only when no manual choice stored */
  }
}
```

Plus a tiny synchronous script before the stylesheet:

```html
<script>
  var t = localStorage.getItem('theme');
  if (t) document.documentElement.setAttribute('data-theme', t);
</script>
```

No JavaScript library needed. No class toggling on individual components. All CSS variables update instantly when `data-theme` changes.

Full write-up: [link]

---

## Post 5 — Article 03 → r/webdev

**Title:**
WCAG accessibility audits always happen too late — here's how to run them before writing any CSS

**Body:**
Accessibility checks in most projects happen at the end: a tool scans the deployed site, flags low-contrast combinations, and now you're hunting through component styles to fix values that were hardcoded months ago.

I built a tool that runs 18 WCAG 2.1 contrast checks at token generation time — before any components are built:

```ts
const theme = generateTheme({ preset: 'ocean' });
const { accessibility } = theme.light;

accessibility.textOnBackground    // { ratio: 12.1, aa: true, aaa: true }
accessibility.primaryOnBackground // { ratio: 4.82, aa: true, aaa: false }
accessibility.onPrimaryOnPrimary  // { ratio: 5.1,  aa: true, aaa: false }
```

All 18 checks cover the combinations that actually fail in production: text on background, text on card surface, button text on button background, semantic colors as standalone text.

And it runs in CI — if a token fails AA, the script exits 1 and the build fails:

```ts
const failures = Object.entries(theme.light.accessibility)
  .filter(([, check]) => !check.aa)
  .map(([name, check]) => `${name}: ${check.ratio.toFixed(2)}`);

if (failures.length > 0) { process.exit(1); }
```

No more shipping low-contrast text to production.

Article with the full check list and CI setup: [link]

---

## Post 6 — Article 06 → r/reactjs

**Title:**
ThemeContext + CSS variables + no flash of wrong theme — the complete React dark mode setup

**Body:**
Every React dark mode tutorial I've found either flashes the wrong theme on load or requires a heavy library. Here's the pattern that avoids both.

The key: inject the theme CSS and restore localStorage *before* React mounts:

```tsx
// main.tsx — before ReactDOM.createRoot
const styleEl = document.createElement('style');
styleEl.textContent = buildThemeCSS(); // :root { } + :root[data-theme="dark"] { }
document.head.appendChild(styleEl);

const saved = localStorage.getItem('theme');
if (saved) document.documentElement.setAttribute('data-theme', saved);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>
);
```

Then a ThemeContext exposes `isDark` and `toggle` — components call `useTheme()`:

```tsx
const { isDark, toggle } = useTheme();
```

No next-themes, no class toggling, no duplicating styles for dark mode. All 21 semantic tokens update automatically via CSS variables when `data-theme` changes.

Full article with ThemeContext, ThemeToggle component, CSS Modules example, and Vite FOUC fix: [link]

---

## Post 7 — Article 07 → r/nextjs

> **Where to post:** Find the current weekly "Show and Tell" thread (pinned or search "show and tell" in the sub) and post this as a **comment** — not a standalone post. Rule 4 bans standalone product posts but explicitly allows Show and Tell.

**Comment text:**

**salt-theme-gen + Next.js App Router** — server-side design tokens, no FOUC, no hydration warning.

The tricky part: `localStorage` is client-only but the root layout renders on the server. The working pattern:

```tsx
// app/layout.tsx
<html lang="en" suppressHydrationWarning>
  <head>
    {/* Server-rendered — CSS on first byte, no FOUC possible */}
    <style dangerouslySetInnerHTML={{ __html: themeCSS }} />

    {/* Synchronous — reads localStorage before paint */}
    <script dangerouslySetInnerHTML={{ __html:
      `(function(){var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);})();`
    }} />
  </head>
  <body>{children}</body>
</html>
```

`suppressHydrationWarning` stops React from warning that `data-theme` wasn't set during SSR.

Full write-up (ThemeProvider Client Component, Server Component token access, Tailwind integration): [link]

---

## Post 8 — Article 08 → r/vuejs

**Title:**
Vue 3 dark mode with a module-level ref — no Pinia needed for shared theme state

**Body:**
The common advice for sharing state in Vue 3 is "use Pinia." But for theme state specifically, you don't need a store. A module-level `ref` is shared across all composable calls automatically:

```ts
// composables/useThemeMode.ts
const isDark = ref(false); // module-level — one instance, shared everywhere

export function useThemeMode() {
  function toggle() {
    isDark.value = !isDark.value;
    const val = isDark.value ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', val);
    localStorage.setItem('theme', val);
  }
  return { isDark, toggle };
}
```

Every component that calls `useThemeMode()` gets the same ref. No store setup, no plugin installation.

Pair it with `provide`/`inject` if you need typed access deeper in the tree — the article covers both patterns plus a Pinia alternative if you already have it.

Full setup with CSS injection in `main.ts`, ThemeToggle component, scoped styles with CSS variables: [link]

---

## Post 9 — Article 09 → r/sveltejs

**Title:**
SvelteKit theme setup: static CSS at build time vs dynamic layout load — which to pick

**Body:**
SvelteKit gives you two clean options for design tokens:

**Option 1 (recommended):** generate a CSS file at build time, link it in `app.html`
```
npm run build:theme  →  static/theme.css  →  <link rel="stylesheet">
```
Fastest delivery — browser caches it like any other static file. Zero per-request cost.

**Option 2:** generate in `+layout.server.ts`, inject via `{@html}` in `+layout.svelte`
Best for multi-tenant apps where the theme changes per-request or per-user.

The writable store for dark mode is identical either way:

```ts
// src/lib/stores/theme.ts
const { subscribe, set } = writable<'light' | 'dark'>('light');
```

One gotcha: guard `$app/environment`'s `browser` check in the store. SvelteKit will try to read `localStorage` during SSR and throw without it.

Article with both approaches, full store code, toggle component, and Svelte 5 runes note: [link]

---

## Post 10 — Article 10 → r/angular

**Title:**
Angular signals + DOCUMENT injection + CSS variables — a clean ThemeService without boilerplate

**Body:**
Angular's DI and signals make for a surprisingly clean theme setup. One root-level service owns everything: the CSS injection, the dark mode signal, and the localStorage sync.

```ts
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private doc = inject(DOCUMENT);
  isDark = signal(false);

  constructor() {
    const saved = localStorage.getItem('theme');
    const startDark = saved === 'dark' ||
      (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
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
}
```

One non-obvious thing: Angular services are lazy. Force eager instantiation in `main.ts` or the constructor never runs on startup:

```ts
bootstrapApplication(AppComponent).then(ref => ref.injector.get(ThemeService));
```

CSS variables pierce `ViewEncapsulation.Emulated` — `var(--color-primary)` works inside component styles without `::ng-deep`.

Article with full ThemeService, toggle component, and Angular Universal SSR guard: [link]

---

## Post 11 — Article 11 → r/tailwindcss

**Title:**
Stop using arbitrary values in Tailwind — map CSS variables to config instead

**Body:**
If your Tailwind markup looks like this:

```html
<button class="bg-[#2563eb] hover:bg-[#1d4ed8] rounded-[8px] px-[24px]">
```

you've lost the point of a design system. Every `[#hex]` is a hardcoded value that won't respond to theme changes and isn't part of any scale.

The fix is mapping CSS variables to Tailwind config:

```ts
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary:    'var(--color-primary)',
      background: 'var(--color-background)',
      surface:    'var(--color-surface)',
      text:       'var(--color-text)',
      muted:      'var(--color-muted)',
      border:     'var(--color-border)',
    },
    spacing: {
      sm: 'var(--space-sm)',
      md: 'var(--space-md)',
      lg: 'var(--space-lg)',
    },
    borderRadius: {
      DEFAULT: 'var(--radius-md)',
      lg:      'var(--radius-lg)',
      pill:    'var(--radius-pill)',
    },
  }
}
```

Then: `bg-primary`, `text-muted`, `p-md`, `rounded-lg` — all resolving to tokens that switch automatically on dark mode. No `dark:` prefix needed for most components.

Article with full config, class reference table, and programmatic config generation: [link]

---

## Post 12 — Article 12 → r/reactnative

**Title:**
How to structure design tokens in React Native — typed JS objects through context, StyleSheet.create with useMemo

**Body:**
React Native has no CSS cascade, no `:root`, no `var()`. Design token libraries built for the web assume CSS custom properties exist — they don't work here.

The pattern that does work: a typed token object passed through context, consumed directly in `StyleSheet.create`.

```tsx
const { mode } = useTheme(); // { colors, spacing, radius, fontSizes, ... }

const styles = useMemo(() => StyleSheet.create({
  container: { backgroundColor: mode.colors.background },
  heading: {
    fontSize:    mode.fontSizes['3xl'],
    fontWeight:  '800',
    color:       mode.colors.text,
  },
  card: {
    backgroundColor: mode.surfaceElevation.card,
    borderWidth:     1,
    borderColor:     mode.colors.border,
    borderRadius:    mode.radius.lg,
    padding:         mode.spacing.xl,
  },
}), [mode]); // re-creates only when the theme object changes
```

The `useMemo([mode])` is the important part — without it, `StyleSheet.create` runs on every render, which is expensive.

The `ThemeContext` reads `useColorScheme()` for OS preference and persists the manual choice to AsyncStorage. Switching themes updates the context value, which triggers `useMemo` to rebuild styles across all screens.

Write-up with the full ThemeContext, AsyncStorage persistence, `useColorScheme()` fallback, and a typed Button component with intent variants: [link]

---

## Post 13 — Article 13 → r/reactnative

**Title:**
Two Expo dark mode bugs most setups miss — the launch background flash and the null useColorScheme

**Body:**
Getting dark mode right in Expo means handling two things most tutorials skip:

### 1. The native background flash on launch

Your app renders the correct dark background, but before React Native paints anything there's a white flash from the native layer. Fix:

```tsx
import * as SystemUI from 'expo-system-ui';

useEffect(() => {
  SystemUI.setBackgroundColorAsync(mode.colors.background);
}, [isDark, mode.colors.background]);
```

This sets the native background — visible during splash and behind the software keyboard. Without it, dark mode apps flash white on every cold launch.

### 2. useColorScheme() returning null

If `useColorScheme()` always returns `null`, check `app.json`:

```json
{
  "expo": {
    "userInterfaceStyle": "automatic"
  }
}
```

Without `"automatic"`, Expo locks the interface style and the hook has nothing to report. Your system preference fallback silently never fires.

Both issues are easy to miss because they don't throw errors — the app just behaves wrong. Full Expo Router setup with AsyncStorage persistence and EAS Build notes: [link]

---

## Post 14 — Article 23 → r/webdev

**Title:**
The prompt that makes Claude and Cursor wire up design tokens correctly in one shot

**Body:**
Without guidance, AI coding assistants tend to:
- Invent an API that doesn't exist
- Hardcode hex values instead of using tokens
- Put `generateTheme()` inside a React component (regenerates on every render)
- Forget the synchronous flash-prevention script

The fix is giving the assistant the exact token names and injection pattern upfront:

```
Add design tokens to this project.

GENERATE: src/theme.ts with generateTheme({ preset: 'ocean' })

INJECT CSS — token naming:
  colors.primary        → --color-primary
  colors.onPrimary      → --color-on-primary  (camelCase → kebab)
  surfaceElevation.card → --surface-card
  spacing.md            → --space-md
  radius.md             → --radius-md
  fontSizes.md          → --text-md
  states.primary.hover  → --state-primary-hover

DARK MODE: toggle data-theme="dark" on <html>.
Add a synchronous inline script (no defer/async) in <head> that reads
localStorage and sets data-theme before paint.
```

With this context, Claude Code finds the entry file, injects the CSS, creates the context, and greps for hardcoded colors in one pass.

Article with Cursor rules (`.cursor/rules/design-tokens.mdc`), v0.dev prompts, and the full Claude Code workflow: [link]

---

## Post 15 — Article 24 → r/FlutterDev

**Title:**
My web app and Flutter app now share the same design tokens — Node.js bridge to Dart constants

**Body:**
Flutter doesn't run JavaScript. No CSS variables, no `:root`, no `var()`. But the token values can reach Flutter through a build-time bridge.

A Node.js script runs `generateTheme()`, converts OKLCH colors to hex with `culori`, and writes a Dart constants file:

```dart
// lib/theme/app_tokens.dart — Generated, do not edit
class AppColorsLight {
  static const Color primary    = Color(0xFF2563EB);
  static const Color background = Color(0xFFF5F7FF);
  static const Color text       = Color(0xFF1E293B);
  static const Color danger     = Color(0xFFDC2626);
  // ...all 21 colors
}

class AppSpacing {
  static const double md = 16.0;
  static const double lg = 24.0;
}
```

Flutter's `ThemeData` reads `AppColorsLight` and `AppColorsDark` directly. The web app reads the same values as CSS variables. One `generateTheme()` call — two platforms in sync.

Run before `flutter build` in CI:

```yaml
- name: Generate tokens
  run: npm run generate:tokens
- name: Build Flutter
  run: flutter build apk
```

Article with the full generation script, `ThemeData` setup, and shared `theme-config.json` for keeping web + Flutter in sync: [link]

---

## Posting schedule

| Day | Post | Subreddit |
|-----|------|-----------|
| 1   | Post 1 — Introducing | r/webdev |
| 3   | Post 2 — Introducing | r/javascript |
| 5   | Post 3 — Dark mode flash | r/webdev |
| 7   | Post 4 — Dark mode flash | r/javascript |
| 9   | Post 5 — Accessibility | r/webdev |
| 11  | Post 6 — React | r/reactjs |
| 13  | Post 7 — Next.js | r/nextjs |
| 15  | Post 8 — Vue | r/vuejs |
| 17  | Post 9 — SvelteKit | r/sveltejs |
| 19  | Post 10 — Angular | r/angular |
| 21  | Post 11 — Tailwind | r/tailwindcss |
| 23  | Post 12 — React Native | r/reactnative |
| 25  | Post 13 — Expo (launch flash) | r/reactnative |
| 27  | Post 14 — AI assistants | r/webdev |
| 29  | Post 15 — Flutter bridge | r/FlutterDev |

**Rules:**
- Never post the same link to two subreddits on the same day
- Replace [link] with the Dev.to article URL before posting
- Engage with comments in the first 2 hours — Reddit algorithm rewards early activity
- Don't mention the package name in the title — lead with the problem
