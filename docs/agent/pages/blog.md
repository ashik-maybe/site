# Page: blog (`src/pages/blog/[...page].astro`, `src/pages/blog/[slug].astro`)
- Index: list via `PostRow`; header links `Tags` (`/tags/` hub) + full-text RSS at `/blog/rss.xml` + JSON Feed at `/blog/feed.json`; paginated (`pageSize: 2` — small so the template ships with `/blog/2/` exercised; bump as posts accumulate): `Page N of M`, rel prev/next (trailing slash), `Blog (page N)` title suffix past page 1, empty-state kept alive for a zero-post collection; `noindex` on tag archives; `lastBuildDate`; `atom:link rel=self`; language `<language>`.
- Post (`[slug]`): `type="article"`; `post` JSON-LD; TOC (`h2` headings, `toc.length > 1`); `readingTime` displayed; code blocks via `expressive-code` with Catppuccin themes + `.dark` selector.
- Content schema: `title`, `description`, `pubDate`, `updatedDate` (optional), `tags`, `draft` (excluded from build/feed when `true`).
- No fabricated dates / institutions.
