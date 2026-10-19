import { getCollection } from "astro:content"
import type { APIRoute, GetStaticPaths } from "astro"
import { ogDate, ogImageResponse } from "@/lib/og"

export const prerender = true

/** One PNG per project: `/og/projects/<id>.png`. */
export const getStaticPaths: GetStaticPaths = async () => {
  const projects = await getCollection("projects")
  return projects.map((project) => ({
    params: { slug: project.id },
    props: { project },
  }))
}

type Props = {
  project: Awaited<ReturnType<typeof getCollection<"projects">>>[number]
}

export const GET: APIRoute<Props> = ({ props }) =>
  ogImageResponse({
    title: props.project.data.title,
    kind: "Project",
    date: ogDate(props.project.data.pubDate),
    meta: props.project.data.tags.slice(0, 3).join(", "),
  })
