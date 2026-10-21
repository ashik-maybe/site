import { site } from "@/config"

/** Site root, including the deployment base path, with a trailing slash. */
export const root = new URL(
  `${site.site.replace(/\/+$/, "")}${import.meta.env.BASE_URL.replace(/\/+$/, "")}/`
).href

/**
 * Absolute URL for a path on this site. Anything that leaves the rendered
 * page — feed items, structured data, Open Graph tags — must go through here,
 * so the deployment base path can never be dropped.
 */
export function absolute(path = "/"): string {
  return new URL(path.replace(/^\/+/, ""), root).href
}

/** One JSON-LD document built from a set of schema.org nodes. */
export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes }
}

/** The site owner. Other nodes reference this by `@id`. */
export function personNode() {
  return {
    "@type": "Person",
    "@id": `${absolute("/")}#person`,
    name: site.name,
    identifier: {
      "@type": "PropertyValue",
      propertyID: "GitHub",
      value: site.handle,
    },
    url: absolute("/"),
    sameAs: site.socials
      .filter((social) => social.href.startsWith("http"))
      .map((social) => social.href),
  }
}

/** The site itself. */
export function webSiteNode() {
  return {
    "@type": "WebSite",
    "@id": `${absolute("/")}#website`,
    url: absolute("/"),
    name: site.name,
    description: site.description,
    inLanguage: "en",
    publisher: { "@id": `${absolute("/")}#person` },
  }
}

/** Breadcrumb trail; `path` is site-relative, e.g. `/blog/`. */
export function breadcrumbNode(trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  }
}
