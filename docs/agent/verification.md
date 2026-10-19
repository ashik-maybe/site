# Verification (ad hoc — no Playwright committed)

- `bun run build`: must output 28 pages, no errors, `dist/` created.
- `bun run build:ci`: what CI runs (`astro check && astro build`); must pass before deploy.
- `bunx astro check`: must be 0 errors / 0 warnings / 0 hints.
- `bun run lint`: must pass (oxlint — `react` + `typescript` plugins, correctness category; also covers `.astro`); CI-enforced.
- `bun run format:check`: must be clean (oxfmt, scope `ts/tsx/astro`; Tailwind class sorting built in for `.tsx` and `.astro`); `bun run format` writes; CI-enforced.
- `dist/_astro/main.*.css`: must contain `--background`, `bg-background`, `text-foreground`, `.dark{...}` (theme tokens restored).
- `public/og.png`: must exist (1200x630); all page meta references must resolve (verified via grep against `dist/`).
- RSS links: `grep` `dist/blog/rss.xml` for item URLs starting with `/site/blog/` (not `/siteblog/`).
- JSON Feed: parse `dist/blog/feed.json` — `version` = `https://jsonfeed.org/version/1.1`, `feed_url` absolute ending `/site/blog/feed.json`, every item `url`/`id` starts with `https://ashik-maybe.github.io/site/blog/`, `content_html` non-empty, no drafts. Any `dist` page `<head>` contains `type="application/feed+json"`.
- Pagination: `dist/blog/index.html` has `href="/site/blog/2/" rel="next"` (trailing slash) and `Page 1 of 2`; `dist/blog/2/index.html` has `<title>Blog (page 2)`, `href="/site/blog/" rel="prev"`, `Page 2 of 2`; `sitemap-0.xml` lists `/blog/2/` (14 `<loc>`, still 0 `/tags/`).
- Heading anchors: `grep -o '<h2 id="[^"]*"><a href="#[^"]*"' dist/blog/big-o-briefly/index.html` matches every h2; the TOC's `href="#…"` ids all appear among those heading ids (the visitor sets ids; Astro's `heading-ids` adopts them).
- Reading progress: post HTML contains `<div class="reading-progress" aria-hidden="true">`, index pages do not; `dist/_astro/main.*.css` contains `reading-progress-grow`, `scroll(root)`, and `.prose :is(h2,h3)>a`.
- `dist/sitemap-0.xml`: `<lastmod>` on the 8 content pages (blog + projects) only, and no `/tags/` URLs.
- `dist/tags/index.html`: `noindex, follow`; badges with counts for every blog + project tag; linked from the blog and projects indexes; absent from the sitemap (the filter matches `/tags/`).
- `dist/_astro/main.*.css`: contains a `@media print` block (`header,footer{display:none`, `tw-prose-invert` + `ec-codeFg` overrides).
- JSON-LD URLs: must include `/site/` prefix; verify with `grep` for `"@id"` containing `/site/` in `dist/*.html`.
- Font preloads: `dist/index.html` must contain `<link rel="preload" ... inter-... woff2 ...>` and `jetbrains-...`.
- Theme-color sync: `dist/index.html` contains `applyThemeColor` / `MutationObserver` in inline `<script>`.
- View transitions: `dist/index.html` contains `astro-view-transitions-enabled`, the `ClientRouter*.js` module script, and `data-astro-transition-persist="theme-toggle"`. Ad hoc browser check (system Chrome + `playwright-core`, no committed scripts): click-through navigation must keep `window` markers (no full reload), the `dark` class, and both `theme-color` metas in sync after swap; the persisted toggle must be the same DOM node; expressive-code copy buttons must reappear after a client-side navigation into a post; with `reducedMotion: "reduce"` no `::view-transition*` animations may run. `dist/_astro/main.*.css` must contain `::view-transition-group(*)` inside a `prefers-reduced-motion` block.
- Social links: `dist/index.html` contains Discord `discord.com/users/`; no `github.tsx` / `linkedin.tsx` residuals.
- No `Co-authored-by:` or AI trailer in any commit message; author must match `git config user.name` (`Ashik`).

## Post-deploy (live host)

Run against the deployed base after Pages publishes. Re-run each check rather than
trusting one hit: GitHub Pages serves through a CDN (`x-cache` / `age`), so a
stale replica can answer before the new build propagates. Add
`-H 'Cache-Control: no-cache'` to force a miss.

```bash
base=https://ashik-maybe.github.io/site
curl -sS -o /dev/null -w '%{http_code}\n' "$base/nonexistent-abc/"        # 404
curl -sS "$base/nonexistent-abc/" | grep -q "This page doesn't exist"    # custom 404 body
curl -sS "$base/sitemap-0.xml" | grep -o '<lastmod>' | wc -l             # 8
curl -sS "$base/sitemap-0.xml" | grep -o '/tags/' | wc -l                # 0
```

The sitemap is emitted as a single line, so count occurrences with
`grep -o … | wc -l` (plain `grep -c` counts lines and will lie).

- Custom `404.html` **is** served for project sites: a missing `/site/<path>`
  returns HTTP 404 with the branded page (verified live). The old "custom domain
  required" caveat no longer applies.
- `robots.txt` is **not served** at `/site/robots.txt` (returns the custom 404
  page) — expected on a GH Pages project site; keep the file, documented rather
  than deleted.
- If the live `404.html` lacks `noindex` or the sitemap still lists `/tags/`, the
  deploy is older than the current code — redeploy.
