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
  `:root:root` (doubled on purpose — pagefind's own stylesheet defines the same
  variables on `:root`, and the ClientRouter appends newly fetched stylesheets
  *after* ours, so equal specificity meant pagefind's stock defaults won after a
  client-side navigation into `/search` while a direct load looked correct).
  Both themes inherit, since the tokens flip on `.dark`.
- Client-side navigation into `/search` is safe: the head-slot stylesheet and
  module script are fetched on the swap, the custom elements upgrade, and the
  component reads the theme from the document (verified in Chrome: input keeps
  its Catppuccin colour/`10px` radius/`44px` height, results render, dark mode
  survives the transition, no console errors).
- Scope: only blog posts are indexed. Their `<article>` carries
  `data-pagefind-body` (once any page has it, pages without it are skipped) and
  the `h1` carries `data-pagefind-meta="title"` for clean result titles.
- `bun run build` runs `pagefind --site dist` after `astro build`; the dev server
  has no `/pagefind/` directory until a build has run, so search only works
  against `preview` (or after a build).
