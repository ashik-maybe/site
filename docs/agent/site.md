# Site (template)

Static Astro + React (ThemeToggle, MobileNav islands only). Base `/site` (GitHub Pages project site).

- `astro.config.mjs`: site URL, base (`/site`), sitemap filter (excludes `/tags/`), expressive-code themes (Catppuccin Latte/Macchiato with `.dark` selector)
- Font preloads (`@font-face` in `global.css`): self-hosted variable Inter + JetBrains Mono (WOFF2, `/assets/fonts/`)
- Theme: `global.css` — Catppuccin tokens (`:root` Latte / `.dark` Macchiato), `@theme inline`, `@custom-variant dark`, `@layer base`
- SEO: `src/lib/seo.ts` (`absolute()` base-prefixes URLs); `main.astro` head contract (canonical + OG + article meta + feed autodiscovery + font preloads + theme script + theme-color sync)
- RSS: full-text `/rss.xml` (`content:encoded` via `experimental_AstroContainer`); `/rss.xml` alias via `rss.xml.ts`
- Feed: `/blog/rss.xml` only; no JSON feed currently
- Sitemap: `/sitemap-index.xml` (auto); excludes `/tags/` by design (tag pages are thin, `noindex, follow`)
- Build: `bun run build`; 26 pages; `astro check` must pass; `public/og.png` must exist (shared OG image; per-post OG images not implemented)

No Playwright verification scripts committed — checks are ad hoc (`grep` assertions against `dist/`).
