# Design system

Catppuccin Latte (light) / Macchiato (dark). Mauve (`#c6a0f6`) is the only accent color.

- Typography: Inter (variable, sans) headings + body; JetBrains Mono (variable, mono) for code / labels / meta.
- Colors from `global.css`: `--primary` = Mauve; `--secondary` = Surface 1; `--muted` = Surface 0; `--destructive` = Red.
- Spacing / radius: `--radius` (`.625rem`) is defined on `:root`; the shadcn scale (`--radius-sm|md|lg|xl|2xl`) derives from it in `@theme inline`. The base token must exist — every `rounded-*` utility resolves to `var(--radius)`, so leaving it undefined silently squares every control site-wide (`check-dist` guards it).
- Avoid: ALL-CAPS eyebrows (`text-xs uppercase tracking-widest` if needed is okay but not default), `·` middots in labels, `01 / 02 / 03` markers, SaaS gradient card grids, gradient washes.
- Components use `lucide-react` (Mail, Rss) + `react-icons/fa` (FaGithub, FaLinkedin, FaDiscord) — no custom SVG brand icons.
- React islands: `ThemeToggle` (dropdown, `client:idle`), `MobileNav` (sheet, `client:media="(max-width: 767px)"`). Minimal hydration.
- Responsive: mobile-first, `max-w-5xl` content, `sm:/md:` breakpoints. Every page's top-level section uses `max-w-5xl px-4 sm:px-6` so headings and controls line up with the shared header's brand; a narrower column (`max-w-3xl`) reads as the page being misaligned (`check-dist` compares the search page's container against the blog index).
- Scrollbar gutter: `html { scrollbar-gutter: stable }` reserves the track so the centered `max-w-5xl` row sits at the same x on short pages and scrolling ones. Without it the one shared header renders ~7.5px off on routes that do not scroll (`check-dist` guards it).
