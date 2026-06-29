# Distribution Strategy — salt-theme-gen Series

24 articles. Goal: consistent developer discovery, npm installs, and backlinks.

---

## Platforms overview

| Platform | Effort | Audience | When |
|----------|--------|----------|------|
| Dev.to | Already publishing | General dev | Ongoing |
| Reddit | Medium — per post | Targeted | 1 post per 2 days |
| Discord communities | Low — copy/paste | Framework-specific | Same day as article |
| Product Hunt | High — one-time | Broad tech | After site is stable |
| Hacker News | Low — one post | Senior devs | After 3–4 articles live |
| JavaScript Weekly | Low — email submission | JS devs, 50K+ | Per article |
| CSS Weekly | Low — email submission | CSS devs | Per article |
| GitHub Awesome Lists | Low — one PR each | Passive discovery | One-time |
| Twitter/X | Medium — threads | Dev Twitter | Per article |

---

## Platform playbooks

### Dev.to
- Already active. Publish 1 article per 1–2 days.
- Tags that matter: `#webdev`, `#javascript`, `#react`, `#css` — always use all 4 relevant ones.
- Cover images are uploaded per article (SVG covers already generated in `covers/`).
- Series name: **salt-theme-gen — Design Tokens for Every Framework**

---

### Reddit
See `reddit-posts.md` for all 15 pre-written posts and the 29-day schedule.

**Key rules:**
- r/webdev — own content Saturdays only; build karma first (1–2 weeks of comments)
- r/javascript — new accounts auto-removed; wait for account age
- r/nextjs — standalone posts banned; use the weekly Show and Tell thread
- r/reactnative — Rule 1 is no self-promotion; keep posts purely educational
- Never post the same link to two subreddits on the same day

**Account warmup (do this first):**
Before posting any articles, spend 1–2 weeks commenting helpfully on existing threads in r/webdev and r/javascript. Answer questions, add context. This builds karma and account age so posts aren't auto-removed.

---

### Discord communities
Post in `#showcase`, `#share`, or `#resources` channels on the same day as the corresponding article.

| Discord | Channel | Article to share |
|---------|---------|-----------------|
| Tailwind CSS | `#showcase` | Article 11 — Tailwind |
| Next.js | `#showcase` | Article 07 — Next.js |
| Vue Land | `#showcase` | Article 08 — Vue |
| Svelte | `#showcase` | Article 09 — SvelteKit |
| React Native Community | `#libraries` | Article 12, 13 — RN + Expo |
| Angular | `#showcase` | Article 10 — Angular |

**Template for Discord posts:**
```
Just published a guide on wiring up design tokens in [framework] — covers
[specific pain point from the article]. [one sentence on what it shows]

[Dev.to link]
```

Keep it one short paragraph. No bullet lists, no emojis, no marketing copy. Discord mods remove anything that reads like an ad.

---

### Product Hunt
**Timing:** after learn.esalt.net is live on Vercel and stable (≥ 5 articles published on Dev.to).

**What to launch:** the package itself (`salt-theme-gen`), not an article.

**Checklist:**
- [ ] Tagline: "Generate a complete light/dark design system from one color"
- [ ] Description: problem → solution → what you get (21 colors, 32 states, WCAG checks, zero deps)
- [ ] Gallery: screenshots of the learn.esalt.net site + a short code snippet image
- [ ] Link: learn.esalt.net/salt-theme-gen/
- [ ] Topics: Developer Tools, Design, Open Source
- [ ] Post at 00:01 PST (Product Hunt resets at midnight PST — early posts get the most votes)
- [ ] Be in comments all day responding to questions

**One-time effort.** A good PH day can spike npm installs 10–50x and gets picked up by newsletters automatically.

---

### Hacker News
**Post type:** Show HN

**Title format:** `Show HN: salt-theme-gen – generate a complete light/dark design system from one color`

**Timing:** after at least 3–4 Dev.to articles are live and the learn.esalt.net site is polished.

**Rules:**
- Only post once — re-submissions are penalized
- Be in comments for the first 4 hours responding to every reply
- HN readers are senior and skeptical — lead with the technical decisions (why OKLCH, how auto-correction works), not the feature list
- Post on a weekday morning US time (8–10am ET gets the most eyes)

**If it gets traction:** newsletters and aggregators pick it up automatically. If it doesn't, that's fine — it's one post, no ongoing effort.

---

### JavaScript Weekly
**Submit:** https://javascriptweekly.com/submit

**Which articles to submit:**
- Article 01 — Introducing salt-theme-gen (package overview)
- Article 02 — Dark mode in 5 minutes (broadly useful pattern)
- Article 03 — Accessibility built-in (high editorial value)
- Article 23 — AI assistants (timely topic)

**How to submit:** fill out the form with the Dev.to URL and a one-sentence description. Free. Turnaround is 1–3 weeks if accepted. Reach: ~180K subscribers.

---

### CSS Weekly
**Submit:** https://css-weekly.com/submit/

**Which articles:**
- Article 02 — Dark mode flash fix (CSS pattern, not package-specific)
- Article 11 — Tailwind integration
- Article 03 — Accessibility / WCAG

**Reach:** ~30K subscribers. More targeted to pure CSS audience.

---

### GitHub Awesome Lists
One-time PRs. Submit and forget — they're permanent and show up in GitHub search and Google.

| List | URL | Entry to add |
|------|-----|-------------|
| awesome-css | github.com/awesome-css-group/awesome-css | Under "Preprocessors / Tools" |
| awesome-design-systems | github.com/alexpate/awesome-design-systems | Under "Tools" |
| awesome-tailwindcss | github.com/aniftyco/awesome-tailwindcss | Under "Tools & Plugins" |

**PR template:**
```
Add salt-theme-gen — zero-dependency design token generator (OKLCH, light/dark, WCAG checks)
```

---

### Twitter/X
Thread format outperforms single link posts. Each thread = one article condensed into 4–6 tweets.

**Thread structure:**
- Tweet 1: the pain point (hook — no link yet)
- Tweet 2–4: the key insight or code snippet
- Tweet 5: "wrote this up in full →" + link

**Which articles translate well to threads:**
- Article 01 — dark mode two-file problem
- Article 02 — the synchronous script trick
- Article 03 — WCAG checks at build time
- Article 24 — Flutter bridge (surprising/novel)

**Timing:** Tuesday–Thursday, 9–11am ET.

---

## Publishing order and cross-posting tracker

| # | Article | Dev.to | Reddit | Discord | Newsletter |
|---|---------|--------|--------|---------|------------|
| 01 | Introducing | ✅ | r/webdev + r/javascript | — | JS Weekly |
| 02 | Dark mode | ✅ | r/webdev + r/javascript | — | JS Weekly, CSS Weekly |
| 03 | Accessibility | — | r/webdev | — | CSS Weekly |
| 04 | Color presets | — | — | — | — |
| 05 | Design scales | — | — | — | — |
| 06 | React | — | r/reactjs | — | — |
| 07 | Next.js | — | r/nextjs (Show & Tell) | Next.js Discord | — |
| 08 | Vue | — | r/vuejs | Vue Land Discord | — |
| 09 | SvelteKit | — | r/sveltejs | Svelte Discord | — |
| 10 | Angular | — | r/angular | Angular Discord | — |
| 11 | Tailwind | — | r/tailwindcss | Tailwind Discord | CSS Weekly |
| 12 | React Native | — | r/reactnative | RN Discord | — |
| 13 | Expo | — | r/reactnative | RN Discord | — |
| 14 | Astro | — | r/astro | — | — |
| 15–18 | Remix/CSS-in-JS/Storybook/Sass | — | skip | — | — |
| 19–22 | adjustTheme/diff/validation/TS | — | skip | — | — |
| 23 | AI assistants | — | r/webdev | — | JS Weekly |
| 24 | Flutter | — | r/FlutterDev | — | — |

---

## Account warmup schedule (do before posting)

**Week 1–2 (before first Reddit post):**
- Comment on 3–5 threads per day in r/webdev and r/javascript
- Answer questions, add context, be genuinely helpful
- No links to own content yet

**Week 3:**
- Start Reddit posts per the schedule in `reddit-posts.md`
- Submit Article 01 and 02 to JavaScript Weekly

**Week 4+:**
- Continue Reddit schedule
- Post in Discord on same day as each framework article
- Submit Product Hunt when site traffic is stable

---

## What not to do

- Don't post the same link to two subreddits the same day (spam filter)
- Don't post link dumps without context — write real post bodies
- Don't cross-post articles 04, 05, 15–22 to Reddit (too package-specific, no standalone pain point)
- Don't launch Product Hunt before the site is polished
- Don't add more platforms until Reddit and Discord are consistently working





New Stratigy without introducing salt-theme-gen in the title. Focus on the pain point and solution, not the package name.

# 1-Month Developer Teaching Content Plan

Goal: teach frontend developers practical solutions first.
Do not promote the package directly at the beginning.
Mention `salt-theme-gen` softly only after trust is built.

Main themes:

* dark mode
* CSS variables
* design tokens
* accessibility
* cross-platform theming
* React / React Native theme structure

---

# DEV.to Article Plan

## Week 1 — Dark Mode Basics

### Article 1

**Title:** A Practical CSS Variable Setup for Light/Dark Mode Without Theme Flash

**Summary:**
Show how to build light/dark mode using CSS variables, `data-theme`, `prefers-color-scheme`, `localStorage`, and a synchronous inline script in `<head>` to prevent the wrong theme from flashing on page load.

**Core pain point:**
Dark mode flashes before JavaScript applies the saved theme.

---

### Article 2

**Title:** Why Your Dark Mode Flashes Before JavaScript Runs

**Summary:**
Explain why theme flash happens from the browser rendering pipeline perspective. Cover HTML parsing, CSS application, deferred JavaScript, localStorage timing, and why inline scripts in `<head>` solve the issue.

**Core pain point:**
Developers often store theme preference correctly but apply it too late.

---

## Week 2 — CSS Variables and Token Structure

### Article 3

**Title:** Stop Naming CSS Variables After Colors

**Summary:**
Explain why `--blue-600` and `--gray-900` are less maintainable than semantic variables like `--color-background`, `--color-text`, `--color-primary`, and `--color-on-primary`.

**Core pain point:**
Color-name variables make dark mode and redesigns harder.

---

### Article 4

**Title:** A Simple CSS Variable Structure for Buttons, Cards, and Forms

**Summary:**
Show a practical token structure for common UI components: background, surface, text, muted text, border, primary button, secondary button, danger state, success state, and disabled state.

**Core pain point:**
Developers often create CSS variables randomly without a clear system.

---

## Week 3 — Accessibility and Contrast

### Article 5

**Title:** Why Good-Looking Colors Can Still Fail WCAG Contrast

**Summary:**
Explain contrast ratio, normal text threshold, large text threshold, and why visually attractive colors can be unreadable. Include button text, muted text, and warning colors.

**Core pain point:**
Developers assume visual beauty means accessibility.

---

### Article 6

**Title:** The Button Contrast Problem Most Design Systems Ignore

**Summary:**
Focus on `background + foreground` pairs: primary button with `onPrimary`, danger button with `onDanger`, warning button with `onWarning`. Explain why every background token needs a readable foreground token.

**Core pain point:**
Developers pick button background colors but forget the text color contract.

---

## Week 4 — Design Tokens in Real Projects

### Article 7

**Title:** How to Structure Design Tokens for Light and Dark Mode

**Summary:**
Show a simple theme object structure with `light` and `dark` modes. Cover colors, states, spacing, radius, font sizes, and accessibility checks as separate token groups.

**Core pain point:**
Dark mode becomes messy when tokens are not structured from the beginning.

---

### Article 8

**Title:** Why Dark Mode Should Not Be a Second CSS File

**Summary:**
Explain why maintaining separate `light.css` and `dark.css` files leads to duplication and drift. Show how shared semantic variables keep components mode-independent.

**Core pain point:**
Two separate theme files become inconsistent over time.

---

## Week 5 — Cross-Platform Theming

### Article 9

**Title:** Web CSS Variables vs React Native Theme Objects

**Summary:**
Compare how theming works on the web and in React Native. Explain why web uses CSS variables while React Native usually needs JavaScript theme objects.

**Core pain point:**
Developers struggle to keep web and mobile themes consistent.

---

### Article 10

**Title:** How I Think About Cross-Platform Design Tokens

**Summary:**
Explain a platform-neutral token model: color, spacing, radius, typography, states, and accessibility. Show how the same source can produce CSS variables for web and theme objects for React Native.

**Core pain point:**
Teams duplicate design decisions across web, mobile, and documentation.

---

# 25 LinkedIn Post Titles

## Dark Mode

1. Dark mode usually breaks in one place: page load
2. Why your dark mode flashes before JavaScript runs
3. The tiny inline script that prevents theme flash
4. `data-theme` vs `prefers-color-scheme`: when to use each
5. Your components should not care about light or dark mode
6. Dark mode is not just changing background color
7. Why `color-scheme` matters in dark mode
8. The simplest light/dark mode setup I use

## CSS Variables

9. Stop naming CSS variables after colors
10. `--blue-600` is not a design system
11. Semantic CSS variables make dark mode easier
12. A button does not need blue; it needs meaning
13. Why `--color-on-primary` is an underrated token
14. How I structure CSS variables for real UI components
15. CSS variables are the simplest design-token runtime
16. The difference between color variables and design tokens

## Accessibility

17. Good-looking colors can still fail accessibility
18. The button contrast problem most developers miss
19. Why yellow warning text often fails WCAG contrast
20. Every background color needs a readable foreground color
21. Accessibility should start before component CSS
22. Contrast bugs are easier to prevent than fix later

## Design Tokens

23. Design tokens are not just colors
24. Dark mode should not be a second CSS file
25. Hover, pressed, focused, disabled: these are tokens too
26. A practical design-token structure for small projects
27. What should go inside a frontend theme object?
28. The hidden cost of hardcoded UI values

## Cross-Platform

29. Web theming and React Native theming are not the same
30. CSS variables do not exist in React Native, so what is the alternative?
31. How to keep web and mobile themes consistent
32. Cross-platform design tokens should start from meaning, not platform
33. One token source, different platform outputs

---

# Recommended Weekly Rhythm

## Monday

Publish one DEV.to article.

## Tuesday

Post a LinkedIn summary of the article without the link in the main post.

## Wednesday

Post one small code snippet from the article.

## Thursday

Publish the second DEV.to article.

## Friday

Post a question-based LinkedIn post to invite comments.

Example:

“Do you use `data-theme`, Tailwind dark mode, or React context for dark mode?”

---

# Soft Package Reintroduction Strategy

For the first 2 weeks:

Do not mention the package in the title or opening.

For weeks 3–4:

Mention softly near the end:

“I’m collecting these patterns while working on a small design-token tool.”

For week 5:

Mention more clearly:

“I later turned this structure into `salt-theme-gen`, but the pattern works without any package.”

The priority is trust first, package second.
