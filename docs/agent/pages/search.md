# Page: search (`src/pages/search.astro`)
- `noindex, follow`; excluded from the sitemap (`astro.config.mjs` filter) — a
  client-side results view, not content.
- Pagefind is still the engine. What changed is the UI: instead of Pagefind's
  web components (`<pagefind-input>`, `<pagefind-results>`, …), the page calls
  Pagefind's **JS API** (`search()`, `options()`, `init()`) from an inline
  module and renders results into its own markup. No web components, no
  `pagefind-component-ui.*` assets.
- Chrome lives in `src/components/ui/search-panel.astro`: an `h1`, a real
  `<input type="search">`, a `role="status"` live region, a `<ul>` for results,
  and three shadcn `Empty` panels (`data-search-panel-state` = `idle` |
  `empty` | `unavailable`). If the index cannot be loaded — the usual case is
  `astro dev` before a build — the module disables the input and shows the
  `unavailable` panel rather than leaving a field that silently does nothing.
  It is markup only, so it stays server rendered and the page **adds no island**
  (hydration is still ThemeToggle + MobileNav; `check-dist` asserts the search
  page has the same island count as the home page).
- Why drop the components: their hosts reset inherited styles with
  `all: initial`, which fought the Catppuccin tokens and needed a `--pf-*`
  variable mapping to undo. Owning the markup removes that whole layer — the
  `--pf-*` block and `.search-result*` rules are gone from `global.css`.
  `global.css` now only styles `[data-search-results] mark`, since Pagefind's
  excerpt arrives as HTML with `<mark>` already around the matched terms.
- Base path: the inline module reads it from `data-search-base` on
  `[data-search-panel]` (an attribute *is* interpolated in `.astro`; the body of
  an `is:inline` script is not). `pagefind.options({ baseUrl })` keeps result
  links on `/site`.
- Lazy: the module is pulled in with `import()` on first run, so a visitor who
  never types pays nothing for it; `astro:page-load` re-runs the wiring after a
  client-side navigation, guarded by `data-search-ready` so the same DOM is not
  wired twice. Results are debounced (150 ms) with a token to drop out-of-order
  responses; Enter searches immediately.
- Only `pagefind.js` is imported. The `<link rel="preload">` in the head slot
  warms it.
- `bun run build` runs `pagefind --site dist` after `astro build`. Pagefind
  indexes `dist/`, so `dist/pagefind/` only exists after a build.
- **Dev:** `astro dev` has no `dist/pagefind/`, so the index would 404. A
  dev-only Vite plugin (`pagefindDev()` in `astro.config.mjs`) serves
  `dist/pagefind/` at `/pagefind/`; Vite strips `config.base` before connect
  middleware, so the path to match is `/pagefind/…`, **not** `/site/pagefind/…`.
  Run `bun run build` once to populate `dist/`; the index is then a snapshot and
  goes stale as you edit posts until the next build. Production serving is
  untouched — the files are already in the artefact and `configureServer` only
  runs under `astro dev`.
- Without JavaScript the input stays inert, so the page carries a `<noscript>`
  `Empty` block linking to `/blog/` and `/tags/`.
- Scope: only blog posts are indexed. Their `<article>` carries
  `data-pagefind-body` (once any page has it, pages without it are skipped) and
  the `h1` carries `data-pagefind-meta="title"` for clean result titles.
