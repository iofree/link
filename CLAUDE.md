# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page personal "link in bio" site (顾惜朝 / Allen's homepage at https://iofree.xyz) linking to
the IOFree apps (人生笔记 / 人生规划局 / 不忘提醒 / PasteQ) and social profiles. It began as a fork of
[LittleLink](https://littlelink.com) but has been **fully redesigned** into a custom "aurora glass +
editorial" look. It is pure static **HTML/CSS/vanilla JS — no build step, no package manager, no tests,
no framework**. The design is **dark-theme only** (the aurora aesthetic depends on a dark background).

Despite living in the IOFree monorepo, it is unrelated to the Flutter apps / Go API in the parent
`../../CLAUDE.md`. Treat it as standalone. The redesign spec lives at
`docs/superpowers/specs/2026-06-03-link-redesign-design.md`.

## Running locally

Nothing to compile. Serve over HTTP and open it:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

- **Do not open via `file://`.** `js/i18n.js` loads the English strings with `fetch()`, which CORS blocks
  on `file://` — language toggle to English would silently fail. (Chinese is the inline default and works
  without fetch, so the page isn't blank, but always test over HTTP.)
- **App icons load from Apple's CDN** (`is1-ssl.mzstatic.com`), so they only appear when online. This is
  intentional (leverages Apple's CDN). Twitter/YouTube icons are local SVGs.
- `.devcontainer/` ships the VS Code Live Server extension for this.

## Architecture

- `index.html` — the whole page. Layers: aurora background (`.aurora` + blobs + `.aurora__veil` +
  `.aurora__grain`), a `.lang` toggle button, then `.page` containing hero → app cards (`.links` /
  `.link-card`) → socials (`.socials` / `.social`) → footer. The **Chinese text is inlined** as the
  default content (also the no-JS / SEO fallback).
- `css/style.css` — all styling. Design tokens are CSS custom properties in `:root` (colors, the
  `--violet/--cyan/--pink/--blue` aurora palette, `--serif/--mono/--sans` font stacks, `--maxw`). Uses
  system font stacks only (no webfonts). Honors `@media (prefers-reduced-motion: reduce)` by disabling
  every animation/transition.
- `js/i18n.js` + `js/i18n/{zh,en}.json` — the bilingual system (see below).
- `images/` — `me.jpeg` (avatar + favicon) and `icons/{twitter,youtube}.svg`. App and 小红书/微博 icons
  are **remote** `mzstatic.com` URLs referenced directly in `index.html`.

## i18n system

- **First visit:** language is auto-detected from the browser — `navigator`'s primary language starting
  with `zh` → Chinese, otherwise English. **After a manual toggle**, the choice is saved to
  `localStorage['preferred-language']` and always wins over detection on later visits. Chinese is the
  inline default in `index.html` (no fetch, no flash); English (detected or chosen) lazy-fetches
  `js/i18n/en.json`. An auto-detected language is applied but **not** persisted — only an explicit toggle
  persists.
- Markup contract:
  - `data-i18n="key"` → sets `textContent`. Add `data-i18n-html` to the element if a string must be
    inserted as HTML instead.
  - `data-i18n="key"` **plus** `data-i18n-attr="aria-label"` → translates that *attribute* instead of the
    text (used on the icon-only social buttons).
  - `dict.title` updates `document.title`; `<html lang>` and the `.lang` button label update on switch.
- **Two invariants when editing text:**
  1. `zh.json` and `en.json` **must have identical key sets** (a missing key leaves that element blank in
     that language).
  2. `zh.json` values **must match the Chinese text inlined in `index.html`** (toggling en→zh re-applies
     `zh.json`, so divergence would cause a visible change). When you edit Chinese copy, edit both places.

## Common edits

- **Add an app card:** copy a `.link-card` block in `index.html`. Give its `.link-card__title` and
  `.link-card__desc` new `data-i18n` keys, add those keys to **both** JSON files (and the matching inline
  zh text), and set the icon `src` (a `mzstatic` URL or a local file).
- **Add a social link:** copy a `.social` block; set `href`, the inline `aria-label`, `data-i18n="key"`,
  and `data-i18n-attr="aria-label"`; add the key to both JSONs; icon via `<img>`.
- **Change visible text:** edit the inline Chinese in `index.html` **and** the same key in both JSON files.
- **Tweak look/feel:** edit the `:root` tokens / aurora palette in `css/style.css`. Keep new animations
  inside the `prefers-reduced-motion` guard.

## Constraints

- Dark-theme only (no light/auto mode — aurora needs a dark base).
- No build tools, frameworks, or CSS preprocessors; keep it static and single-column.
- Languages are Chinese + English only.
