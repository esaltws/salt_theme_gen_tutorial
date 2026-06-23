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
