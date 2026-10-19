# Verification (ad hoc — no Playwright committed)

- `bun run build`: must output 26 pages, no errors, `dist/` created.
- `bunx astro check`: must be 0 errors / 0 warnings / 0 hints (currently clean after removing unused `site` import in `index.astro`).
- `dist/_astro/main.*.css`: must contain `--background`, `bg-background`, `text-foreground`, `.dark{...}` (theme tokens restored).
- `public/og.png`: must exist (1200x630); all page meta references must resolve (verified via grep against `dist/`).
- RSS links: `grep` `dist/blog/rss.xml` for item URLs starting with `/site/blog/` (not `/siteblog/`).
- JSON-LD URLs: must include `/site/` prefix; verify with `grep` for `"@id"` containing `/site/` in `dist/*.html`.
- Font preloads: `dist/index.html` must contain `<link rel="preload" ... inter-... woff2 ...>` and `jetbrains-...`.
- Theme-color sync: `dist/index.html` contains `applyThemeColor` / `MutationObserver` in inline `<script>`.
- Social links: `dist/index.html` contains Discord `discord.com/users/`; no `github.tsx` / `linkedin.tsx` residuals.
- No `Co-authored-by:` or AI trailer in any commit message; author must match `git config user.name` (`Ashik`).
