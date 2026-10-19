# Page: search (`src/pages/search.astro`)
- `noindex, follow`; excluded from the sitemap (`astro.config.mjs` filter) — a
  client-side results view, not content.
- Pagefind 1.5 Component UI (web components, not Astro islands — hydration stays
  ThemeToggle + MobileNav only): `<pagefind-config>`, `<pagefind-input>`,
  `<pagefind-summary>`, `<pagefind-results>`.
- `bundle-path="/site/pagefind/"` and `base-url="/site"` are built from
  `import.meta.env.BASE_URL`; without `base-url`, result links drop the project
  path and 404.
- Assets come from `${base}/pagefind/pagefind-component-ui.{css,js}` via the
  layout's `head` slot, emitted with `is:inline` — `astro build` must not try to
  resolve a file that only exists after the indexing step.
- Result template: `src/components/search/result-template.html`, imported with
  `?raw` and injected with `set:html`. Inlining the template in the page breaks
  `astro check`: the compiler parses `<script>` contents as TypeScript, and
  `{{ … }}` is not valid TS.
- Styling: the component hosts reset inherited properties (`all: initial`), so
  the template's colour/font are set explicitly in `global.css`
  (`.search-result*`); `--pf-*` variables are mapped onto Catppuccin tokens on
  `:root`, which both themes inherit since the tokens flip on `.dark`.
- Scope: only blog posts are indexed. Their `<article>` carries
  `data-pagefind-body` (once any page has it, pages without it are skipped) and
  the `h1` carries `data-pagefind-meta="title"` for clean result titles.
- `bun run build` runs `pagefind --site dist` after `astro build`; the dev server
  has no `/pagefind/` directory until a build has run, so search only works
  against `preview` (or after a build).
