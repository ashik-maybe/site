import { absolute } from "@/lib/seo"
import type { APIRoute } from "astro"

// Crawlers only read robots.txt from the origin root. On a GitHub Pages
// project site the files live under `/site/`, so this file is served at
// `<origin>/site/robots.txt` and takes effect once the site moves to a
// custom domain or an `<owner>.github.io` repository.
export const GET: APIRoute = () =>
  new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${absolute("/sitemap-index.xml")}\n`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  )
