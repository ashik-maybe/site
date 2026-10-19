# Page: home (`src/pages/index.astro`)
- Layout: `Layout` with `title={site.title}`; meta description = `site.description`; `og:type=website`.
- Hero: `h1` with `text-balance`, subtitle lead (visible copy reused for meta), CTA to blog / contact.
- Sections: featured projects (from `projects` collection, `featured` filter), latest posts (`blog` sorted by `pubDate`, 3 shown max), brief intro / profile (placeholder text — ask owner for real bio / role / school / employer).
- JSON-LD: `graph(personNode(), webSiteNode())` (Person + WebSite graph); `site.name` used; URLs base-prefixed.
- No hardcoded dates / employers / schools.
