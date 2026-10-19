# Page: blog post (`src/pages/blog/[slug].astro` detail view)
- See `pages/blog.md` for schema / meta / JSON-LD. Key detail-level notes:
- Description reused from `post.data.description` (visible lead copy, not synthetic).
- Tags: `post.data.tags` mapped to `slugifyTag` links (`/blog/tags/[tag]` — noindex).
- Featured image: shared `og.png` (no per-post cover); `og:image` and `twitter:image` reference `https://ashik-maybe.github.io/site/og.png`.
- TOC (`nav`): inline, `h2` headings only, depth=2, shown when `toc.length > 1`. Link targets: `heading.slug` (generated from heading text).
- Heading anchors: h2/h3 text wrapped in `<a href="#id">` by the `headingAnchors` Sätteri visitor (`astro.config.mjs`); `global.css` keeps it looking like plain text until hover (mauve hover).
- Reading progress: `.reading-progress` div (`aria-hidden`, posts only) — fixed 2px bar, `animation-timeline: scroll(root)`; static `scaleX(0)` where scroll-driven animations are unsupported.
- `scroll-padding-top` (`4.5rem`) ensures anchored headings don't hide under sticky header.
- `expressive-code`: full-text feed uses `experimental_AstroContainer`. Theme follows `.dark` selector (not OS media).
