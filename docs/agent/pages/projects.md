# Page: projects (`src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`)
- Index: title `Projects`; grid of `ProjectCard`; featured first; `tags` filter pages (`/projects/tags/[tag]`) excluded from sitemap + `noindex`.
- Detail (`[slug]`): `type="article"`; `post` JSON-LD (`BlogPosting` + `BreadcrumbList` + keywords/wordCount/timeRequired/inLanguage/image); `og:type=article` with `article:*` props; `BlogPosting` graph.
- Project data schema: `title`, `description`, `tags`, `featured`, `repo`, `demo`.
- Placeholder: `repo` / `demo` links may be empty strings; cards still render but links missing.
