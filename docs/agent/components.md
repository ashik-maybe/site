# Components

- `Footer.astro`: site info, socials (GitHub, LinkedIn, Discord, Email via lucide, RSS via lucide), year (`new Date().getFullYear()`), `className="size-4"` on icons.
- `Header.astro`: sticky nav (`backdrop-blur-xl`), desktop nav (`hidden md:block`) with `aria-current`, mobile `ThemeToggle` + `MobileNav` (sheet, `client:idle`, `MenuIcon` trigger).
- `ProfileAvatar.tsx`: initials fallback (`initial="A"`) — React island composed in `.tsx`. Not real photo; no fabricated identity data.
- `ThemeToggle.tsx`: light/dark/system dropdown (`lucide-react` icons), stores preference in `localStorage`; applies `.dark` class + `colorScheme` via inline script in `main.astro`.
- `PostRow.astro`: date (`font-mono`, UTC `toLocaleDateString`), title link, description, tags (`Badge`), `grid` with `7rem` date column.
- `ProjectCard.astro`: 2:1 `AspectRatio`, first-letter placeholder (`font-mono text-3xl`), title link, description, tags (`Badge`), footer links (repo, demo) if set.
- TOC (`src/pages/blog/[slug].astro`): inline `nav` of `h2` headings (depth 2 only, `toc.length > 1`). No scroll-spy.
- `404.astro`: title uses `site.name`; body links to About / Projects / Blog / Contact.
