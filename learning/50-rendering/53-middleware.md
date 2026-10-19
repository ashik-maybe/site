---
title: Middleware
aliases: [astro:middleware, defineMiddleware, onRequest, locals]
tags: [astro, rendering, middleware, ssr]
level: advanced
---

# 53 · Middleware

> [!abstract] In one line
> Middleware is code that runs **before every on-demand route**, able to inspect
> the request, attach data to `locals`, redirect, rewrite, or short-circuit.

## Mental model

```mermaid
flowchart LR
  R["Request"] --> M1["middleware 1"]
  M1 --> M2["middleware 2"]
  M2 --> P["Page / endpoint renders"]
  P --> M2b["middleware 2 (after next())"]
  M2b --> M1b["middleware 1"]
  M1b --> Res["Response"]
```

Middleware forms an **onion**: each layer runs `next()` and can inspect the
response on the way out. It runs only for **on-demand** routes — a prerendered page
has no request to intercept ([[51-ssg-ssr-hybrid]]).

## How it works

Create `src/middleware.ts`:

```ts
import { defineMiddleware } from "astro:middleware"

export const onRequest = defineMiddleware(async (context, next) => {
  const start = performance.now()
  context.locals.user = await getUser(context.cookies)
  const response = await next()
  response.headers.set("x-render-ms", (performance.now() - start).toFixed(1))
  return response
})
```

Every request (for dynamic routes) passes through `onRequest`.

## `locals` — request-scoped data

```ts
// src/env.d.ts — make locals typed
declare namespace App {
  interface Locals {
    user: { id: string; name: string } | null
  }
}
```

Then any dynamic page/component reads `Astro.locals.user`. This is the standard way
to pass "who is calling" from middleware to pages without re-fetching.

> [!warning] `locals` must stay serializable
> Astro ships `isLocalsSerializable` for a reason — `locals` can cross into
> serialization (e.g. server islands, [[54-server-islands-partials]]). Keep it plain
> data: no class instances, functions, or DB clients.

## Composing middleware

```ts
import { sequence } from "astro:middleware"

const auth = defineMiddleware((ctx, next) => {
  if (!ctx.locals.user && ctx.url.pathname.startsWith("/account")) {
    return ctx.redirect("/login")
  }
  return next()
})

export const onRequest = sequence(logging, auth)
```

`sequence()` runs them in order and unwinds in reverse.

## Redirect / rewrite / short-circuit

```ts
return context.redirect("/login", 302)     // stop and send a redirect
return context.rewrite("/404")             // render another route, same URL
return new Response("nope", { status: 403 }) // stop with a response
```

Not calling `next()` (and returning a response) short-circuits everything after it.

## Gotchas

> [!warning] Middleware doesn't run for prerendered pages
> This surprises people: a static page bypasses `src/middleware.ts` entirely. If you
> need per-request logic, that route must be on-demand.

> [!warning] Don't do heavy work on every request
> Middleware is the hot path for *all* dynamic routes. Cache lookups, keep it fast,
> and don't open a DB connection per call ([[43-data-persistence]]).

> [!warning] Security belongs here
> Auth checks, CSRF tokens, security headers, and bot blocking are middleware's job.
> Center them so a new route can't forget them.

> [!warning] Order matters in `sequence`
> Auth before logging is different from logging before auth. Decide the onion
> deliberately.

## Exercise

- [ ] Add `src/middleware.ts` with a logging middleware to this repo, set the RSS
      route to `prerender = false`, and watch logs appear only for that route.
- [ ] Set a security header (`x-content-type-options: nosniff`) in middleware and
      confirm it's on dynamic responses but not on static ones.
- [ ] Write an auth guard that protects `/account/*` and explain which `locals`
      field it depends on.

> [!question]- Why an "onion" and not just "before"?
> Because responses need post-processing too: timing, compression, cookies, header
> rewrites. The onion lets a layer wrap the whole route, not just its entry.

## Further reading
- Astro — *Middleware* <https://docs.astro.build/en/guides/middleware/>

Prev: [[52-adapters]] · Next: [[54-server-islands-partials]] · Index: [[00-index]]
