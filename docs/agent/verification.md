# Verification (ad hoc — no Playwright committed)

- `bun run build`: must output 27 pages, no errors, `dist/` created.
- `bun run build:ci`: what CI runs (`astro check && astro build`); must pass before deploy.
- `bunx astro check`: must be 0 errors / 0 warnings / 0 hints (currently clean after removing unused `site` import in `index.astro`).
- `bun run lint`: must pass (oxlint — `react` + `typescript` plugins, correctness category; also covers `.astro`); CI-enforced.
- `bun run format:check`: must be clean (oxfmt, scope `ts/tsx/astro`; Tailwind class sorting built in for `.tsx` and `.astro`); `bun run format` writes; CI-enforced.
- `dist/_astro/main.*.css`: must contain `--background`, `bg-background`, `text-foreground`, `.dark{...}` (theme tokens restored).
- `public/og.png`: must exist (1200x630); all page meta references must resolve (verified via grep against `dist/`).
- RSS links: `grep` `dist/blog/rss.xml` for item URLs starting with `/site/blog/` (not `/siteblog/`).
- `dist/sitemap-0.xml`: `<lastmod>` on the 8 content pages (blog + projects) only, and no `/tags/` URLs.
- `dist/tags/index.html`: `noindex, follow`; badges with counts for every blog + project tag; linked from the blog and projects indexes; absent from the sitemap (the filter matches `/tags/`).
- `dist/_astro/main.*.css`: contains a `@media print` block (`header,footer{display:none`, `tw-prose-invert` + `ec-codeFg` overrides).
- JSON-LD URLs: must include `/site/` prefix; verify with `grep` for `"@id"` containing `/site/` in `dist/*.html`.
- Font preloads: `dist/index.html` must contain `<link rel="preload" ... inter-... woff2 ...>` and `jetbrains-...`.
- Theme-color sync: `dist/index.html` contains `applyThemeColor` / `MutationObserver` in inline `<script>`.
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
