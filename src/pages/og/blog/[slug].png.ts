import { Resvg } from "@resvg/resvg-js"
import satori from "satori"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { getCollection } from "astro:content"
import type { APIRoute, GetStaticPaths } from "astro"
import type { ReactNode } from "react"
import { site } from "@/config"

export const prerender = true

/** One PNG per published post: `/og/blog/<id>.png`. */
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("blog", ({ data }) => !data.draft)
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }))
}

type Props = { post: Awaited<ReturnType<typeof getCollection<"blog">>>[number] }

const width = 1200
const height = 630

/**
 * Minimal element helper so this file can stay `.ts` (Astro endpoints have no
 * JSX) and still feed satori its React-like tree. Satori renders variable
 * fonts at their default instance, which is the regular weight here.
 */
const el = (
  type: string,
  style: Record<string, unknown>,
  children?: unknown
) => ({ type, props: { style, children } })

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

export const GET: APIRoute<Props> = async ({ props }) => {
  const { post } = props
  const date = post.data.pubDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
  const tags = post.data.tags.slice(0, 3).join(", ")

  const card = el(
    "div",
    {
      width,
      height,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "72px 80px",
      backgroundColor: "#eff1f5",
      color: "#4c4f69",
      fontFamily: "Inter",
    },
    [
      el("div", { display: "flex", flexDirection: "column", gap: 20 }, [
        // Mauve is the site's only accent colour.
        el("div", {
          display: "flex",
          width: 56,
          height: 4,
          backgroundColor: "#c6a0f6",
        }),
        el(
          "div",
          {
            display: "flex",
            fontFamily: "JetBrains Mono",
            fontSize: 24,
            color: "#6c6f85",
          },
          site.name
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
        post.data.title
      ),
      el(
        "div",
        {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          fontFamily: "JetBrains Mono",
          fontSize: 22,
          color: "#6c6f85",
        },
        [
          el("div", { display: "flex" }, date),
          tags
            ? el("div", { display: "flex" }, tags)
            : el("div", { display: "flex" }, ""),
        ]
      ),
    ]
  )

  const svg = await satori(card as unknown as ReactNode, {
    width,
    height,
    fonts: await fonts,
  })
  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: width },
  })
    .render()
    .asPng()

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
