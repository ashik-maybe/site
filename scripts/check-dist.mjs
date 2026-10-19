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
  results.push(`${cond ? "ok  " : "FAIL"} ${name}${!cond && detail ? ` :: ${detail}` : ""}`)
  if (!cond) failures.push(name)
}

const read = (p) => readFileSync(join(dist, p), "utf8")
const exists = (p) => existsSync(join(dist, p))

/** Every `.html` under a dist-relative dir, recursively. */
const listHtml = (dir = "") =>
  readdirSync(join(dist, dir), { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? listHtml(join(dir, e.name)) : e.name.endsWith(".html") ? [join(dir, e.name)] : [],
  )

// The base path is owned by `astro.config.mjs`; read it instead of repeating it.
const base = readFileSync("astro.config.mjs", "utf8").match(/^const base = (["'])([^"']+)\1/m)?.[2]
check("base path readable from astro.config.mjs", !!base, 'no `const base = "..."` found')
if (!base) {
  console.error(results.join("\n"))
  process.exit(1)
}

const posts = readdirSync("src/content/blog").filter((f) => /\.mdx?$/.test(f)).map((f) => f.replace(/\.mdx?$/, ""))
const projects = readdirSync("src/content/projects").filter((f) => /\.mdx?$/.test(f)).map((f) => f.replace(/\.mdx?$/, ""))

const html = read("index.html")
const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? ""
const origin = canonical.slice(0, canonical.indexOf(base))
check("home page has an absolute canonical with base", canonical.startsWith(`https://`) && canonical.includes(`${base}/`), canonical)

// Pages that exist regardless of content; blog/2 is pagination (pageSize 2).
const fixedPages = ["index.html", "about/", "projects/", "blog/", "blog/2/", "contact/", "search/", "tags/", "404.html", "robots.txt"]
for (const page of fixedPages) check(`/${page} built`, exists(page))
check("internal links carry the base prefix", html.includes(`href="${base}/`))
check("rss and json feeds built", exists("rss.xml") && exists("blog/rss.xml") && exists("blog/feed.json"))

// --- pagefind --------------------------------------------------------------
check("pagefind index built", exists("pagefind/pagefind.js"))
check("pagefind component UI css/js built", exists("pagefind/pagefind-component-ui.css") && exists("pagefind/pagefind-component-ui.js"))
const bodyPages = listHtml().filter((p) => readFileSync(join(dist, p), "utf8").includes("data-pagefind-body"))
check("exactly one indexed page per post", bodyPages.length === posts.length, `${bodyPages.length} vs ${posts.length} posts`)
check("indexed pages are blog posts only", bodyPages.every((p) => p.startsWith("blog/")))
const search = read("search/index.html")
check("search page is noindex", search.includes("noindex"))
check("search page wires config + template", search.includes("<pagefind-config") && search.includes("text/pagefind-template"))
check("search page loads the component UI", search.includes("pagefind-component-ui.css") && search.includes("pagefind-component-ui.js"))

// --- sitemap ---------------------------------------------------------------
const sitemap = read("sitemap-0.xml")
const locs = sitemap.match(/<loc>/g)?.length ?? 0
// Pages the sitemap may list: every built page except the noindex ones
// (/search/, /tags/), generated assets (/og/) and non-pages (404, robots).
const crawlable = ["index.html", "about/", "projects/", "blog/", "blog/2/", "contact/"]
check("sitemap lists every crawlable page exactly once", locs === crawlable.length + posts.length + projects.length, `${locs} <loc> for ${crawlable.length + posts.length + projects.length} expected`)
check("sitemap excludes /tags/ /search/ /og/", !/\/(tags|search|og)\//.test(sitemap))
const lastmod = sitemap.match(/<lastmod>/g)?.length ?? 0
check("sitemap stamps content pages with lastmod", lastmod === posts.length + projects.length, `${lastmod} for ${posts.length + projects.length} pages`)

// --- islands, view transitions, prefetch ----------------------------------
check("ClientRouter enabled", html.includes("astro-view-transitions-enabled") && html.includes("ClientRouter"))
const themeToggle = html.match(/<astro-island[^>]*client="idle"[^>]*>/)?.[0] ?? ""
check("ThemeToggle island hydrates client:idle", !!themeToggle)
check("ThemeToggle persisted across swaps", themeToggle.includes('data-astro-transition-persist="theme-toggle"'))
const mobileNav = html.match(/<astro-island[^>]*client="media"[^>]*>/)?.[0] ?? ""
check("MobileNav island hydrates client:media at 767px", mobileNav.includes("(max-width: 767px)"))
const prefetchChunk = html.match(/\/_astro\/(page\.[\w-]+\.js)/)?.[1]
check("prefetch loader chunk referenced and built", !!prefetchChunk && exists(join("_astro", prefetchChunk)), prefetchChunk ?? "none")
const assets = readdirSync(join(dist, "_astro"))
const prefetchJs = assets.filter((f) => /^prefetch\.[\w-]+\.js$/.test(f))
check("prefetch implementation chunk exists", prefetchJs.length === 1, `${prefetchJs.length} chunks`)
check("prefetch waits for hover (not load)", prefetchJs.length === 1 && readFileSync(join(dist, "_astro", prefetchJs[0]), "utf8").includes("mouseenter"))

// --- theme and styles ------------------------------------------------------
const mainCss = assets.filter((f) => /^main\.[\w-]+\.css$/.test(f))
check("exactly one main css bundle", mainCss.length === 1, `${mainCss.length} candidates`)
const css = mainCss.length === 1 ? readFileSync(join(dist, "_astro", mainCss[0]), "utf8") : ""
check("theme tokens present", css.includes("--background") && css.includes(".dark"))
check("pagefind vars mapped with :root:root (order-independent)", /:root:root\{[^}]*--pf-/.test(css))
check("reading progress styles present", css.includes("reading-progress") && css.includes("scroll(root)"))
check("print styles present", css.includes("@media print") && css.includes("header,footer{display:none"))
check("view transitions killed under reduced motion", css.includes("prefers-reduced-motion") && css.includes("::view-transition-group(*)"))

// --- OG images -------------------------------------------------------------
for (const slug of posts) {
  const file = join("og/blog", `${slug}.png`)
  check(`og image built for ${slug}`, exists(file))
  if (!exists(file)) continue
  const buf = readFileSync(join(dist, file))
  const isPng = buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  check(`${slug} og image is a 1200x630 png`, isPng && buf.readUInt32BE(16) === 1200 && buf.readUInt32BE(20) === 630)
  check(`post ${slug} references its og image`, read(`blog/${slug}/index.html`).includes(`${base}/og/blog/${slug}.png`))
}
check("shared og.png built", exists("og.png"))
check("projects index references the shared og image", read("projects/index.html").includes(`${base}/og.png`))
for (const slug of projects) {
  const file = join("og/projects", `${slug}.png`)
  check(`og image built for project ${slug}`, exists(file))
  if (!exists(file)) continue
  const buf = readFileSync(join(dist, file))
  const isPng = buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  check(`${slug} og image is a 1200x630 png`, isPng && buf.readUInt32BE(16) === 1200 && buf.readUInt32BE(20) === 630)
  check(`project ${slug} references its og image`, read(`projects/${slug}/index.html`).includes(`${base}/og/projects/${slug}.png`))
}
// `image` reaches the layout base-relative and `absolute()` adds the base; a
// caller that pre-prefixes it yields `/site/site/...`.
const doubled = listHtml().filter((p) => readFileSync(join(dist, p), "utf8").includes(`${base}${base}/`))
check("no page double-prefixes the base path", doubled.length === 0, doubled.slice(0, 3).join(", "))

// --- feeds -----------------------------------------------------------------
check("rss item links carry the base", read("blog/rss.xml").includes(`${base}/blog/`) && !read("blog/rss.xml").includes(`${base.slice(0, -1)}blog/`))
const feed = JSON.parse(read("blog/feed.json"))
check("json feed is v1.1", feed.version === "https://jsonfeed.org/version/1.1")
check("json feed urls are absolute and based", feed.feed_url === `${origin}${base}/blog/feed.json` && (feed.items ?? []).every((i) => i.url?.startsWith(`${origin}${base}/blog/`)), feed.feed_url ?? "no feed_url")
check("json feed items cover every post, full text", (feed.items ?? []).length === posts.length && (feed.items ?? []).every((i) => (i.content_html ?? "").length > 0))
check("json feed items carry their post og image", (feed.items ?? []).every((i) => i.image === `${origin}${base}/og/blog/${i.id?.match(/\/blog\/([^/]+)\/$/)?.[1]}.png`))

// --- tags hub --------------------------------------------------------------
check("tags hub is noindex", read("tags/index.html").includes("noindex"))

// --- deployment stamp ------------------------------------------------------
const stampPath = join(dist, "build.txt")
const shaArg = process.argv.indexOf("--expect-sha")
if (shaArg !== -1) {
  const expected = process.argv[shaArg + 1]
  check("dist/build.txt matches the expected commit", exists(stampPath) && read("build.txt").trim() === expected, `${exists(stampPath) ? read("build.txt").trim() : "missing"} vs ${expected}`)
} else {
  check("no build.txt in a local build (deploy-workflow stamp only)", !exists(stampPath))
}

console.log(results.join("\n"))
if (failures.length) {
  console.error(`\n${failures.length} dist check(s) failed.`)
  process.exit(1)
}
console.log(`\nAll ${results.length} dist checks passed (${posts.length} posts, ${projects.length} projects, ${listHtml().length} html files).`)
