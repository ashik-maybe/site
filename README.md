# Astro Portfolio + Blog Template

A small, fast, static personal site: a portfolio, a blog, and a separate
Obsidian notes vault. Built with Astro and deployed to GitHub Pages under a
`/site` base path.

## Stack

- **Astro 7** — static output, file-based routing
- **React 19** — two islands only: `ThemeToggle` and `MobileNav`
- **Tailwind CSS v4** — utilities via the `@tailwindcss/vite` plugin
- **shadcn/ui** — source-owned components in `src/components/ui`
- **Expressive Code** — Catppuccin code blocks with a copy button
- **Catppuccin Latte / Macchiato** — light and dark themes; mauve is the only
  accent colour

## Requirements

- **Bun** (this project uses `bun.lock`)
- **Node `>=22.12.0`** (see `.nvmrc`)

## Commands

| Command             | Does                                              |
| ------------------- | ------------------------------------------------- |
| `bun install`       | install dependencies                              |
| `bun run dev`       | dev server (served under `/site`)                 |
| `bun run build`     | build the static site to `dist/`                  |
| `bun run preview`   | preview the built site                            |
| `bun run typecheck` | `astro check` — types for `.astro` and TypeScript |
| `bun run lint`      | ESLint                                            |
| `bun run format`    | Prettier                                          |

## Layout

```
src/
├── config.ts            # site metadata: title, description, nav, socials
├── content.config.ts    # blog + projects collection schemas
├── content/             # Markdown content (blog/, projects/)
├── layouts/main.astro   # head, meta tags, JSON-LD
├── components/          # layout/, blog/, projects/, ui/
├── pages/               # routes, plus robots.txt, rss.xml, 404
├── lib/seo.ts           # base-aware absolute URLs + JSON-LD node builders
└── styles/global.css    # Catppuccin tokens, fonts
```

The `learning/` folder at the repo root is an Obsidian vault. It is learning
material, **not** part of the build and not shipped to `dist/`.

## Customising

- **Site metadata and nav:** `src/config.ts`
- **Deployment origin:** `src/config.ts` (`site.site`) — `astro.config.mjs` reads
  this same value, so there is one origin to change
- **Base path:** `astro.config.mjs` (`base`)
- **Theme tokens and fonts:** `src/styles/global.css`
- **Content:** `src/content/blog/`, `src/content/projects/`

Any URL that leaves a rendered page (feeds, structured data, Open Graph) goes
through `src/lib/seo.ts`, so the `base` path can never be dropped. Keep it that
way when you add pages.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which type-checks,
builds, and publishes to GitHub Pages. The site is served under `/site`; moving
to a custom domain means changing the origin in `src/config.ts` and the `base`
in `astro.config.mjs`.

## Placeholders

Sample content and social links are placeholders. Replace them before
publishing — see `docs/agent/launch.md`.

## License

MIT — see [LICENSE](./LICENSE).
