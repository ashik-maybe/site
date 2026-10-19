/**
 * Structural checks on `dist/` — the ad-hoc `grep` assertions from
 * `docs/agent/verification.md`, made runnable. Fails the build/deploy when the
 * output stops matching what the template promises (base path, Pagefind,
 * islands, OG images, sitemap exclusions, feeds, theme CSS).
 *
 *   bun run verify                  # lint + format + build + these checks
 *   node scripts/check-dist.mjs [--expect-sha <sha>]
 *
 * `--expect-sha` additionally asserts `dist/build.txt` carries that commit,
 * which is what the deploy workflow stamps into the artifact.
 */

import { readdirSync, readFileSync, existsSync } from "node:fs"
import { join } from "node:path"

const dist = "dist"
const results = []
const failures = []

/** @param {string} name @param {boolean} cond @param {string} [detail] */
const check = (name, cond, detail = "") => {
  results.push(
    `${cond ? "ok  " : "FAIL"} ${name}${!cond && detail ? ` :: ${detail}` : ""}`
  )
  if (!cond) failures.push(name)
}

const read = (p) => readFileSync(join(dist, p), "utf8")
const exists = (p) => existsSync(join(dist, p))

/** Every `.html` under a dist-relative dir, recursively. */
const listHtml = (dir = "") =>
  readdirSync(join(dist, dir), { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? listHtml(join(dir, e.name))
      : e.name.endsWith(".html")
        ? [join(dir, e.name)]
        : []
  )

// The base path is owned by `astro.config.mjs`; read it instead of repeating it.
const base = readFileSync("astro.config.mjs", "utf8").match(
  /^const base = (["'])([^"']+)\1/m
)?.[2]
check(
  "base path readable from astro.config.mjs",
  !!base,
  'no `const base = "..."` found'
)
if (!base) {
  console.error(results.join("\n"))
  process.exit(1)
}

const posts = readdirSync("src/content/blog")
  .filter((f) => /\.mdx?$/.test(f))
  .map((f) => f.replace(/\.mdx?$/, ""))
const projects = readdirSync("src/content/projects")
  .filter((f) => /\.mdx?$/.test(f))
  .map((f) => f.replace(/\.mdx?$/, ""))

const html = read("index.html")
const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? ""
const origin = canonical.slice(0, canonical.indexOf(base))
check(
  "home page has an absolute canonical with base",
  canonical.startsWith(`https://`) && canonical.includes(`${base}/`),
  canonical
)

// Pages that exist regardless of content; blog/2 is pagination (pageSize 2).
const fixedPages = [
  "index.html",
  "about/",
  "projects/",
  "blog/",
  "blog/2/",
  "contact/",
  "search/",
  "tags/",
  "404.html",
  "robots.txt",
]
for (const page of fixedPages) check(`/${page} built`, exists(page))
check("internal links carry the base prefix", html.includes(`href="${base}/`))
check(
  "rss and json feeds built",
  exists("rss.xml") && exists("blog/rss.xml") && exists("blog/feed.json")
)

// --- pagefind --------------------------------------------------------------
check("pagefind index built", exists("pagefind/pagefind.js"))
const bodyPages = listHtml().filter((p) =>
  readFileSync(join(dist, p), "utf8").includes("data-pagefind-body")
)
check(
  "exactly one indexed page per post",
  bodyPages.length === posts.length,
  `${bodyPages.length} vs ${posts.length} posts`
)
check(
  "indexed pages are blog posts only",
  bodyPages.every((p) => p.startsWith("blog/"))
)
const search = read("search/index.html")
check("search page is noindex", search.includes("noindex"))
// The page drives Pagefind's JS API instead of its web components: our own
// input/results markup (shadcn chrome), so no component UI assets are loaded and
// no island is added.
check(
  "search page does not use the pagefind web components",
  !search.includes("<pagefind-") && !search.includes("pagefind-component-ui")
)
check(
  "search page carries its own input and results markup",
  search.includes("data-search-input") && search.includes("data-search-results")
)
check(
  "search page imports the pagefind module",
  search.includes("/pagefind/pagefind.js")
)
check(
  "search page renders the shadcn empty state",
  search.includes('data-slot="search-panel-state"') &&
    search.includes('data-slot="empty-title"')
)
check(
  "search page ships a no-JS fallback",
  search.includes("<noscript") && /Search needs JavaScript/.test(search)
)
check(
  "search page adds no island",
  !/client:(load|idle|visible|media|only)/.test(search)
)
// The search page must sit in the same content column as the other pages, or its
// heading and controls read as misaligned against the shared header. Compare the
// container signature against the blog index rather than hard-coding it.
const containerOf = (html) =>
  html.match(/<section class="([^"]*max-w-[^"]*)"/)?.[1] ?? ""
check(
  "search content uses the same container as the blog index",
  containerOf(search) !== "" &&
    containerOf(search) === containerOf(read("blog/index.html")),
  `search="${containerOf(search)}" blog="${containerOf(read("blog/index.html"))}"`
)
const searchCss = readdirSync(join(dist, "_astro"))
  .filter((f) => f.endsWith(".css"))
  .map((f) => read(`_astro/${f}`))
  .join("")
check(
  "stylesheet styles pagefind's excerpt highlights",
  searchCss.includes("[data-search-results] mark")
)
// The rail is styled in `@layer base` on `html`. Both halves matter: the WebKit
// pseudo-elements are what Chromium and older Safari paint, and the standard
// `scrollbar-color` is all Firefox reads. Losing either drops one engine back to
// the UA default. The reserved gutter width follows `scrollbar-width: thin`, so
// the two must ship together or the centered containers shift.
check(
  "stylesheet styles the scrollbar rail",
  searchCss.includes("::-webkit-scrollbar-thumb") &&
    searchCss.includes("scrollbar-color:") &&
    /html\{[^}]*scrollbar-gutter:stable[^}]*scrollbar-width:thin/.test(
      searchCss
    )
)

// --- page chrome consistency ----------------------------------------------
// One page-title voice: the mono page-title style on every index page. The
// homepage hero and the two detail pages are deliberately display-sans.
const titledPages = [
  ["about", "about/index.html"],
  ["contact", "contact/index.html"],
  ["projects", "projects/index.html"],
  ["blog", "blog/index.html"],
  ["tags", "tags/index.html"],
  ["search", "search/index.html"],
  ["404", "404.html"],
]
const offVoice = titledPages.filter(([, file]) => {
  const h1 = read(file).match(/<h1[^>]*class="([^"]*)"/)?.[1] ?? ""
  return !(h1.includes("font-mono") && h1.includes("text-2xl"))
})
// `font-heading text-2xl` is the sans page-title shape that used to sit on
// /search/ and /404/; nothing should reintroduce it.
const sansTitle = listHtml().filter((p) =>
  readFileSync(join(dist, p), "utf8").includes("font-heading text-2xl")
)
check(
  "page titles use the mono page-title style",
  offVoice.length === 0 && sansTitle.length === 0,
  `off-voice: ${offVoice.map(([l]) => l).join(", ") || "none"}; sans titles: ${sansTitle.join(", ") || "none"}`
)
// The `Empty` primitive ships `border-dashed` with no border width, so an empty
// state without `border` renders as floating text instead of the dashed box its
// siblings show. `border-dashed` comes from nowhere else in the output.
const emptyClasses = listHtml().flatMap((p) =>
  [
    ...readFileSync(join(dist, p), "utf8").matchAll(
      /class="([^"]*border-dashed[^"]*)"/g
    ),
  ].map((m) => ({ page: p, cls: m[1] }))
)
const boxless = emptyClasses.filter(
  ({ cls }) => !cls.split(/\s+/).includes("border")
)
check(
  "every rendered empty state keeps its dashed border",
  emptyClasses.length > 0 && boxless.length === 0,
  `${boxless.length}/${emptyClasses.length} without border (${boxless.map((e) => e.page).join(", ")})`
)
// Detail pages open with a back link to their collection so a deep link never
// dead-ends. On posts it sits inside `data-pagefind-body`, so it must carry
// `data-pagefind-ignore` or the label enters the search index.
const detailPages = [
  ...posts.map((id) => ({ page: `blog/${id}/index.html`, index: "blog" })),
  ...projects.map((id) => ({
    page: `projects/${id}/index.html`,
    index: "projects",
  })),
].filter(({ page }) => exists(page))
const noBackLink = detailPages.filter(({ page, index }) => {
  const html = readFileSync(join(dist, page), "utf8")
  const article = html.slice(html.indexOf("<article"))
  const firstHref = article.match(/<a[^>]*href="([^"]+)"/)?.[1] ?? ""
  return firstHref !== `${base}/${index}/`
})
check(
  "detail pages lead with a back link to their collection",
  detailPages.length > 0 && noBackLink.length === 0,
  noBackLink.map((d) => d.page).join(", ") ||
    `${detailPages.length} detail pages`
)

// --- sitemap ---------------------------------------------------------------
const sitemap = read("sitemap-0.xml")
const locs = sitemap.match(/<loc>/g)?.length ?? 0
// Pages the sitemap may list: every built page except the noindex ones
// (/search/, /tags/), generated assets (/og/) and non-pages (404, robots).
const crawlable = [
  "index.html",
  "about/",
  "projects/",
  "blog/",
  "blog/2/",
  "contact/",
]
check(
  "sitemap lists every crawlable page exactly once",
  locs === crawlable.length + posts.length + projects.length,
  `${locs} <loc> for ${crawlable.length + posts.length + projects.length} expected`
)
check(
  "sitemap excludes /tags/ /search/ /og/",
  !/\/(tags|search|og)\//.test(sitemap)
)
const lastmod = sitemap.match(/<lastmod>/g)?.length ?? 0
check(
  "sitemap stamps content pages with lastmod",
  lastmod === posts.length + projects.length,
  `${lastmod} for ${posts.length + projects.length} pages`
)

// --- islands, view transitions, prefetch ----------------------------------
check(
  "ClientRouter enabled",
  html.includes("astro-view-transitions-enabled") &&
    html.includes("ClientRouter")
)
const themeToggle =
  html.match(/<astro-island[^>]*client="idle"[^>]*>/)?.[0] ?? ""
check("ThemeToggle island hydrates client:idle", !!themeToggle)
check(
  "ThemeToggle persisted across swaps",
  themeToggle.includes('data-astro-transition-persist="theme-toggle"')
)
const mobileNav =
  html.match(/<astro-island[^>]*client="media"[^>]*>/)?.[0] ?? ""
check(
  "MobileNav island hydrates client:media at 767px",
  mobileNav.includes("(max-width: 767px)")
)
const prefetchChunk = html.match(/\/_astro\/(page\.[\w-]+\.js)/)?.[1]
check(
  "prefetch loader chunk referenced and built",
  !!prefetchChunk && exists(join("_astro", prefetchChunk)),
  prefetchChunk ?? "none"
)
const assets = readdirSync(join(dist, "_astro"))
const prefetchJs = assets.filter((f) => /^prefetch\.[\w-]+\.js$/.test(f))
check(
  "prefetch implementation chunk exists",
  prefetchJs.length === 1,
  `${prefetchJs.length} chunks`
)
check(
  "prefetch waits for hover (not load)",
  prefetchJs.length === 1 &&
    readFileSync(join(dist, "_astro", prefetchJs[0]), "utf8").includes(
      "mouseenter"
    )
)

// --- theme and styles ------------------------------------------------------
const mainCss = assets.filter((f) => /^main\.[\w-]+\.css$/.test(f))
check(
  "exactly one main css bundle",
  mainCss.length === 1,
  `${mainCss.length} candidates`
)
const css =
  mainCss.length === 1
    ? readFileSync(join(dist, "_astro", mainCss[0]), "utf8")
    : ""
check(
  "theme tokens present",
  css.includes("--background") && css.includes(".dark")
)
// Every `rounded-*` utility resolves to `var(--radius)`, so a missing base token
// silently squares every shadcn control site-wide.
check("base radius token is defined", /--radius:[^;]/.test(css))
// The navbar is one component on all 12 pages, but a page tall enough to scroll
// loses ~15px of viewport to the scrollbar, which shifts the centered
// `max-w-5xl` header by ~7.5px. Reserving the gutter keeps every route aligned.
check(
  "stylesheet reserves the scrollbar gutter",
  /scrollbar-gutter:\s*stable/.test(css)
)
check(
  "pagefind's stock component CSS is not shipped",
  !/:root:root\{[^}]*--pf-/.test(css) && !css.includes("--pf-background")
)
check(
  "search result highlights follow the accent token",
  css.includes("color-mix(in srgb, var(--primary)") &&
    css.includes("[data-search-results] mark")
)
check(
  "reading progress styles present",
  css.includes("reading-progress") && css.includes("scroll(root)")
)
check(
  "print styles present",
  css.includes("@media print") && css.includes("header,footer{display:none")
)
check(
  "view transitions killed under reduced motion",
  css.includes("prefers-reduced-motion") &&
    css.includes("::view-transition-group(*)")
)

// --- OG images -------------------------------------------------------------
for (const slug of posts) {
  const file = join("og/blog", `${slug}.png`)
  check(`og image built for ${slug}`, exists(file))
  if (!exists(file)) continue
  const buf = readFileSync(join(dist, file))
  const isPng = buf
    .subarray(0, 8)
    .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  check(
    `${slug} og image is a 1200x630 png`,
    isPng && buf.readUInt32BE(16) === 1200 && buf.readUInt32BE(20) === 630
  )
  check(
    `post ${slug} references its og image`,
    read(`blog/${slug}/index.html`).includes(`${base}/og/blog/${slug}.png`)
  )
}
check("shared og.png built", exists("og.png"))
check(
  "projects index references the shared og image",
  read("projects/index.html").includes(`${base}/og.png`)
)
for (const slug of projects) {
  const file = join("og/projects", `${slug}.png`)
  check(`og image built for project ${slug}`, exists(file))
  if (!exists(file)) continue
  const buf = readFileSync(join(dist, file))
  const isPng = buf
    .subarray(0, 8)
    .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  check(
    `${slug} og image is a 1200x630 png`,
    isPng && buf.readUInt32BE(16) === 1200 && buf.readUInt32BE(20) === 630
  )
  check(
    `project ${slug} references its og image`,
    read(`projects/${slug}/index.html`).includes(
      `${base}/og/projects/${slug}.png`
    )
  )
}
// `image` reaches the layout base-relative and `absolute()` adds the base; a
// caller that pre-prefixes it yields `/site/site/...`.
const doubled = listHtml().filter((p) =>
  readFileSync(join(dist, p), "utf8").includes(`${base}${base}/`)
)
check(
  "no page double-prefixes the base path",
  doubled.length === 0,
  doubled.slice(0, 3).join(", ")
)

// --- feeds -----------------------------------------------------------------
check(
  "rss item links carry the base",
  read("blog/rss.xml").includes(`${base}/blog/`) &&
    !read("blog/rss.xml").includes(`${base.slice(0, -1)}blog/`)
)
const feed = JSON.parse(read("blog/feed.json"))
check("json feed is v1.1", feed.version === "https://jsonfeed.org/version/1.1")
check(
  "json feed urls are absolute and based",
  feed.feed_url === `${origin}${base}/blog/feed.json` &&
    (feed.items ?? []).every((i) =>
      i.url?.startsWith(`${origin}${base}/blog/`)
    ),
  feed.feed_url ?? "no feed_url"
)
check(
  "json feed items cover every post, full text",
  (feed.items ?? []).length === posts.length &&
    (feed.items ?? []).every((i) => (i.content_html ?? "").length > 0)
)
check(
  "json feed items carry their post og image",
  (feed.items ?? []).every(
    (i) =>
      i.image ===
      `${origin}${base}/og/blog/${i.id?.match(/\/blog\/([^/]+)\/$/)?.[1]}.png`
  )
)

// --- tags hub --------------------------------------------------------------
check("tags hub is noindex", read("tags/index.html").includes("noindex"))

// --- deployment stamp ------------------------------------------------------
// `exists`/`read` already prefix `dist`, so these take the dist-relative name.
// Passing an already-joined path here made `exists` look for `dist/dist/...`,
// which never exists — so the stamp check could never pass and the local
// absence check could never fail.
const shaArg = process.argv.indexOf("--expect-sha")
if (shaArg !== -1) {
  const expected = process.argv[shaArg + 1]
  const actual = exists("build.txt") ? read("build.txt").trim() : "missing"
  check(
    "dist/build.txt matches the expected commit",
    actual === expected,
    `${actual} vs ${expected}`
  )
} else {
  check(
    "no build.txt in a local build (deploy-workflow stamp only)",
    !exists("build.txt")
  )
}

console.log(results.join("\n"))
if (failures.length) {
  console.error(`\n${failures.length} dist check(s) failed.`)
  process.exit(1)
}
console.log(
  `\nAll ${results.length} dist checks passed (${posts.length} posts, ${projects.length} projects, ${listHtml().length} html files).`
)
