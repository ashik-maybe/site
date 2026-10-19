# Verification (ad hoc — no Playwright committed)

- `bun run build`: must output 29 pages, no errors, `dist/` created; then Pagefind indexes `dist/` (`Indexed 3 pages` — posts only).
- `bun run build:ci`: what CI runs (`astro check && astro build && pagefind --site dist`); must pass before deploy.
- `bunx astro check`: must be 0 errors / 0 warnings / 0 hints.
- `bun run lint`: must pass (oxlint — `react` + `typescript` plugins, correctness category; also covers `.astro`); CI-enforced.
- `bun run format:check`: must be clean (oxfmt, scope `ts/tsx/astro`; Tailwind class sorting built in for `.tsx` and `.astro`); `bun run format` writes; CI-enforced.
- `dist/_astro/main.*.css`: must contain `--background`, `bg-background`, `text-foreground`, `.dark{...}` (theme tokens restored).
- `public/og.png`: must exist (1200x630); all page meta references must resolve (verified via grep against `dist/`).
- Per-post OG images: `dist/og/blog/<id>.png` exists for every published post, each a 1200×630 PNG (`file` reports `PNG image data, 1200 x 630`); post HTML has `og:image` / `twitter:image` = absolute `/site/og/blog/<id>.png`, `og:image:alt` = the post title, and JSON-LD `"image"` matching; other pages still reference `/site/og.png`; sitemap has no `/og/`. Rendering check without vision: sample pixels (`createImageBitmap` + canvas) — corners `#eff1f5`, the 56×4 mauve bar at x80/y72 is `#c6a0f6`, and ink pixels scale with title length.
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
- Search: `dist/pagefind/` exists with `pagefind-component-ui.{css,js}`; build log says `Indexed 3 pages` (the posts); `grep -l data-pagefind-body dist/blog/*/index.html | wc -l` = 3 and no other page carries it; `dist/search/index.html` has `noindex, follow`, `pagefind-component-ui.css`/`.js`, `<pagefind-config bundle-path="/site/pagefind/" base-url="/site">`, and the `type="text/pagefind-template"` result template; sitemap still has 14 `<loc>` and no `/search/`. Ad hoc browser check: typing a term renders result links, every `href` starts with `/site/blog/`, and the theme's text/mark colours follow `dark`.
- View transitions: `dist/index.html` contains `astro-view-transitions-enabled`, the `ClientRouter*.js` module script, and `data-astro-transition-persist="theme-toggle"`. Ad hoc browser check (system Chrome + `playwright-core`, no committed scripts): click-through navigation must keep `window` markers (no full reload), the `dark` class, and both `theme-color` metas in sync after swap; the persisted toggle must be the same DOM node; expressive-code copy buttons must reappear after a client-side navigation into a post; with `reducedMotion: "reduce"` no `::view-transition*` animations may run. `dist/_astro/main.*.css` must contain `::view-transition-group(*)` inside a `prefers-reduced-motion` block.
- Social links: `dist/index.html` contains Discord `discord.com/users/`; no `github.tsx` / `linkedin.tsx` residuals.
- No `Co-authored-by:` or AI trailer in any commit message; author must match `git config user.name` (`Ashik`).
- Deploy workflow: `.github/workflows/deploy.yml` parses as YAML, has exactly one job (`deploy`); triggers `push` on `main`, `workflow_dispatch` and a weekly `schedule`; steps in order: checkout@v7, setup-bun@v2 (`with: bun-version-file: .bun-version`), `bun install --frozen-lockfile`, one `Lint and format check` step (`bun run lint` + `bun run format:check`), `bun run build:ci`, `Stamp build` (`echo "$GITHUB_SHA" > dist/build.txt`), `upload-pages-artifact@v5` (`path: dist`), `deploy-pages@v5`, `Verify the live site serves this commit`; `timeout-minutes: 15`; permissions `contents: read` / `pages: write` / `id-token: write`; `concurrency.group: pages` with `cancel-in-progress: false`. Timing picture from the Actions API (per-step `started_at`/`completed_at`): install 2–4s, lint+format 2–4s, build 17–23s, publish 6–75s (GitHub-side, varies); a healthy run is ~40–62s end to end. A run that sits `queued` with no runner and zero steps is GitHub-side (check `https://www.githubstatus.com/api/v2/components.json` for an Actions/Pages incident) — it is not a workflow-configuration problem, and re-running or waiting is the fix.
- Deploy verification step: polls `page_url/build.txt?run=$GITHUB_RUN_ID-$attempt` up to 20×15s for the commit SHA, then requires 200 from `pagefind/pagefind.js` and `sitemap-index.xml`. Both branches exercised locally against `astro preview` (`PAGE_URL`/`EXPECTED` env, matching and mismatched SHA): success prints the matching SHA and both 200s; mismatch retries, prints the `::error::`, echoes the live Actions/Pages status + any open incident, exits 1. After a real deploy, `curl -sS https://ashik-maybe.github.io/site/build.txt` must equal `git rev-parse main`; in the repo the stamp is created only by the workflow, so `dist/build.txt` is absent from local builds by design.
- `.bun-version` (repo root) is the single toolchain pin; both workflows pass it via `setup-bun`'s `bun-version-file`. Verify `bun --version` matches it locally (`1.4.3`).
- CI workflow: `.github/workflows/ci.yml` parses as YAML, triggers on `pull_request` + `workflow_dispatch`, permissions only `contents: read`, one `check` job with `timeout-minutes: 10`: checkout@v7 → setup-bun@v2 (`bun-version-file: .bun-version`) → `bun install --frozen-lockfile` → lint → format check → `build:ci` (steps intentionally mirror deploy).
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
