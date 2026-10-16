import rss from "@astrojs/rss"
import { getCollection } from "astro:content"

import { site } from "@/config"
import { absolute } from "@/lib/seo"

export async function GET() {
  const posts = await getCollection("blog", ({ data }) => !data.draft)
  posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())

  return rss({
    title: `Blog · ${site.name}`,
    description: site.description,
    site: absolute("/"),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: absolute(`/blog/${post.id}/`),
      categories: post.data.tags,
    })),
  })
}
