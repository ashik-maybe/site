import { experimental_AstroContainer as AstroContainer } from "astro/container"
import { getCollection, render } from "astro:content"

import { site } from "@/config"
import { absolute } from "@/lib/seo"

// JSON Feed (https://jsonfeed.org/version/1.1), full-text like the RSS feed.
export async function GET() {
  const posts = await getCollection("blog", ({ data }) => !data.draft)
  posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())

  const container = await AstroContainer.create()
  const items = await Promise.all(
    posts.map(async (post) => {
      const { Content } = await render(post)
      const url = absolute(`/blog/${post.id}/`)
      return {
        id: url,
        url,
        title: post.data.title,
        summary: post.data.description,
        // Same card the page advertises as og:image.
        image: absolute(`/og/blog/${post.id}.png`),
        date_published: post.data.pubDate.toISOString(),
        ...(post.data.updatedDate
          ? { date_modified: post.data.updatedDate.toISOString() }
          : {}),
        tags: post.data.tags,
        content_html: await container.renderToString(Content),
      }
    })
  )

  return new Response(
    JSON.stringify(
      {
        version: "https://jsonfeed.org/version/1.1",
        title: `Blog · ${site.name}`,
        home_page_url: absolute("/blog/"),
        feed_url: absolute("/blog/feed.json"),
        description: site.description,
        language: "en",
        authors: [{ name: site.name, url: absolute("/") }],
        items,
      },
      null,
      2
    ),
    { headers: { "Content-Type": "application/feed+json; charset=utf-8" } }
  )
}
