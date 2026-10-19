# Content

Source: `src/content.config.ts` (blog + projects schemas). No private facts file.

- Blog (`src/content/blog/`): title, description (`pubDate` formatted `month day, year` UTC), tags (`string[]`), `draft` boolean (`draft` excluded from build/pages/feed/sitemap). `updatedDate` optional.
- Projects (`src/content/projects/`): title, description, tags, `featured` boolean, `repo` string, `demo` string. Featured shown first; unfeatured still rendered.
- Placeholder rules: `mail` links use `hello@example.com` (placeholder — ask user before publishing). Social handles reference `github.com/ashik-maybe`, `linkedin.com/in/ashik-maybe`, `discord.com/users/000...`. These are placeholders.
- Posts contain real code (ITool derive, tiny MLP); descriptions reuse visible lead copy (not synthetic). No fabricated employers / schools / dates / credentials.
- Images: `public/og.png` shared OG (1200x630, Catppuccin); no per-post OG or cover images. No real personal photos.
- Tags: hub `/tags/` plus archives (`/blog/tags/[tag]`, `/projects/tags/[tag]`): sitemap excluded (`filter` matches `/tags/`), `noindex, follow`. Thin listings — designed to not rank.
