---
title: Endpoints
aliases: [API Routes, File Endpoints, GET POST]
tags: [astro, data, endpoints, ssr]
level: intermediate
---

# 41 · Endpoints

> [!abstract] In one line
> A `.ts` file in `src/pages/` that exports `GET`/`POST`/… is an HTTP endpoint —
> the same routing as pages, but it returns a `Response`, not a document.

## Mental model

```mermaid
flowchart LR
  F["src/pages/blog/rss.xml.ts"] --> R["route /blog/rss.xml"]
  R --> H["export async function GET()"]
  H --> Res["Response (XML, JSON, text, …)"]
```

Routing is identical to pages ([[04-routing]]): the file path *is* the URL. The
difference is the file exports **request handlers** instead of a component.

## How it works

```ts
// src/pages/api/health.ts
import type { APIRoute } from "astro"

export const GET: APIRoute = () => {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  })
}
```

Supported exports: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`, `HEAD`, and
`ALL`. A method you don't export returns `405`.

This repo has three, all **static**:

| File | Serves | Note |
|---|---|---|
| `src/pages/robots.txt.ts` | `/robots.txt` | inert on a project site ([[15-feeds-sitemap-seo]]) |
| `src/pages/blog/rss.xml.ts` | `/blog/rss.xml` | builds the feed |
| `src/pages/rss.xml.ts` | `/rss.xml` | `export { GET } from "./blog/rss.xml"` |

That last one is the whole trick: an endpoint is just a module, so re-exporting a
handler **aliases** a route with zero duplication.

## Static vs on-demand

- **Static build:** endpoints are prerendered at build time and only `GET` makes
  sense (there's no request). This repo's feeds and `robots.txt` are static.
- **SSR:** with `output: "server"` (or `export const prerender = false`), handlers
  run per request, so any method, headers, cookies, and params work
  ([[51-ssg-ssr-hybrid]]).

```ts
// run this one endpoint on demand, even in a static site
export const prerender = false
```

## Reading the request

```ts
export const POST: APIRoute = async ({ request, params, cookies, url }) => {
  const body = await request.json()
  const token = cookies.get("session")?.value
  return new Response("created", { status: 201 })
}
```

The context gives you `request`, `params`, `url`, `cookies`, `redirect`, and
`locals` ([[53-middleware]]).

## Gotchas

> [!warning] Don't `JSON.stringify` by hand if you don't have to
> It's fine, but remember to set `Content-Type`. For JSON specifically, returning a
> `Response` with the header is the classic footgun; a helper or explicit header
> avoids "why is my fetch parsing text".

> [!warning] Static endpoints ignore the method (mostly)
> In a static build, a `POST` handler won't run — there's no server. If you need
> `POST`, that route must be on-demand.

> [!warning] Endpoints can't return HTML by accident
> They can return HTML via `Content-Type: text/html`, but they don't render
> `.astro`. If you want a page, write a page.

> [!warning] `redirect()` and status codes
> Return a real `Response` (or `redirect("/x")`) with a correct status. Don't return
> a 200 with an error body — clients and crawlers believe you.

## Exercise

- [ ] Open `src/pages/rss.xml.ts` and explain how two URLs end up serving identical
      XML from one implementation.
- [ ] Add `src/pages/api/ping.ts` returning `{ pong: true }`, build, and `cat`
      `dist/api/ping/index.html`… or discover what path it actually lands on.
- [ ] Decide which of the three existing endpoints would need `prerender = false`
      if it had to read a cookie.

> [!question]- When is an endpoint better than a data fetch inside a page?
> When the data has a *different* consumer or caching story: a feed, a sitemap, an
> API for a client island, or a webhook. Same-origin data that only a page needs
> can just be read in the page.

## Further reading
- Astro — *Endpoints* <https://docs.astro.build/en/guides/endpoints/>
- Astro — *`APIRoute` reference* <https://docs.astro.build/en/reference/api-reference/>

Prev: [[34-code-blocks-expressive-code]] · Next: [[42-external-apis]] · Index: [[00-index]]
