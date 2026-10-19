# Agent rules (this template)
- NEVER commit unless the user says so; if committing, author = user only (`git commit --author="..."` or rely on git config — no AI co-author trailers).
- NEVER push unless asked.
- Preserve base `/site`, static output, Bun, Astro, minimal hydration (ThemeToggle + MobileNav only), Catppuccin Latte/Macchiato.
- Design: no ALL-CAPS eyebrows, no `A · B · C` middots, no `01/02/03` markers, no SaaS card grids, no gradient washes. Mauve (`#c6a0f6`) = only accent.
- No invented employers / schools / dates / roles. Placeholders stay clearly placeholder or marked TODO/ask. No private data in repo or docs.
- Docs describe the CURRENT committed template (not owner's real content).
- Terse chat; no over-engineering. Minimal edits; verify with `bun run verify` (lint → format:check → `build:ci` → `check-dist`).
- Key guardrails: all URLs through `src/lib/seo.ts` (`absolute()`); `robots.txt` is inert on GH Pages (documented, not removed); sitemap excludes `/tags/`.

# Pointer map (where to edit)
- Config/site data: `src/config.ts` (title, description, socials, nav, handle)
- Theme + fonts: `src/styles/global.css` (Catppuccin tokens, `@font-face`)
- Head / meta / JSON-LD: `src/lib/seo.ts`, `src/layouts/main.astro`
- Layout: `src/layouts/main.astro`, `src/components/layout/`
- Icons: `react-icons/fa` (brand); `lucide-react` for Mail/RSS
- Pages: `src/pages/` (static Astro `.astro`)
- Blog/post: `src/pages/blog/` + `src/content.config.ts` + `src/content/blog/`
- Projects: `src/pages/projects/` + `src/content.config.ts` + `src/content/projects/`
- Components: `src/components/` (portfolio, blog, layout, ui/shadcn)
- Verification: `bun run verify` (lint → format:check → `build:ci` → `check-dist`); the assertions live in `scripts/check-dist.mjs` and run in both CI and deploy.
