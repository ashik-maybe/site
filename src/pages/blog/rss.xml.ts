import rss from "@astrojs/rss"
import { getCollection, render } from "astro:content"
import { experimental_AstroContainer as AstroContainer } from "astro/container"

import { site } from "@/config"
import { absolute } from "@/lib/seo"

export async function GET() {
  const posts = await getCollection("blog", ({ data }) => !data.draft)
  posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())

  const container = await AstroContainer.create()
  const items = await Promise.all(
    posts.map(async (post) => {
      const { Content } = await render(post)
      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: absolute(`/blog/${post.id}/`),
        categories: post.data.tags,
        author: site.name,
        // Full text, so readers do not have to open the site.
        content: await container.renderToString(Content),
      }
    }),
  )

  return rss({
    title: `Blog · ${site.name}`,
    description: site.description,
    site: absolute("/"),
    xmlns: { atom: "http://www.w3.org/2005/Atom" },
    customData: [
      "<language>en</language>",
      `<atom:link href="${absolute("/blog/rss.xml")}" rel="self" type="application/rss+xml"/>`,
      `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    ].join(""),
    items,
  })
}
