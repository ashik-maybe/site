// @ts-check

import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import expressiveCode from "astro-expressive-code"
import { satteri } from "@astrojs/markdown-satteri"
import Slugger from "github-slugger"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"

// Single source of truth for the deployment origin: the same `site` object the
// rest of the app reads from `src/config.ts`.
import { site as siteConfig } from "./src/config.ts"

/** Deployment base path. Kept here as the single source for `base`. */
const base = "/site"

/**
 * Map of site-relative route to its content date, read from the collection
 * Markdown at config time, so the sitemap can carry a `lastmod`. Tolerant of
 * missing files — an unreadable date just means no `lastmod` for that URL.
 * @returns {Map<string, string>}
 */
function contentDates() {
  /** @type {Map<string, string>} */
  const dates = new Map()
  for (const collection of ["blog", "projects"]) {
    const dir = join("src", "content", collection)
    if (!existsSync(dir)) continue
    for (const file of readdirSync(dir)) {
      if (!file.endsWith(".md") && !file.endsWith(".mdx")) continue
      const frontmatter =
        readFileSync(join(dir, file), "utf8").split("---")[1] ?? ""
      const match =
        frontmatter.match(/^updatedDate:\s*"?([\d-]+)"?/m) ??
        frontmatter.match(/^pubDate:\s*"?([\d-]+)"?/m)
      if (match) {
        dates.set(`/${collection}/${file.replace(/\.mdx?$/, "")}/`, match[1])
      }
    }
  }
  return dates
}

const lastmod = contentDates()

/**
 * Heading permalinks (the wrap-style links rehype-autolink-headings makes on
 * the legacy processor), written as a native Sätteri hast visitor. User
 * plugins run before Astro's own `heading-ids` plugin, so this mirrors its
 * slug logic and *sets* the id itself — `heading-ids` then adopts the
 * existing ids, keeping TOC links and anchors consistent by construction.
 *
 * @returns {import("satteri").HastPluginDefinition}
 */
const headingAnchors = () => {
  const slugger = new Slugger()
  return {
    name: "heading-anchors",
    element: {
      filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
      visit(node, ctx) {
        const existingId = node.properties?.id
        const id =
          typeof existingId === "string"
            ? existingId
            : slugger.slug(ctx.textContent(node))
        if (typeof existingId !== "string") {
          ctx.setProperty(node, "id", id)
        }
        if (
          (node.tagName === "h2" || node.tagName === "h3") &&
          node.children.length > 0
        ) {
          return {
            ...node,
            children: [
              {
                type: "element",
                tagName: "a",
                properties: { href: `#${id}` },
                children: node.children,
              },
            ],
          }
        }
      },
    },
  }
}

// https://astro.build/config
export default defineConfig({
  site: siteConfig.site,
  base,
  markdown: {
    // Heading permalinks: h2/h3 text becomes its own anchor link via a native
    // Sätteri hast visitor (rehype plugins need the legacy processor);
    // global.css keeps it looking like plain text until hover.
    processor: satteri({ hastPlugins: [headingAnchors] }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    react(),
    expressiveCode({
      themes: ["catppuccin-latte", "catppuccin-macchiato"],
      themeCssSelector: (theme) =>
        theme.type === "dark" ? ".dark" : ":root:not(.dark)",
      frames: { showCopyToClipboardButton: true },
      styleOverrides: {
        borderRadius: "0.625rem",
        borderColor: "var(--border)",
        codeBackground: "var(--card)",
        codeFontFamily:
          '"JetBrains Mono Variable", ui-monospace, SFMono-Regular, Menlo, monospace',
        codeFontSize: "0.875rem",
        uiFontFamily: '"Inter Variable", sans-serif',
      },
    }),
    sitemap({
      // Tag archives are thin, near-duplicate listings; they are marked
      // `noindex` and kept out of the sitemap on purpose.
      filter: (page) => !page.includes("/tags/"),
      // Stamp content pages with their own date for crawl freshness.
      serialize(item) {
        const path = new URL(item.url).pathname.slice(base.length)
        const date = lastmod.get(path)
        return date ? { ...item, lastmod: date } : item
      },
    }),
  ],
})
