// @ts-check

import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import expressiveCode from "astro-expressive-code"

// https://astro.build/config
export default defineConfig({
  site: "https://ashik-maybe.github.io",
  base: "/site",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    react(),
    expressiveCode({
      themes: ["catppuccin-latte", "catppuccin-macchiato"],
      themeCssSelector: (theme) =>
        theme.type === "dark" ? ".dark" : ":root:not(.dark)",
      frames: { showCopyButton: true },
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
    }),
  ],
})
