# Design system

Catppuccin Latte (light) / Macchiato (dark). Mauve (`#c6a0f6`) is the only accent color.

- Typography: Inter (variable, sans) headings + body; JetBrains Mono (variable, mono) for code / labels / meta.
- Colors from `global.css`: `--primary` = Mauve; `--secondary` = Surface 1; `--muted` = Surface 0; `--destructive` = Red.
- Spacing / radius: shadcn defaults (`--radius-lg`, etc.) mapped via `@theme inline`.
- Avoid: ALL-CAPS eyebrows (`text-xs uppercase tracking-widest` if needed is okay but not default), `·` middots in labels, `01 / 02 / 03` markers, SaaS gradient card grids, gradient washes.
- Components use `lucide-react` (Mail, Rss) + `react-icons/fa` (FaGithub, FaLinkedin, FaDiscord) — no custom SVG brand icons.
- React islands: `ThemeToggle` (dropdown, `client:idle`), `MobileNav` (sheet, `client:idle`). Minimal hydration.
- Responsive: mobile-first, `max-w-5xl` content, `sm:/md:` breakpoints.
