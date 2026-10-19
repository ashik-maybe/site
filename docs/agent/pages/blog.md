# Page: blog (`src/pages/blog/index.astro`, `src/pages/blog/[slug].astro`)
- Index: list via `PostRow`; header links `Tags` (`/tags/` hub) + full-text RSS at `/blog/rss.xml`; `noindex` on tag archives; `lastBuildDate`; `atom:link rel=self`; language `<language>`.
- Post (`[slug]`): `type="article"`; `post` JSON-LD; TOC (`h2` headings, `toc.length > 1`); `readingTime` displayed; code blocks via `expressive-code` with Catppuccin themes + `.dark` selector.
- Content schema: `title`, `description`, `pubDate`, `updatedDate` (optional), `tags`, `draft` (excluded from build/feed when `true`).
- No fabricated dates / institutions.
