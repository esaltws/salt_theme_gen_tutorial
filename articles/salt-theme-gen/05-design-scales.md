---
title: Design Scale Presets — Spacing, Radius, and Typography in One Option
published: false
description: Three options each for spacing, radius, and font size. Pick a combination and get a consistent scale across every token. Here's what each looks like.
tags: css, design, webdev, ux
series: salt-theme-gen — Design Tokens for Every Framework
cover_image:
---

Colors get all the attention in design systems, but the personality of a UI comes from its scale — the spacing between elements, how rounded the corners are, how large the text is relative to its surroundings.

`salt-theme-gen` gives you three options for each scale as a single argument. Pick a combination; get a consistent scale across every token.

## Spacing scales

```
compact:  xs:3  sm:6  md:12  lg:18  xl:24  xxl:36
default:  xs:4  sm:8  md:16  lg:24  xl:32  xxl:48
spacious: xs:6  sm:12 md:20  lg:32  xl:48  xxl:72
```

```ts
generateTheme({ preset: 'ocean', spacing: 'compact' });
// theme.light.spacing.md === 12

generateTheme({ preset: 'ocean', spacing: 'spacious' });
// theme.light.spacing.md === 20
```

In CSS, both map to `--space-md`. Change the scale option and every spacing value across the entire UI updates without touching component CSS.

**compact** — dashboard UIs, data-dense admin interfaces, developer tools. Information-dense without feeling cramped.

**default** — general-purpose. Marketing sites, SaaS apps, documentation.

**spacious** — consumer apps, landing pages, editorial content. Breathing room communicates quality.

## Radius scales

```
sharp:    sm:0  md:2  lg:4   xl:6   pill:4
default:  sm:4  md:8  lg:12  xl:16  pill:9999
rounded:  sm:8  md:12 lg:16  xl:24  pill:9999
pill:     sm:16 md:24 lg:32  xl:40  pill:9999
```

```ts
generateTheme({ preset: 'slate', radius: 'sharp' });
// theme.light.radius.md === 2  → nearly square corners

generateTheme({ preset: 'coral', radius: 'rounded' });
// theme.light.radius.md === 12 → noticeably rounded
```

**sharp** — developer tools, code editors, admin UIs. Technical, precise.

**default** — general SaaS. Modern without being playful.

**rounded** — consumer apps, health, social. Friendly and approachable.

**pill** — very bold, for apps where rounded shapes are a core design language (some fintech, some mobile-first).

## Font size scales

```
compact:  xs:11 sm:13 md:15  lg:17  xl:19  xxl:22 3xl:28
default:  xs:12 sm:14 md:16  lg:18  xl:20  xxl:24 3xl:30
large:    xs:14 sm:16 md:18  lg:20  xl:22  xxl:28 3xl:36
```

```ts
generateTheme({ preset: 'ocean', fontSize: 'large' });
// theme.light.fontSizes.md === 18
```

**compact** — high information density. Terminal, data grids, admin.

**default** — web standard. Comfortable reading across most contexts.

**large** — accessibility-first, older audiences, reading-heavy content, or just a design statement.

## Personality combinations

| Combination | Spacing | Radius | Font | Feels like |
| --- | --- | --- | --- | --- |
| Corporate | compact | sharp | compact | Bloomberg terminal |
| Modern SaaS | default | default | default | Linear, Vercel |
| Consumer | spacious | rounded | default | Airbnb, Notion |
| Editorial | spacious | default | large | Substack, Medium |
| Dev tool | compact | sharp | compact | VS Code, iTerm |
| Startup | default | rounded | default | Product Hunt, Loom |

## Changing scale without touching components

This is the key benefit: all three scales are abstracted behind token names.

```css
/* This CSS never changes regardless of the scale option */
.card {
  padding:       var(--space-xl);
  border-radius: var(--radius-lg);
  font-size:     var(--text-md);
}
```

Switching from `spacing: 'compact'` to `spacing: 'spacious'` in one `generateTheme()` call changes the values of `--space-xl` across the entire codebase. No grep, no find-and-replace.

## Mixing scales in one app

Scales must match across the app — mixing `compact` spacing with `spacious` cards creates inconsistency. But you can use multiple `generateTheme()` calls for multi-tenant apps:

```ts
const tenantTheme = generateTheme({
  preset:   tenant.brandColor,
  spacing:  tenant.spacingPreference,
  radius:   tenant.radiusPreference,
  fontSize: 'default',
});
```

Each tenant gets a consistent, cohesive scale — different values, same token names.

Next: [salt-theme-gen with React — ThemeContext and CSS injection](https://learn.esalt.net/salt-theme-gen/integrations/react/)

---

*Part of the **salt-theme-gen — Design Tokens for Every Framework** series · Article 5 of 24*

[← 04. Color Presets](./04-color-presets.md) &nbsp;·&nbsp; [06. With React →](./06-react.md)
