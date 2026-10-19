import { getCollection } from "astro:content"
import type { APIRoute, GetStaticPaths } from "astro"
import { ogDate, ogImageResponse } from "@/lib/og"

export const prerender = true

/** One PNG per published post: `/og/blog/<id>.png`. */
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("blog", ({ data }) => !data.draft)
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }))
}

type Props = { post: Awaited<ReturnType<typeof getCollection<"blog">>>[number] }

export const GET: APIRoute<Props> = ({ props }) =>
  ogImageResponse({
    title: props.post.data.title,
    kind: "Blog",
    date: ogDate(props.post.data.pubDate),
    meta: props.post.data.tags.slice(0, 3).join(", "),
  })
