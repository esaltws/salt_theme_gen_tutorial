# esalt Learning Hub — Master Plan

> Status: Draft v3 — all decisions locked | Updated: 2026-06-12
> Author: Hasan Sarwer
> Repo: `e:\salt_theme_gen_tutorial`
> Live at: `learn.esalt.net`
>
> **npm packages**
> `salt-theme-gen` v1.2.2 — `npm install salt-theme-gen` — npmjs.com/package/salt-theme-gen
> `@esaltws/react-native-salt` v1.0.1 — `npm install @esaltws/react-native-salt` — npmjs.com/package/@esaltws/react-native-salt

---

## 1. Mission

Build `learn.esalt.net` — the official learning hub for all esalt packages. It:

- Teaches humans (beginner-friendly — zero assumptions beyond basic JS) how to use each package
- Teaches AI coding assistants (Claude, Cursor, ChatGPT) how to use them correctly
- Drives npm installs, GitHub stars, and consulting leads for each package
- Generates a consistent content pipeline (Dev.to series + LinkedIn posts) under the esalt brand

### Packages covered (now and future)

| Package | Status | Tutorial status |
| ------- | ------ | --------------- |
| `salt-theme-gen` | Published v1.2.2 | Phase 1 — build now |
| `@esaltws/react-native-salt` v1.0.1 | Published | Integrated here as the designed pair; own tutorial site later |
| Future packages | Upcoming | Added as released |

---

## 2. Content Philosophy — Lead with the Pain

Every chapter, every integration guide, every Dev.to article opens by identifying the developer pain point it solves. The library feature is the answer — not the intro.

**Structure of every piece of content:**

```
Pain (what the developer suffers today)
  → Why the usual fix is still painful
    → How salt-theme-gen removes/optimizes/smooths it
      → Show the before & after
```

### Core pain points salt-theme-gen addresses

| Pain | What developers do today | How salt-theme-gen solves it |
| ---- | ------------------------ | ----------------------------- |
| Hardcoded colors spread everywhere | Find-and-replace #3B82F6 across 40 files | One hue → semantic tokens everywhere |
| Dark mode looks terrible | Manually invert colors, test by eye | Mathematically correct dark palette from same input |
| Can't tell if text is readable | Manually check contrast ratios with tools | AccessibilityReport built into every generated theme |
| Hover/pressed states are inconsistent | Each dev invents their own rule | 32 state colors derived from one algorithm |
| Onboarding devs don't know which color to use | Tribal knowledge, Figma spelunking | Semantic names tell you: `surface`, `primary`, `onPrimary` |
| Brand color change = day of work | Update tokens in 5 places hoping nothing breaks | Change one hue value, regenerate |
| Web and mobile themes don't match | Two separate color systems | salt-theme-gen + react-native-salt share the same token set |
| CSS variables are messy to set up | Write 40+ vars manually | `generateTheme()` returns a ready token map |
| Design system colors fail WCAG | Discover it after launch | Auto-correction built in — library warns and adjusts |

This table is the spine of the tutorial. Each guide chapter maps to one or more rows.

---

## 3. Domain

**`learn.esalt.net`** — confirmed.

Why it's right for multi-package:

- One hub for all esalt packages — not tied to a single library name
- SEO authority flows to esalt.net (product house)
- `docs.esalt.net` stays open for auto-generated API reference later
- Scales cleanly: `/salt-theme-gen/`, `/react-native-salt/`, `/[new-package]/`
- No extra cost, no split authority

---

## 4. Tech Stack (LOCKED)

| Layer | Choice | Reason |
| ----- | ------ | ------ |
| Framework | **Astro** | Static, MDX, fastest for content sites, great multi-package routing |
| Styling | **salt-theme-gen** | Dogfooding — the site IS the demo of the first package |
| Search | **Pagefind** | Static, zero backend, works with Astro out of the box |
| Live demos | **StackBlitz WebContainers** | Fully interactive, in-browser, no login required |
| Deployment | **Vercel** | Already in stack, zero config with Astro |

> The site styling itself with salt-theme-gen is a feature, not decoration.
> Every visitor sees the library working live the moment they land.

---

## 5. Site Architecture

```
learn.esalt.net/
├── /                              → Hub landing (all packages, vision, quick links)
│
├── /salt-theme-gen/               → Package landing (what, why, install)
│   ├── /guide/                    → Core tutorial (11 chapters, sequential)
│   │   ├── introduction
│   │   ├── quick-start
│   │   ├── core-concepts
│   │   ├── presets
│   │   ├── accessibility
│   │   └── advanced
│   ├── /integrations/             → Per-framework guides
│   │   ├── react
│   │   ├── next-js
│   │   ├── vue
│   │   ├── nuxt
│   │   ├── astro
│   │   ├── sveltekit
│   │   ├── remix
│   │   ├── solid-js
│   │   ├── angular
│   │   ├── vanilla-js
│   │   ├── tailwind-css
│   │   ├── css-in-js
│   │   ├── sass
│   │   ├── react-native         → salt-theme-gen + react-native-salt pair
│   │   ├── expo                 → pair guide
│   │   └── storybook
│   ├── /api/                      → Full API reference
│   └── /ai/                       → AI resources (llms.txt, prompt templates, MCP)
│
├── /react-native-salt/            → Phase 2 (structure mirrors salt-theme-gen)
│   ├── /guide/
│   ├── /integrations/
│   └── /api/
│
├── /playground/                   → Shared interactive theme builder
└── /changelog/                    → Per-package version history
```

---

## 6. Content Plan — salt-theme-gen (Phase 1)

### 5.1 Core Guide (`/salt-theme-gen/guide/`)

Beginner-friendly throughout. No assumed knowledge beyond basic JS.

| # | Chapter | Covers |
| - | ------- | ------ |
| 1 | Introduction | What is OKLCH? Why salt-theme-gen? The one-color philosophy |
| 2 | Quick Start | Install, first `generateTheme()`, see output in 5 min |
| 3 | Understanding the Output | SemanticColors, StateColors, SurfaceElevation |
| 4 | Color Presets | 20 nature presets, custom hue/chroma input |
| 5 | Design Scale Presets | Spacing, radius, font size presets |
| 6 | Accessibility Built-in | AccessibilityReport, ContrastEntry, WCAG AA |
| 7 | ColorHarmony & Accents | quaternary, complementary, analogous, triadic |
| 8 | Adjusting Themes | `adjustTheme()` for post-creation tweaks |
| 9 | Comparing Themes | `diffTheme()` for design audits |
| 10 | Validation | `parseThemeJSON()` for API/storage round-trips |
| 11 | TypeScript Integration | Full type reference, generics, strict mode |

### 5.2 Integration Guides (`/salt-theme-gen/integrations/`)

Each guide opens with the pain point it solves, then follows the same template:

1. The pain (what breaks without this guide)
2. Install + where to call `generateTheme()`
3. How to apply tokens (CSS vars, StyleSheet, config extension)
4. Light/dark mode switching
5. Live StackBlitz demo
6. Common patterns & gotchas

#### Web frameworks

| Framework | Key Bridge Concept | Developer pain solved |
| --------- | ----------------- | --------------------- |
| **React** | CSS custom properties via `useTheme` hook + Context | Colors scattered in component files with no system |
| **Next.js** | `next-themes` + SSR-safe token injection | Dark mode flicker on hydration |
| **Vue 3** | Provide/inject or Pinia store | Global color state with no structure |
| **Nuxt 3** | Server-side token injection + `useColorMode` | SSR dark mode without flash (Vue ecosystem) |
| **Astro** | CSS custom properties in `<style is:global>`, island-safe | Static sites with no JS theming solution |
| **SvelteKit** | Svelte stores + CSS custom properties | Reactive theming with minimal boilerplate |
| **Remix** | Root loader + cookie-based mode preference | SSR dark mode without flash (React ecosystem) |
| **Solid.js** | `createSignal` + CSS custom properties | Fine-grained reactive theming |
| **Angular** | `ThemeService` + CSS custom properties | Enterprise apps with no token standard |
| **Vanilla JS** | CSS variables on `:root`, zero dependencies | Any project without a framework |

#### Styling layers

| Tool | Key Bridge Concept | Developer pain solved |
| ---- | ----------------- | --------------------- |
| **Tailwind CSS** | Extend `tailwind.config.js` via CSS vars | Design tokens that don't match Tailwind's palette |
| **CSS-in-JS** (styled-components / emotion) | `ThemeProvider` with generated token object | JS themes that go stale when brand colors change |
| **Sass/SCSS** | Export tokens as SCSS variables or CSS vars | Legacy codebases with Sass-based design systems |

#### Mobile & cross-platform

| Platform | Key Bridge Concept | Pair integration |
| -------- | ----------------- | ---------------- |
| **React Native** | StyleSheet token object from `generateTheme()` | Full salt-theme-gen + react-native-salt pair shown |
| **Expo** | Same as React Native + EAS OTA-safe token delivery | Full pair shown |

#### Design tooling

| Tool | Key Bridge Concept | Developer pain solved |
| ---- | ----------------- | --------------------- |
| **Storybook** | Global decorator that injects theme tokens | Stories using hardcoded colors instead of design tokens |

#### The salt-theme-gen + react-native-salt designed pair

These two packages are built as a pair — not two independent libraries that happen to work together. `salt-theme-gen` generates the theme; `react-native-salt` consumes it as its token source. Together they give you a single source of truth for web and mobile — one hue value, consistent tokens on both platforms.

The React Native and Expo guides show the full pair integration. This is not a react-native-salt tutorial — it teaches exactly how the two slot together so you never maintain two separate color systems. A dedicated react-native-salt tutorial site will cover the UI kit in depth separately.

### 5.3 AI Resources (`/salt-theme-gen/ai/`)

#### Layer 1 — `llms.txt`

Machine-readable spec for AI coding assistants:

- Full API in plain English
- All type signatures with descriptions
- All 20 color presets listed
- Common usage patterns per framework

#### Layer 2 — Prompt Templates

Ready-to-copy prompts for Claude, Cursor, ChatGPT:

- "Generate a theme for my app"
- "Add salt-theme-gen to my [framework] app"
- "Migrate my hardcoded colors to salt-theme-gen"
- Per-framework prompts

#### Layer 3 — MCP Server (Phase 2, ~2 months out)

- Exposes `generateTheme()` as an MCP tool
- AI assistants call it directly mid-conversation
- Not in scope for launch — prompt templates ship first

---

## 7. Repo Structure

```
e:\salt_theme_gen_tutorial\
├── PLAN.md
│
├── src/                           → Astro site source
│   ├── pages/
│   ├── components/
│   ├── layouts/
│   └── styles/
│
├── content/                       → All written content (MDX)
│   ├── salt-theme-gen/
│   │   ├── guide/                 → 11 guide chapters
│   │   ├── integrations/          → 8 framework guides
│   │   └── ai/                    → llms.txt, prompt templates
│   └── react-native-salt/         → Phase 2 content (empty for now)
│
├── articles/                      → Dev.to + LinkedIn content
│   ├── salt-theme-gen/
│   │   ├── 01-stop-hardcoding-colors/
│   │   │   ├── devto.md           → Full Dev.to article
│   │   │   └── linkedin.md        → Companion LinkedIn post
│   │   ├── 02-quick-start/
│   │   │   ├── devto.md
│   │   │   └── linkedin.md
│   │   └── ...                    → (14 articles total)
│   └── react-native-salt/         → Phase 2 articles
│
├── demos/                         → StackBlitz demo source files
│   ├── salt-theme-gen/
│   │   ├── react/
│   │   ├── next-js/
│   │   ├── vue/
│   │   ├── nuxt/
│   │   ├── astro/
│   │   ├── sveltekit/
│   │   ├── remix/
│   │   ├── angular/
│   │   ├── vanilla-js/
│   │   ├── tailwind/
│   │   ├── react-native/
│   │   └── storybook/
│   └── react-native-salt/
│
└── public/                        → Static assets
```

### LinkedIn post format

Each `linkedin.md` file follows this structure:

```markdown
---
devto: ./devto.md
publish_after: 1h
hashtags: [designsystem, typescript, webdev, ux]
---

[Hook line — one sentence, no emoji]

[2-3 lines of insight — what they learn, what surprised you]

[CTA line — "Full article + live demo →" with Dev.to URL after publishing]
```

---

## 8. Dev.to Series

### salt-theme-gen — "Theme with Intent"

| # | Title | Target keyword | Day |
| - | ----- | -------------- | --- |
| 1 | Stop hardcoding colors — generate your entire theme from one value | OKLCH theme generator | Launch Tue |
| 2 | salt-theme-gen Quick Start: from install to full theme in 5 minutes | salt-theme-gen tutorial | Launch Thu |
| 3 | OKLCH for developers: why it's better than HSL for design systems | OKLCH color | +1 Tue |
| 4 | salt-theme-gen + React: CSS variables + Context pattern | react theme generator | +1 Thu |
| 5 | salt-theme-gen + Next.js: fix dark mode flicker with SSR-safe tokens | next.js dark mode | +2 Tue |
| 6 | salt-theme-gen + Tailwind CSS: extend your config from generated tokens | tailwind theme | +2 Thu |
| 7 | salt-theme-gen + Vue 3: theming with Provide/Inject | vue theme generator | +3 Tue |
| 8 | salt-theme-gen + Nuxt 3: SSR theming with useColorMode | nuxt theming | +3 Thu |
| 9 | salt-theme-gen + Astro: island-safe global theming | astro theming | +4 Tue |
| 10 | salt-theme-gen + SvelteKit: reactive theming with Svelte stores | sveltekit theming | +4 Thu |
| 11 | salt-theme-gen + Angular: a ThemeService pattern | angular theming | +5 Tue |
| 12 | Vanilla JS theming: CSS custom properties with no framework | css custom properties | +5 Thu |
| 13 | salt-theme-gen + React Native: one theme, web and mobile — the designed pair | react native theming | +6 Tue |
| 14 | salt-theme-gen + Remix: SSR dark mode without the flash | remix theming | +6 Thu |
| 15 | salt-theme-gen + Storybook: design-token-first component stories | storybook design tokens | +7 Tue |
| 16 | Built-in accessibility: how salt-theme-gen ensures WCAG AA contrast | wcag accessibility colors | +7 Thu |
| 17 | Color harmonies: quaternary colors and accent generation | color harmony design | +8 Tue |
| 18 | How to write AI prompts that generate perfect themes with Claude/Cursor | ai design system prompt | +8 Thu |
| 19 | Building a theme picker UI: using all 20 nature presets | design system presets | +9 Tue |
| 20 | salt-theme-gen + CSS-in-JS: typed ThemeProvider without the chaos | styled-components theming | +9 Thu |

### react-native-salt — Own tutorial site (separate project)

The react-native-salt UI kit gets its own tutorial site. This series only covers the salt-theme-gen + react-native-salt pair (article #13).

### Article template

```markdown
---
series: Theme with Intent
part: N
stackblitz: [demo URL]
---

# [Title]

> TL;DR: [1 sentence]

## What we're building

[StackBlitz embed or screenshot]

## Prerequisites

- [list — kept minimal, beginner-friendly]

## Step 1 — ...

...

## Result

[final code snippet + live demo link]

## What's next

Part N+1: [title and link]

---

*Part N of the [Theme with Intent](series link) series.*
*[salt-theme-gen on npm](https://npmjs.com/package/salt-theme-gen) · [esalt.net](https://esalt.net)*
```

---

## 9. Posting Schedule (LOCKED)

2 articles/week — **Tuesday + Thursday**, ~9–10 AM UTC

- Tuesday: highest discovery traffic (developers browsing after settling into the week)
- Thursday: second peak before the weekend wind-down
- LinkedIn post: same day, ~1 hour after the Dev.to article goes live

| Phase | Tuesday | Thursday |
| ----- | ------- | -------- |
| Build weeks 1–6 | site + content in progress | site + content in progress |
| Launch week | #1 — Stop hardcoding colors | #2 — Quick Start |
| +1 week | #3 — OKLCH for devs | #4 — React |
| +2 weeks | #5 — Next.js | #6 — Tailwind |
| +3 weeks | #7 — Vue 3 | #8 — Nuxt 3 |
| +4 weeks | #9 — Astro | #10 — SvelteKit |
| +5 weeks | #11 — Angular | #12 — Vanilla JS |
| +6 weeks | #13 — React Native (pair) | #14 — Remix |
| +7 weeks | #15 — Storybook | #16 — Accessibility |
| +8 weeks | #17 — Color harmonies | #18 — AI prompts |
| +9 weeks | #19 — Theme picker UI | #20 — CSS-in-JS |

---

## 10. Build Calendar

| Week | Deliverables |
| ---- | ------------ |
| Week 1 | Astro scaffold, `learn.esalt.net` DNS, salt-theme-gen wired as site theme, repo structure |
| Week 2 | Core guide chapters 1–6 (beginner tone + pain-point framing established) |
| Week 3 | Core guide chapters 7–11, React + Next.js guides + StackBlitz demos |
| Week 4 | Vue 3 + Nuxt 3 + Astro + SvelteKit guides |
| Week 5 | Angular + Vanilla JS + Remix + Solid.js guides |
| Week 6 | React Native pair + Expo pair + Storybook + CSS-in-JS + Sass guides |
| Week 7 | AI resources (llms.txt + prompt templates), site polish, SEO meta |
| Week 8 | Launch — site live, Dev.to series begins |
| Weeks 8–17 | 2 Dev.to articles/week — 20 articles over 10 weeks |
| Month 3 | MCP server scoped; react-native-salt tutorial site planning begins |

---

## 11. Success Metrics (3 months)

| Metric | Target |
| ------ | ------ |
| npm weekly downloads (salt-theme-gen) | 500+ |
| Dev.to cumulative article views | 5,000+ |
| GitHub stars (salt-theme-gen) | 100+ |
| learn.esalt.net unique visitors/month | 1,000+ |
| Consulting inquiries via esalt.net | 2+/month |
