import rss from "@astrojs/rss"
import { getCollection } from "astro:content"

import { site } from "@/config"
import type { APIContext } from "astro"

export async function GET(context: APIContext) {
  const base = import.meta.env.BASE_URL
  const posts = await getCollection("blog", ({ data }) => !data.draft)
  posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())

  return rss({
    title: `Blog · ${site.name}`,
    description: site.description,
    site: new URL(base, context.site ?? site.site),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `${base}blog/${post.id}/`,
      categories: post.data.tags,
    })),
  })
}
