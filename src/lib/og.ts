import { Resvg } from "@resvg/resvg-js"
import satori from "satori"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import type { ReactNode } from "react"
import { site } from "@/config"

/**
 * Shared 1200×630 Open Graph card renderer: satori lays the card out (Latte
 * background, BD green accent bar, Inter title, JetBrains Mono metadata) and
 * `@resvg/resvg-js` rasterises it. Used by the blog and project OG endpoints.
 *
 * Variable fonts render at their default instance, i.e. the regular weight.
 */
export const width = 1200
export const height = 630

/** Satori's React-like tree without pulling in JSX (the endpoints are `.ts`). */
const el = (
  type: string,
  style: Record<string, unknown>,
  children?: unknown
) => ({
  type,
  props: { style, children },
})

const fonts = (async () => {
  const dir = join(process.cwd(), "src", "assets", "fonts")
  const [inter, jetbrains] = await Promise.all([
    readFile(join(dir, "inter-latin-wght-normal.woff2")),
    readFile(join(dir, "jetbrains-mono-latin-wght-normal.woff2")),
  ])
  return [
    {
      name: "Inter",
      data: inter,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "JetBrains Mono",
      data: jetbrains,
      weight: 400 as const,
      style: "normal" as const,
    },
  ]
})()

export type OgCard = {
  /** Large title line(s); clamped to three lines. */
  title: string
  /** Upper-left eyebrow, a content type such as "Blog" or "Project". */
  kind: string
  /** Left-hand metadata, already formatted. */
  date: string
  /** Right-hand metadata; omitted when empty. */
  meta?: string
}

/** Render one OG card to a PNG response. */
export async function ogImageResponse({
  title,
  kind,
  date,
  meta = "",
}: OgCard): Promise<Response> {
  const card = el(
    "div",
    {
      width,
      height,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "72px 80px",
      backgroundColor: "#f8fbf9",
      color: "#1a2620",
      fontFamily: "Inter",
    },
    [
      el("div", { display: "flex", flexDirection: "column", gap: 20 }, [
        // Brand pair derived from the Bangladesh flag: a red disc beside the
        // green bar, the flag's own composition.
        el("div", { display: "flex", alignItems: "center", gap: 12 }, [
          el("div", {
            display: "flex",
            width: 16,
            height: 16,
            borderRadius: 9999,
            backgroundColor: "#f0a08c",
          }),
          el("div", {
            display: "flex",
            width: 56,
            height: 4,
            backgroundColor: "#65cfa2",
          }),
        ]),
        el(
          "div",
          {
            display: "flex",
            fontFamily: "JetBrains Mono",
            fontSize: 24,
            color: "#586961",
          },
          `${site.name} · ${kind}`
        ),
      ]),
      el(
        "div",
        {
          display: "flex",
          fontSize: 64,
          lineHeight: 1.15,
          letterSpacing: "-1.5px",
          maxWidth: 1000,
          lineClamp: 3,
        },
        title
      ),
      el(
        "div",
        {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          fontFamily: "JetBrains Mono",
          fontSize: 22,
          color: "#586961",
        },
        [
          el("div", { display: "flex" }, date),
          el("div", { display: "flex" }, meta),
        ]
      ),
    ]
  )

  const svg = await satori(card as unknown as ReactNode, {
    width,
    height,
    fonts: await fonts,
  })
  const png = new Resvg(svg, { fitTo: { mode: "width", value: width } })
    .render()
    .asPng()

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}

/** `March 4, 2026` in UTC, so server timezone cannot shift a build. */
export function ogDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}
