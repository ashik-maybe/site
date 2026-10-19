# Site (template)

Static Astro + React (ThemeToggle, MobileNav islands only). Base `/site` (GitHub Pages project site).

- `astro.config.mjs`: site URL, base (`/site`), sitemap filter (excludes `/tags/`), expressive-code themes (Catppuccin Latte/Macchiato with `.dark` selector)
- Font preloads (`@font-face` in `global.css`): self-hosted variable Inter + JetBrains Mono (WOFF2, `/assets/fonts/`)
- Theme: `global.css` — Catppuccin tokens (`:root` Latte / `.dark` Macchiato), `@theme inline`, `@custom-variant dark`, `@layer base`
- Print: `global.css` `@media print` — hides `header`/`footer`, mirrors the light palette over `.dark` (plus prose-invert + expressive-code overrides) so paper reads dark-on-white even from dark mode, appends absolute link URLs
- SEO: `src/lib/seo.ts` (`absolute()` base-prefixes URLs); `main.astro` head contract (canonical + OG + article meta + feed autodiscovery + font preloads + theme script + theme-color sync)
- RSS: full-text `/rss.xml` (`content:encoded` via `experimental_AstroContainer`); `/rss.xml` alias via `rss.xml.ts`
- JSON Feed: `/blog/feed.json` (version 1.1, `content_html` full text via `experimental_AstroContainer`); autodiscovered in head alongside RSS
- Markdown: Sätteri processor (Astro 7 default) + a `headingAnchors` hast visitor in `astro.config.mjs` — h2/h3 text is wrapped in a self-link to its heading id (plain until hover, mauve on hover); Astro's own `heading-ids` plugin adopts those ids, so TOC links match
- Blog index: paginated via `src/pages/blog/[...page].astro` (`pageSize: 2` → `/blog/2/` exists with 3 posts; `Page N of M`, rel prev/next, trailing-slash URLs); post pages get a CSS-only reading-progress bar (`animation-timeline: scroll(root)`, zero JS, `aria-hidden`, posts only)
- Sitemap: `/sitemap-index.xml` (auto); excludes `/tags/` by design (the `/tags/` hub and tag archives are thin, `noindex, follow`)
- Build: `bun run build`; 28 pages; `astro check` must pass; `public/og.png` must exist (shared OG image; per-post OG images not implemented)
- Tooling: `bun run lint` (oxlint — `react` + `typescript` plugins, correctness category; also lints `.astro` scripts), `bun run format` / `format:check` (oxfmt, scope `ts/tsx/astro`; Tailwind class sorting built in for `.tsx` and `.astro`, wired to `global.css` stylesheet + `cn`/`cva`). CI runs lint + format check before build/deploy. Note: `docs/` and `learning/` feed Tailwind's scanner, so a docs-only token (e.g. bare `prose-invert`) can add a dead utility rule

No Playwright verification scripts committed — checks are ad hoc (`grep` assertions against `dist/`).
