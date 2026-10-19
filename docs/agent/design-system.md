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
- Page rhythm: index pages are one `max-w-5xl px-4 py-16 sm:px-6` section (the homepage is a `space-y-14 pb-16` wrapper of them with the first at `pt-16`) — 64px above the first block, 56px between sections. Content after an `h2` starts at `mt-4`; after a page lede the first block is `mt-8` (controls) or `mt-10` (lists/grids).
- Page titles: one voice. Index pages lead with a mono `text-2xl font-medium text-balance` `h1`; a qualifier eyebrow above it (`font-mono text-sm text-muted-foreground`) sits at `mt-1`. The homepage hero (`text-4xl sm:text-5xl`, sans) and the two detail pages (`text-3xl sm:text-4xl`) are the deliberate display exceptions — `check-dist` fails on any sans page title.
- Detail pages lead with a mono back link to their collection (`Blog`, `Projects`) so a deep link never dead-ends (`check-dist` guards it; on posts it carries `data-pagefind-ignore` so the label stays out of the search index).
- Links: two tiers. Content links hover to the accent — mono meta links (`font-mono text-sm text-muted-foreground hover:text-primary`: back links, pagination, Tags/RSS/JSON, card titles, badges) and inline action links (`text-sm font-medium text-primary underline-offset-4 hover:underline`: "More about me", the 404 shortcuts). Chrome (Header nav, MobileNav, Footer icons) hovers to `foreground`/`bg-muted` instead, keeping the accent a content signal.
- Cards compose top-down: `CardHeader` … `CardFooter` as siblings, never nested — a nested footer keeps its full-bleed band (muted background, top border, rounded bottom) inset inside the header's padding. `CardTitle`/`CardDescription` already default to `text-base`/`text-sm`; only override to change them.
- Empty states: `Empty` ships `border-dashed` with no border width, so every usage adds `border` (`className="mt-4 border"`) or it renders as floating text (`check-dist` guards it).
- Buttons: `buttonVariants()` defaults (`h-8`) everywhere — no `size: "lg"` one-offs.
