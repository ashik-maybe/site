# Launch / pre-publish checklist (optional, not required before content land)

Not done yet — only after real content replaces placeholders.

- Replace placeholders in `src/config.ts`: `site.description`, `mail`, Discord handle, LinkedIn/in URLs.
- Replace `hello@example.com`, `discord.com/users/000...`, placeholder roles / employers in `about.astro`, `index.astro`, `contact.astro`.
- Confirm `og.png` exists at `/site/og.png` (done).
- Confirm `robots.txt` is present (done; inert at `/site/` origin, document rather than delete).
- Decide custom domain (`ashik-maybe.github.io` vs own) before relying on backlinks or GSC verification.
- Google Search Console + Bing Webmaster Tools (DDG indexes via Bing).
- IndexNow (Bing/DDG): submit sitemap URL after domain is decided.
- Backlinks / social proof: needed before ranking; technical layer is complete but ranking is blocked by zero backlinks + placeholder content.
- Noindex flag (`meta robots="noindex"`) can be added in `main.astro` temporarily until real content lands — keep paired with sitemap exclusion of `/tags/`. Not needed if placeholders stay but risky; recommend deciding at launch.
- No sitemap pings needed for Google (deprecated); GSC is sufficient.
- Do NOT index placeholder content; if domain is custom, use GSC + IndexNow; if staying on GH Pages project site (`/site/`), manage expectations (project-site URLs less authoritative for ranking).
