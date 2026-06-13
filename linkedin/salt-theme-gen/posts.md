# LinkedIn Posts — salt-theme-gen Series
# One post per article. Plain text — no markdown renders on LinkedIn.
# Replace [ARTICLE LINK] with the published Dev.to URL before posting.
# Suggested cadence: one post every 2–3 days.

---

## Post 01 — Introducing salt-theme-gen

Your _variables.scss has 80 hardcoded colors.
Half of them are never used.
Dark mode is a file someone updates "when they remember."

I built salt-theme-gen to fix this.

One function call generates a complete light/dark design system:
21 semantic colors, 32 interaction states, 6 spacing values, 7 border radii, 7 font sizes — all WCAG-verified.

npm install salt-theme-gen
generateTheme({ preset: 'ocean' })

That's it. The rest is CSS variables.

20 built-in color presets. Pass any hex color if you already have a brand. Works in React, Next.js, Vue, Angular, Svelte, React Native, Flutter — any platform that can receive a JavaScript object or a CSS file.

Full write-up with the complete pattern:
[ARTICLE LINK]

Part 1 of 24 in the salt-theme-gen series.

#webdev #css #designsystem #frontend #opensource

---

## Post 02 — Dark Mode in 5 Minutes

The flash of wrong theme on page load is embarrassing.

You store the preference in localStorage. But JavaScript runs after HTML and CSS paint. So for a split second, the user sees the wrong theme — every single time they hard-refresh.

The fix is a three-line synchronous inline script in <head>.

Not async. Not deferred. Synchronous — so it runs before the browser paints a single pixel.

Pair that with salt-theme-gen's CSS variable output (light mode as :root, dark mode as :root[data-theme="dark"]) and you get:

- Zero flash of wrong theme
- Dark mode with a single attribute toggle
- OS preference as automatic fallback via @media

Total JavaScript for the toggle mechanism: 3 lines.

The complete pattern is in this week's article:
[ARTICLE LINK]

Part 2 of 24 in the salt-theme-gen series.

#webdev #css #darkmode #javascript #frontend

---

## Post 03 — WCAG Accessibility Built Into Your Tokens

Most teams discover accessibility failures after they ship.

A tool runs on the deployed site and flags 12 low-contrast text/background combinations. Now you're backtracking through component styles to fix values that were baked in months ago.

salt-theme-gen runs 18 WCAG 2.1 contrast ratio checks at token generation time.

Before you write a single component. Before you build anything.

The report covers text on background, text on surfaces, on-color text inside buttons, semantic colors as standalone text (danger, success, warning, info) — in both light and dark mode.

All 20 built-in presets pass WCAG AA out of the box.

You can also add this check to CI so a contrast regression fails the build before it ships:

const failures = Object.entries(theme.light.accessibility).filter(([, c]) => !c.aa);
if (failures.length > 0) process.exit(1);

Full details:
[ARTICLE LINK]

Part 3 of 24 in the salt-theme-gen series.

#accessibility #wcag #a11y #webdev #css

---

## Post 04 — 20 Color Presets, Zero Color Theory Required

The hardest part of starting a new project isn't the code. It's the first color decision.

You need a primary. Then hover states, background tints, on-color text, semantic danger/success/warning colors that feel cohesive — and all of it needs to pass contrast.

salt-theme-gen ships 20 built-in OKLCH color presets. Each one is a character, not just a hue:

ocean — calm, professional, SaaS
rose — warm, consumer, approachable
midnight — dark-first, developer tools
violet — creative, AI products
emerald — fresh, health, finance

Pass a preset name. Get the full semantic color system.

Or skip presets entirely: generateTheme({ preset: '#6366f1' })

Your hex becomes the primary. The rest of the 21-color system derives from it automatically. No color theory required.

The complete preset guide with all 20 options:
[ARTICLE LINK]

Part 4 of 24 in the salt-theme-gen series.

#design #webdev #css #frontend #ux

---

## Post 05 — Spacing, Radius, and Typography in One Argument

Color gets all the attention in design systems. But the personality of a UI comes from its scale.

The same blue can feel like Bloomberg or like Airbnb. The difference is spacing, border radius, and font size.

salt-theme-gen gives you three options for each — as a single argument at generation time:

spacing: 'compact' | 'default' | 'spacious'
radius: 'sharp' | 'default' | 'rounded' | 'pill'
fontSize: 'compact' | 'default' | 'large'

The combination determines the feel:

compact + sharp + compact = developer tool, admin dashboard
spacious + rounded + default = consumer app, landing page
default + default + default = general SaaS

Change the combination and every spacing/radius/font value across the entire codebase updates — because everything references CSS variables, not hardcoded pixels.

The full scale reference with exact pixel values:
[ARTICLE LINK]

Part 5 of 24 in the salt-theme-gen series.

#design #css #webdev #ux #frontend

---

## Post 06 — salt-theme-gen with React

Most React theming setups I've seen have the same problem:

The theme object is a 200-line file of hardcoded hex values. Dark mode is a second object that's 60% copy-pasted. When the brand color changes, you update both files by hand.

The salt-theme-gen React integration is three files:

1. src/theme/index.ts — one generateTheme() call
2. src/main.tsx — inject CSS variables before React mounts
3. src/theme/ThemeContext.tsx — toggle + localStorage persistence

After that, every component uses var(--color-primary), var(--space-md), var(--radius-lg). No prop drilling. No re-renders when the theme changes. Just CSS doing what CSS does.

The complete setup with ThemeContext, toggle component, and FOUC prevention:
[ARTICLE LINK]

Part 6 of 24 in the salt-theme-gen series.

#react #javascript #typescript #webdev #css

---

## Post 07 — salt-theme-gen with Next.js App Router

Next.js App Router adds a wrinkle to theming: the root layout renders on the server, but localStorage is client-only.

Get the order wrong and you get a flash of wrong theme on every page load — even with a synchronous script.

The correct App Router pattern:

1. Build themeCSS server-side in app/layout.tsx
2. Inject via <style dangerouslySetInnerHTML> — available before hydration
3. Add a synchronous inline <script> that reads localStorage and sets data-theme
4. suppressHydrationWarning on <html>

The CSS is in the HTML on the very first byte from the server. The script restores the saved preference. By the time React hydrates, both are already applied.

Full setup with ThemeProvider Client Component and Tailwind integration:
[ARTICLE LINK]

Part 7 of 24 in the salt-theme-gen series.

#nextjs #react #typescript #webdev #css

---

## Post 08 — salt-theme-gen with Vue 3

Vue 3's Composition API maps cleanly to the salt-theme-gen pattern.

The key insight: put isDark in a module-level ref, not inside a component. That way every useThemeMode() call shares the same reactive state — no Pinia store needed for something this simple.

import { ref } from 'vue';
const isDark = ref(false); // module-level = shared across all callers

function toggle() {
  isDark.value = !isDark.value;
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light');
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
}

export function useThemeMode() { return { isDark, toggle }; }

Three files total: theme/index.ts, main.ts (CSS injection), composables/useThemeMode.ts.

If you already use Pinia, there's a store version too. But you probably don't need it just for this.

Full setup with provide/inject for deep component access:
[ARTICLE LINK]

Part 8 of 24 in the salt-theme-gen series.

#vue #vuejs #javascript #webdev #css

---

## Post 09 — salt-theme-gen with SvelteKit

Two ways to use salt-theme-gen in SvelteKit:

Option A — static CSS file. Run a Node.js script at build time that generates static/theme.css. Link it in app.html. Done. No JS overhead, no dynamic generation.

Option B — layout server load. Return themeCSS from +layout.server.ts. Inject via {@html} in <svelte:head>. Useful when the theme varies per user or tenant.

For dark mode reactivity, a writable store with a module-level singleton works cleanly:

export const theme = createThemeStore();

The store's subscribe method updates data-theme on document.documentElement whenever the value changes. Svelte's reactive $ prefix handles the rest in components.

Full implementation with both approaches:
[ARTICLE LINK]

Part 9 of 24 in the salt-theme-gen series.

#svelte #sveltekit #webdev #javascript #css

---

## Post 10 — salt-theme-gen with Angular

Angular's dependency injection makes ThemeService the natural home for salt-theme-gen.

One @Injectable({ providedIn: 'root' }) service that:
- Injects DOCUMENT (not window — SSR-safe)
- Creates a signal for isDark
- Injects the CSS variables into <head> on construction
- Reads localStorage for the saved preference
- Exposes a toggle() method

The tricky part: Angular services are lazy. ThemeService won't run its constructor until something injects it. Force eager instantiation in main.ts:

bootstrapApplication(AppComponent).then(ref => {
  ref.injector.get(ThemeService);
});

That one line ensures the theme loads on app start — even before any component needs it.

CSS variables work fine through ViewEncapsulation.Emulated. No ::ng-deep needed for token references.

Full setup with Angular signals:
[ARTICLE LINK]

Part 10 of 24 in the salt-theme-gen series.

#angular #typescript #webdev #javascript #css

---

## Post 11 — salt-theme-gen with Tailwind CSS

Tailwind and salt-theme-gen solve different problems. They work better together.

Tailwind handles layout, spacing utilities, and component structure. salt-theme-gen provides the semantic token values. The connection is tailwind.config.ts:

colors: {
  primary:    'var(--color-primary)',
  background: 'var(--color-background)',
  surface:    'var(--color-surface)',
  text:       'var(--color-text)',
  border:     'var(--color-border)',
}

After that, bg-[#2563eb] becomes bg-primary. text-[#64748b] becomes text-muted.

The best part: darkMode: ['attribute', '[data-theme="dark"]'] means CSS variables switch automatically. You rarely need dark: variants at all.

The only Tailwind arbitrary values left are things outside the token system — opacity overrides, one-off layout values. Everything semantic is now a named class.

Full config with spacing, radius, and font size mappings:
[ARTICLE LINK]

Part 11 of 24 in the salt-theme-gen series.

#tailwind #tailwindcss #webdev #css #frontend

---

## Post 12 — salt-theme-gen with React Native

React Native has no CSS cascade, no var(), no :root.

That's the first thing to know. Everything that works on web needs a different approach in React Native.

salt-theme-gen outputs a JavaScript object — GeneratedThemeMode — not just CSS. React Native reads it directly.

The pattern:

const { mode } = useTheme(); // GeneratedThemeMode

const styles = useMemo(() => StyleSheet.create({
  container: { backgroundColor: mode.colors.background },
  text:       { color: mode.colors.text, fontSize: mode.fontSizes.md },
  card:       { backgroundColor: mode.surfaceElevation.card,
                borderRadius: mode.radius.lg },
}), [mode]);

The useMemo([mode]) is important — mode is a new object reference on theme toggle, so without it, StyleSheet gets recreated on every render.

The complete ThemeContext with AsyncStorage persistence and OS preference sync:
[ARTICLE LINK]

Part 12 of 24 in the salt-theme-gen series.

#reactnative #react #mobile #javascript #typescript

---

## Post 13 — salt-theme-gen with Expo

Expo has three theming-specific needs that bare React Native doesn't:

1. expo-system-ui — sets the native background color visible during app launch and behind the software keyboard. Without it, you get a white flash even when your app background is dark.

2. AsyncStorage via npx expo install — resolves the version compatible with your SDK.

3. Expo Router's _layout.tsx — the natural ThemeProvider entry point.

The pattern that prevents the flash before preference loads:

const [loaded, setLoaded] = useState(false);

useEffect(() => {
  AsyncStorage.getItem('@theme').then(saved => {
    if (saved) setPreference(saved);
    setLoaded(true);
  });
}, []);

if (!loaded) return null; // wait — don't render in wrong theme

Works in Expo Go. Works with EAS Build. No native modules, no custom development client required.

Full implementation with Expo Router and app.json config:
[ARTICLE LINK]

Part 13 of 24 in the salt-theme-gen series.

#expo #reactnative #mobile #javascript #typescript

---

## Post 14 — salt-theme-gen with Astro

Astro is the best target for salt-theme-gen. Here's why:

generateTheme() runs at build time — zero JavaScript shipped for the theme itself.

The CSS is server-rendered into the initial HTML — no FOUC possible, not even for 1ms.

But there's one non-obvious detail that catches people: you can't use a regular <style> tag.

Astro scopes <style> tags to the component where they appear. :root { --color-primary: ... } becomes [data-astro-cid-xxx] { --color-primary: ... } — which only applies inside that component.

The fix:

<Fragment set:html={`<style>${themeCSS}</style>`} />

Fragment set:html tells Astro "inject this as raw HTML." No scoping, no transformation.

One line. Fixes everything.

Full setup including island prop-passing and the is:inline toggle script:
[ARTICLE LINK]

Part 14 of 24 in the salt-theme-gen series.

#astro #webdev #javascript #css #frontend

---

## Post 15 — salt-theme-gen with Remix

Remix is the only framework where you can have true zero-FOUC dark mode.

Not "almost zero." Not "fixed with a synchronous script." Actual zero.

Because Remix loaders run on the server before the response is sent, you can read the theme preference cookie before the first byte leaves the server. The HTML arrives with the correct theme already applied.

The key pieces:

createCookie('theme') — persists the preference server-side
loader reads the cookie, returns isDark + themeCSS
root.tsx renders <style dangerouslySetInnerHTML> and sets data-theme on <html>
An action at /api/theme sets Set-Cookie on toggle

The toggle doesn't even need JavaScript. It's a plain HTML form with useFetcher — works without JS enabled.

FOUC comparison vs the localStorage approach:
[ARTICLE LINK]

Part 15 of 24 in the salt-theme-gen series.

#remix #react #webdev #javascript #css

---

## Post 16 — salt-theme-gen with CSS-in-JS

styled-components, Emotion, and vanilla-extract all accept a theme object through ThemeProvider.

salt-theme-gen outputs exactly that shape.

The integration is one line for styled-components:

declare module 'styled-components' {
  export interface DefaultTheme extends GeneratedThemeMode {}
}

After that, every ${({ theme }) => theme.colors.primary} interpolation is fully typed. Autocomplete on spacing values, font sizes, interaction states — everything in GeneratedThemeMode.

Dark mode is a prop swap:

<ThemeProvider theme={isDark ? theme.dark : theme.light}>

Change the theme object, every styled component re-renders with the new values.

Emotion works the same way. vanilla-extract needs a createThemeContract — more setup, but zero runtime cost.

All three patterns with comparison:
[ARTICLE LINK]

Part 16 of 24 in the salt-theme-gen series.

#css #javascript #react #webdev #typescript

---

## Post 17 — salt-theme-gen with Storybook

The most common Storybook problem: components look right in the app but wrong in stories.

Because Storybook doesn't know about your CSS variables or theme context.

The fix: inject the theme into Storybook's preview iframe from preview.ts.

const style = document.createElement('style');
style.textContent = `:root { ${modeToVars(theme.light)} } :root[data-theme="dark"] { ${modeToVars(theme.dark)} }`;
document.head.appendChild(style);

Then add @storybook/addon-themes and one decorator:

withThemeByDataAttribute({
  themes: { light: 'light', dark: 'dark' },
  defaultTheme: 'light',
  attributeName: 'data-theme',
})

The toolbar now shows a Light/Dark toggle. Every story automatically sees the same tokens as your app. Toggle the theme — all colors switch.

Bonus: if you use Chromatic, you get both light and dark visual regression captures automatically.

Full setup with token showcase story:
[ARTICLE LINK]

Part 17 of 24 in the salt-theme-gen series.

#storybook #webdev #css #react #designsystem

---

## Post 18 — salt-theme-gen with Sass/SCSS

Sass and salt-theme-gen don't conflict. They complement each other.

Two approaches:

Option A (recommended): Generate theme.css, import it in Sass.
Sass uses var() exactly like any other CSS — you get dark mode for free via the existing CSS variable system.

.btn { background: var(--color-primary); }

Option B: Generate a _tokens.scss partial at build time.
A Node.js script converts the theme object to $light-primary, $spacing-md, etc. Teams that prefer $variable syntax use this approach.

The bridge pattern gives you both: use Sass variables to populate CSS custom properties, get runtime dark mode switching.

:root { --color-primary: #{$light-primary}; }
[data-theme='dark'] { --color-primary: #{$dark-primary}; }

Sass maps work too — great for utility class generation with @each.

Both approaches with Vite additionalData config:
[ARTICLE LINK]

Part 18 of 24 in the salt-theme-gen series.

#sass #css #webdev #frontend #javascript

---

## Post 19 — adjustTheme(): Override Without Regenerating

generateTheme() gets you 90% of the way there.

adjustTheme() covers the last 10%.

Maybe the generated primary is close to your brand hex but not exact. Maybe the dark mode background needs to be pure black for AMOLED screens. Maybe your design language is slightly sharper than the default radius scale allows.

adjustTheme() takes a deep partial — you specify only what changes:

const adjusted = adjustTheme(
  generateTheme({ preset: 'ocean' }),
  {
    light: { colors: { primary: '#6366f1' } },
    dark:  { colors: { primary: '#818cf8', colors: { background: '#000000' } } },
  }
);

Everything else stays as generated. One override doesn't ripple into unrelated tokens.

You can also chain adjustments or branch from the same base — useful for A/B testing two radius variants against the same color scheme.

6 common patterns with before/after examples:
[ARTICLE LINK]

Part 19 of 24 in the salt-theme-gen series.

#css #designsystem #javascript #typescript #webdev

---

## Post 20 — diffTheme(): See Exactly What Changed

Design system changes often affect more than you intend.

You update the primary color. But hover states, button text colors, and three semantic tokens you forgot about also shift.

diffTheme() shows exactly what changed between two themes — nothing more, nothing less.

const diff = diffTheme(themeV1, themeV2);
// diff.light.colors.primary → { from: 'oklch(...)', to: '#6366f1' }
// All other keys: undefined (unchanged)

Use cases I've found most valuable:

Design review — print a readable summary of all token changes before merging
Verify adjustTheme() touched only what you intended
Detect which tokens changed in CI before running visual regression tests
Migration audit when upgrading salt-theme-gen versions

Pair diffTheme() in CI with Chromatic or Percy: detect token changes with diffTheme(), see which components look different in the visual tool.

5 patterns with code:
[ARTICLE LINK]

Part 20 of 24 in the salt-theme-gen series.

#css #designsystem #testing #webdev #javascript

---

## Post 21 — parseThemeJSON(): Runtime Theme Validation

TypeScript catches type errors at compile time.

But when you load a theme from a file, an API response, or localStorage — you're dealing with unknown data at runtime. The type system can't help you there.

parseThemeJSON() validates arbitrary data against the GeneratedTheme shape and returns a discriminated union:

const result = parseThemeJSON(unknownData);

if (result.success) {
  result.theme.light.colors.primary; // GeneratedTheme — safe
} else {
  console.error(result.error); // string — human-readable error
}

No type assertions (as). No non-null assertions (!). TypeScript and runtime agree on the type.

I use this pattern in five places: file loading, API responses, user theme uploads, localStorage with fallback, and library upgrade migration scripts.

The localStorage pattern with fallback to default is especially useful — if the stored theme is stale from an older version, you get the default instead of a runtime crash.

All five patterns:
[ARTICLE LINK]

Part 21 of 24 in the salt-theme-gen series.

#typescript #javascript #webdev #designsystem #frontend

---

## Post 22 — TypeScript-first Design Tokens

salt-theme-gen ships full TypeScript types — no @types package, no casting, no any.

The types I reach for most often:

IntentName — 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | ...
StateName — 'hover' | 'pressed' | 'focused' | 'disabled'

These make component props self-documenting:

interface ButtonProps {
  intent: IntentName; // constrains to valid values at compile time
}

And exhaustive switches that catch future changes:

default: {
  const _never: never = state; // compile error if new StateName added
  return _never;
}

For CSS-in-JS, one declaration makes every theme interpolation typed:

declare module 'styled-components' {
  export interface DefaultTheme extends GeneratedThemeMode {}
}

The tsconfig setting I always add: "noUncheckedIndexedAccess": true. It forces you to handle the case where a dynamic key isn't in the token set — which is the right default.

Complete type reference:
[ARTICLE LINK]

Part 22 of 24 in the salt-theme-gen series.

#typescript #webdev #javascript #designsystem #css

---

## Post 23 — Using salt-theme-gen with Claude, Cursor, and v0.dev

AI coding assistants are good at pattern-following.

Give them the exact token names, the injection pattern, and the dark mode strategy — and they wire up salt-theme-gen correctly in one shot.

Give them nothing and they invent an API that doesn't exist.

The problems I see when teams use AI without a prompt:

- Hardcoded hex values instead of CSS variables
- generateTheme() inside a React component (expensive — runs on every render)
- The synchronous flash-prevention script is missing
- Tailwind arbitrary values like bg-[#2563eb] instead of bg-primary

The solution is a precise setup prompt. Tell the AI:
- Install command
- Where to put generateTheme()
- The CSS variable naming convention
- That dark mode uses data-theme on html
- That a synchronous script goes in head before any styles

With that context, Claude Code, Cursor, and ChatGPT all produce correct integrations on the first try.

The full prompt library (generic + per-framework + Cursor rules):
[ARTICLE LINK]

Part 23 of 24 in the salt-theme-gen series.

#ai #claude #cursor #webdev #javascript

---

## Post 24 — salt-theme-gen with Flutter: Build-time Token Bridge

Flutter doesn't run JavaScript.

No npm. No CSS variables. No var(). But the token values from salt-theme-gen can still reach Flutter through a build-time bridge.

A Node.js script:
1. Calls generateTheme({ preset: 'ocean' })
2. Converts OKLCH colors to hex via the culori library
3. Writes a Dart constants file

The output is a lib/theme/app_tokens.dart with:

class AppColorsLight {
  static const Color primary = Color(0xFF2563EB);
  static const Color background = Color(0xFFF5F7FF);
  // ... all 21 colors
}

class AppSpacing { static const double md = 16.0; }
class AppRadius  { static const double lg = 12.0; }

Flutter's ThemeData reads these constants. Your web app reads the same generateTheme() call. Same token values, two platforms, one source of truth.

The shared theme-config.json pattern keeps both in sync when you change presets.

Full bridge script and Flutter ThemeData setup:
[ARTICLE LINK]

Part 24 of 24 in the salt-theme-gen series.

#flutter #dart #mobile #javascript #designsystem
