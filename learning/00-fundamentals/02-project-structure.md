---
title: Project Structure
aliases: [Astro Project Layout, Directory Structure]
tags: [astro, fundamentals, tooling]
level: beginner
---

# 02 · Project Structure

> [!abstract] In one line
> Astro only treats one directory as special — `src/pages/`. Everything else is a
> convention you can bend.

## Mental model

Think of the project as **three zones**:

1. **`src/`** — code Astro reads and builds.
2. **`public/`** — files copied verbatim to the output root (no processing).
3. **config + lockfiles + `node_modules/`** — the toolchain.

Everything Astro *invents* lives in `src/`, and only a few subfolders have
meaning.

## The tree that actually matters

```
your-project/
├── astro.config.mjs      # the only required config; integrations live here
├── package.json          # scripts: dev / build / preview / check
├── tsconfig.json         # usually just extends "astro/tsconfigs/strict"
├── public/               # copied as-is; NOT transformed
│   ├── favicon.svg
│   └── og.png
└── src/
    ├── pages/            # ← the special one: files here become routes
    │   ├── index.astro
    │   └── blog/
    │       ├── index.astro
    │       └── [slug].astro       # dynamic route
    ├── layouts/          # shared page shells (optional convention)
    ├── components/       # reusable UI (optional convention)
    ├── content/          # markdown/data for collections
    ├── content.config.ts # collection schemas + loaders
    ├── styles/           # css imported by layouts/components
    └── assets/           # images/fonts that get processed
```

> [!warning] `public/` vs `src/assets/` — pick deliberately
> `public/` files are copied **untouched** and referenced by URL
> (`/og.png`). `src/assets/` files are **processed** (hashed, optimised) and
> imported in code. Images you want Astro to optimise go in `src/assets/`
> ([[63-images-assets]]); files that must keep an exact name/path go in `public/`.

## How it works

- **`astro.config.mjs`** — `site`, `base`, `output`, adapters, integrations.
  This repo uses `base: "/site"` because GitHub Pages serves project sites under
  a subpath. That one line is why every internal URL in the repo goes through a
  base-prefixing helper rather than being written by hand.
- **`src/pages/`** — the router. Each file exports a component *and* can export
  things like `prerender`, `getStaticPaths` ([[04-routing]]).
- **`src/content/` + `content.config.ts`** — markdown organised into typed
  collections ([[11-content-collections]]).
- **`package.json` scripts** — `dev`, `build`, `preview`; add `check` for types.

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "typecheck": "astro check"
  }
}
```

## What is a *convention* (not a rule)

`layouts/`, `components/`, `styles/`, `assets/`, `lib/` are **your** folders.
Astro neither requires nor auto-registers them; they're just neatly organised
code you import by path. You could rename them all and nothing would break —
except the `@/` alias in `tsconfig`, which points at `src/`.

## Gotchas

> [!warning] Putting processed images in `public/`
> Astro can't optimise what it never sees. If you want responsive `srcset` from
> `<Image>`, the file belongs in `src/assets/`.

> [!warning] Expecting `public/` to be a route
> `public/robots.txt` is served at `/robots.txt` — but on a project site under
> `/site/`, that's `/site/robots.txt`, which **crawlers ignore** (they only read
> the origin root). Good to know before you "fix SEO" with it ([[15-feeds-sitemap-seo]]).

> [!warning] Editing `dist/`
> `dist/` is build output and is regenerated on every build. Never edit it.

## Exercise

- [ ] In this repo, find where `og.png` lives and why it's in `public/` rather
      than `src/assets/`.
- [ ] Find the two files that import the self-hosted fonts and describe how fonts
      flow from `src/assets/fonts/` to a `<link rel="preload">`.
- [ ] Move nothing, but sketch: if you renamed `src/components/` to
      `src/ui/`, which imports would break and why?

> [!question]- Why does Astro only make `src/pages/` special?
> Because routing is the one thing the framework must own to build a site. Layouts,
> components, and helpers are just modules — framework-agnostic organisation that
> you stay in control of.

## Further reading
- Astro — *Project structure* <https://docs.astro.build/en/basics/project-structure/>
- Astro — *Configuration reference* <https://docs.astro.build/en/reference/configuration-reference/>

Prev: [[01-why-astro]] · Next: [[03-astro-files]] · Index: [[00-index]]
