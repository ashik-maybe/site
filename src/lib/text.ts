/** Rough reading time for a markdown body at 200 words per minute. */
export function readingTime(body: string | undefined): number {
  if (!body) return 1
  const words = body.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

/** URL-safe slug for tags: "Machine Learning" -> "machine-learning". */
export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}
