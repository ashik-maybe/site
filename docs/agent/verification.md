# Verification (no Playwright committed)

- **`bun run verify`** is the gate: `lint` → `format:check` → `build:ci`
  (`astro check` + `astro build` + `pagefind --site dist`) →
  `node scripts/check-dist.mjs`. Both workflows run it (CI on `pull_request`,
  deploy on `push` to `main`), so a developer cannot forget a gate CI has.
- `scripts/check-dist.mjs` asserts 78 properties of `dist/` (base path, routes,
  Pagefind index, sitemap contents and exclusions, islands and their
  hydration directives, prefetch chunks, theme/print/reduced-motion CSS, the base
  `--radius` token, per-page container alignment, per-post
  OG PNG dimensions, feeds, tags hub, deployment stamp). It reads `base` from
  `astro.config.mjs` and the collection file names from `src/content/`, so it
  needs no edits when content is added. Pass `--expect-sha <sha>` to also require
  `dist/build.txt` (what the deploy workflow stamps into the artifact).
- `bun run build` on its own: 29 pages, then Pagefind reports `Indexed 3 pages`
  (posts only). `bunx astro check`: 0 errors / 0 warnings / 0 hints.
- `bun run lint` (oxlint — `react` + `typescript` plugins, correctness category;
  also covers `.astro`) and `bun run format:check` (oxfmt, scope `ts/tsx/astro`;
  Tailwind class sorting built in) must both be clean; `bun run format` writes.
- Per-post OG images: `dist/og/blog/<id>.png` exists for every published post and
  `dist/og/projects/<id>.png` for every project, each a 1200×630 PNG (dimensions
  read from the PNG header by `check-dist`); post/project HTML has `og:image` /
  `twitter:image` = absolute `/site/og/…`, `og:image:alt` = the title, and
  JSON-LD `"image"` matching; `image` is passed site-relative (the layout calls
  `absolute()`), and `check-dist` fails on any page containing `/site/site/`.
  Pages without their own card still reference `/site/og.png`; sitemap has no
  `/og/`. Rendering check without vision (Chrome + `createImageBitmap`,
  `/tmp/opencode/vt-test/og-projects.mjs`): sample pixels — corners `#eff1f5`,
  the 56×4 mauve bar at x80/y72 is `#c6a0f6`, and ink pixels scale with title
  length. `check-dist` covers presence, size and references; this pixel pass is
  the manual extra.
- RSS links: `grep` `dist/blog/rss.xml` for item URLs starting with `/site/blog/` (not `/siteblog/`).
- JSON Feed: parse `dist/blog/feed.json` — `version` = `https://jsonfeed.org/version/1.1`, `feed_url` absolute ending `/site/blog/feed.json`, every item `url`/`id` starts with `https://ashik-maybe.github.io/site/blog/`, `content_html` non-empty, no drafts, and every item `image` = the same absolute `/site/og/blog/<id>.png` its page advertises as `og:image`. Any `dist` page `<head>` contains `type="application/feed+json"`.
- Pagination: `dist/blog/index.html` has `href="/site/blog/2/" rel="next"` (trailing slash) and `Page 1 of 2`; `dist/blog/2/index.html` has `<title>Blog (page 2)`, `href="/site/blog/" rel="prev"`, `Page 2 of 2`; `sitemap-0.xml` lists `/blog/2/` (14 `<loc>`, still 0 `/tags/`).
- Heading anchors: `grep -o '<h2 id="[^"]*"><a href="#[^"]*"' dist/blog/big-o-briefly/index.html` matches every h2; the TOC's `href="#…"` ids all appear among those heading ids (the visitor sets ids; Astro's `heading-ids` adopts them).
- Reading progress: post HTML contains `<div class="reading-progress" aria-hidden="true">`, index pages do not; `dist/_astro/main.*.css` contains `reading-progress-grow`, `scroll(root)`, and `.prose :is(h2,h3)>a`.
- `dist/sitemap-0.xml`: `<lastmod>` on the 8 content pages (blog + projects) only, and no `/tags/` URLs.
- `dist/tags/index.html`: `noindex, follow`; badges with counts for every blog + project tag; linked from the blog and projects indexes; absent from the sitemap (the filter matches `/tags/`).
- `dist/_astro/main.*.css`: contains a `@media print` block (`header,footer{display:none`, `tw-prose-invert` + `ec-codeFg` overrides).
- JSON-LD URLs: must include `/site/` prefix; verify with `grep` for `"@id"` containing `/site/` in `dist/*.html`.
- Font preloads: `dist/index.html` must contain `<link rel="preload" ... inter-... woff2 ...>` and `jetbrains-...`.
- Theme-color sync: `dist/index.html` contains `applyThemeColor` / `MutationObserver` in inline `<script>`.
- Search: `dist/pagefind/` exists (the engine is still Pagefind); build log says `Indexed 3 pages` (the posts); `grep -l data-pagefind-body dist/blog/*/index.html | wc -l` = 3 and no other page carries it; `dist/search/index.html` has `noindex, follow`, our own `data-search-input`/`data-search-results` markup, a reference to `/pagefind/pagefind.js`, and **no** `pagefind-component-ui.*` or `<pagefind-*>` elements; sitemap still has 14 `<loc>` and no `/search/`. Its section container must equal the blog index's (`max-w-5xl px-4 py-16 sm:px-6`) so the heading lines up with the header brand. The page must carry no extra island (same `astro-island` count as `dist/index.html`). Ad hoc browser check with Chrome + `playwright-core`, `/tmp/opencode/vt-test/search-hybrid.mjs` (34 assertions): input renders (44px, radius equal to the site's other shadcn controls), idle state shows at rest, a query renders rows whose links all start with `/site/blog/` and whose excerpts contain `<mark>`, the status live region announces the count, a nonsense query shows the `empty` state, clearing restores `idle`, no console errors, dark mode follows the Macchiato tokens, the design rules hold (no all-caps heading, dashed hairline, 16px icon, link-as-button), and the `<noscript>` fallback is visible. The `unavailable` state is checked by hiding `dist/pagefind/` and asserting the input is disabled and only that panel shows (`/tmp/opencode/vt-test/unavailable.mjs`). **Client-nav check (do not skip):** click the nav link into `/search`, assert the input keeps the site's styling (not pagefind's stock `36px`/`6px`/white), that searching still works, that no island is added, and that dark mode persists across the swap. **Dev check:** with `dist/` built, `astro dev` must serve `/site/pagefind/pagefind.js` (200) via the `pagefindDev()` plugin and a typed query must render rows — see `/tmp/opencode/vt-test/devsearch.mjs`. `/tmp/opencode/vt-test/dev-clean.mjs` asserts no page logs console errors in dev (the `ClientRouter` transition virtual modules are in `optimizeDeps.include`, without which Vite re-optimizes mid-session and every dev page 504s `Outdated Optimize Dep` and retries island hydration).
- Container alignment: every page's `<main>` section uses `mx-auto w-full max-w-5xl px-4 py-16 sm:px-6` (checked against `dist/blog/index.html`); the header's inner row is `max-w-5xl px-4 sm:px-6`, so the brand sits at x=148 and page headings at x=152. A page on a narrower column (`max-w-3xl`) starts its heading ~128px further in and reads as misaligned. `/tmp/opencode/vt-test/content-align.mjs` measures the first child's x on every route.
- Base radius: `:root` must define `--radius` (`.625rem`); `rounded-sm|md|lg|xl|2xl` all resolve through it, so its absence makes `border-radius: var(--radius)` invalid and squares every shadcn control. `check-dist` asserts the token exists; `/tmp/opencode/vt-test/radius-check.mjs` confirms controls resolve to non-zero radii.
- View transitions: `dist/index.html` contains `astro-view-transitions-enabled`, the `ClientRouter*.js` module script, and `data-astro-transition-persist="theme-toggle"`. Ad hoc browser check (system Chrome + `playwright-core`, no committed scripts): click-through navigation must keep `window` markers (no full reload), the `dark` class, and both `theme-color` metas in sync after swap; the persisted toggle must be the same DOM node; expressive-code copy buttons must reappear after a client-side navigation into a post; with `reducedMotion: "reduce"` no `::view-transition*` animations may run. `dist/_astro/main.*.css` must contain `::view-transition-group(*)` inside a `prefers-reduced-motion` block.
- Social links: `dist/index.html` contains Discord `discord.com/users/`; no `github.tsx` / `linkedin.tsx` residuals.
- No `Co-authored-by:` or AI trailer in any commit message; author must match `git config user.name` (`Ashik`).
- Deploy workflow: `.github/workflows/deploy.yml` parses as YAML, has exactly one job (`deploy`); triggers `push` on `main`, `workflow_dispatch` and a weekly `schedule`; steps in order: checkout@v7, setup-bun@v2 (`with: bun-version-file: .bun-version`), `bun install --frozen-lockfile`, `Lint, build, and verify dist` (`bun run verify`), `Stamp build` (`echo "$GITHUB_SHA" > dist/build.txt` then `node scripts/check-dist.mjs --expect-sha "$GITHUB_SHA"`), `upload-pages-artifact@v5` (`path: dist`), `deploy-pages@v5`, `Verify the live site serves this commit`; `timeout-minutes: 15`; permissions `contents: read` / `pages: write` / `id-token: write`; `concurrency.group: pages` with `cancel-in-progress: false`. Timing picture from the Actions API (per-step `started_at`/`completed_at`): install 2–4s, lint/format/build/checks, publish 6–75s (GitHub-side, varies); a healthy run is ~40–62s end to end. A run that sits `queued` with no runner and zero steps is GitHub-side (check `https://www.githubstatus.com/api/v2/components.json` for an Actions/Pages incident) — it is not a workflow-configuration problem, and re-running or waiting is the fix.
- Deploy verification step: polls `page_url/build.txt?run=$GITHUB_RUN_ID-$attempt` up to 20×15s for the commit SHA, then requires 200 from `pagefind/pagefind.js` and `sitemap-index.xml`. Both branches exercised locally against `astro preview` (`PAGE_URL`/`EXPECTED` env, matching and mismatched SHA): success prints the matching SHA and both 200s; mismatch retries, prints the `::error::`, echoes the live Actions/Pages status + any open incident, exits 1. After a real deploy, `curl -sS https://ashik-maybe.github.io/site/build.txt` must equal `git rev-parse main`; in the repo the stamp is created only by the workflow, so `dist/build.txt` is absent from local builds by design.
- `.bun-version` (repo root) is the single toolchain pin; both workflows pass it via `setup-bun`'s `bun-version-file`. Verify `bun --version` matches it locally (`1.4.3`).
- CI workflow: `.github/workflows/ci.yml` parses as YAML, triggers on `pull_request` + `workflow_dispatch`, permissions only `contents: read`, one `check` job with `timeout-minutes: 10`: checkout@v7 → setup-bun@v2 (`bun-version-file: .bun-version`) → `bun install --frozen-lockfile` → `bun run verify` (lint, format check, type-check, build, dist assertions — steps intentionally mirror deploy).
- Prefetch: `dist/index.html` contains `<script type="module" src="/site/_astro/page.*.js">` (Astro's prefetch loader, which only warms links on hover — the chunk `dist/_astro/prefetch.*.js` carries `mouseenter`/`focusin`/`touchstart` handling); `dist/_astro/` contains that `page.*.js` + `prefetch.*.js`.
- Hydration split: `dist/index.html` has two islands — ThemeToggle with `client="idle"` (+ `data-astro-transition-persist="theme-toggle"`), MobileNav with `client="media"` and `opts` media `(max-width: 767px)`. Ad hoc browser check (system Chrome + `playwright-core`, `/tmp/opencode/vt-test/prefetch-island.mjs`): at 1280×900 the MobileNav island keeps its `ssr` attribute (unhydrated), `MobileNav.*.js` is never requested, zero link prefetches happen on load, hovering `/site/projects` in the primary nav fires exactly one `/site/projects` request, and clicking it still client-navigates (window marker survives, no reload); at 375×800 the island hydrates (`ssr` gone), `MobileNav.*.js` is fetched, and the hamburger opens the menu.

## Post-deploy (live host)

Run against the deployed base after Pages publishes. Re-run each check rather than
trusting one hit: GitHub Pages serves through a CDN (`x-cache` / `age`), so a
stale replica can answer before the new build propagates. Add
`-H 'Cache-Control: no-cache'` to force a miss.

```bash
base=https://ashik-maybe.github.io/site
curl -sS "$base/build.txt" | tr -d '\r\n'                                # == git rev-parse main
curl -sS -o /dev/null -w '%{http_code}\n' "$base/pagefind/pagefind.js"   # 200
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
- `build.txt` is written by the deploy workflow only. Missing means the live build
  predates the stamp (pre-`9a8ccd9` era); different from `main` means the newest
  deploy did not land — check the run and the platform status, then re-run the
  job (the weekly `schedule` also republishes `main` on its own).
- Pagefind vars: `dist/_astro/main.*.css` must keep the mapping block on `:root:root` (a plain `:root` loses to pagefind's own defaults after a client-side nav, since the router appends its stylesheet last). `check-dist` asserts the doubled selector.
