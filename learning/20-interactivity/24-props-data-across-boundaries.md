---
title: Props Across the Boundary
aliases: [Serializing Props, Astro to React, Islands Props]
tags: [astro, interactivity, props, serialization]
level: intermediate
---

# 24 · Props Across the Boundary

> [!abstract] In one line
> Props an island receives must be **serializable** — they're embedded in the HTML
> and handed to the client, not passed in memory.

## Mental model

When Astro renders an island, it writes the HTML *and* a payload of props. At
hydration, the client reconstructs those props and mounts the framework component
with them:

```mermaid
flowchart LR
  A[".astro passes current='...'"] --> S["server renders island HTML"]
  S --> E["props serialized into the page"]
  E --> B["browser hydrates island"]
  B --> P["React receives { current: '...' }"]
```

Props cross a **process boundary** (server → browser) and a **language boundary**
(server code → JSON-ish data). That's why the rules are strict.

## How it works

```astro
---
import MobileNav from "@/components/layout/MobileNav"
const withoutBase = Astro.url.pathname.replace(import.meta.env.BASE_URL, "") || "/"
const current = withoutBase.length > 1 ? withoutBase.replace(/\/$/, "") : withoutBase
---
<MobileNav client:idle current={current} className="size-9 md:hidden" />
```

Here `current` is a **string**. That's the sweet spot: strings, numbers, booleans,
arrays, plain objects, and `null` all serialize cleanly.

```tsx
// MobileNav.tsx
export default function MobileNav({ current, className }: {
  current: string
  className?: string
}) { /* … */ }
```

The React type declares what the client expects; the `.astro` call site supplies
it. Keep the two in sync — Astro doesn't type-check across the JSX/TSX boundary
for you by default.

## What serializes — and what doesn't

| Value | Serializes? | Fix |
|---|---|---|
| string / number / boolean | yes | — |
| array / plain object | yes | — |
| `null` / `undefined` | yes | — |
| `Date` | no (loses type) | pass an ISO string, re-parse client-side |
| function / callback | no | use DOM events, or an island's own API |
| class instance / `Map` / `Set` | no | convert to plain data |
| imported component | no | pass data, not components; use slots |

> [!warning] A function prop cannot be an island prop
> `onClick={() => …}` from an `.astro` file doesn't exist on the client. Islands
> wire their own handlers internally. The interaction belongs **inside** the island.

## Passing content, not just data

Children work as a slot-like mechanism:

```astro
<Panel client:visible>
  <p>This markup is rendered by Astro and slotted in.</p>
</Panel>
```

For React, that content arrives as ordinary `children` — but it's server-rendered
HTML unless it's itself another island. Great for "framed by an island, filled by
static markup."

## Gotchas

> [!warning] Serialized props are visible in the HTML
> Never pass secrets to an island. Anything in props is in the page source
> ([[06-rendering-model]]). Secrets stay in SSR-only code.

> [!warning] Big props = big pages
> Passing a large object (a whole collection, a full page model) inlines it into
> the HTML. Pass the **minimum**: an id, a slug, the few fields the widget needs.

> [!warning] Server-only objects
> `Astro.request`, `URL` instances, and Node buffers don't survive the trip.
> Extract what you need as plain values first.

## Exercise

- [ ] In `Header.astro`, trace `current`: where is it computed, what type is it,
      and how does `MobileNav` use it to mark the active link?
- [ ] Try passing a `Date` prop to an island and inspect what the client receives
      (it won't be a `Date`). Write the one-line fix (ISO string).
- [ ] Decide: could `className="size-9"` instead be applied inside the island? What
      are the trade-offs of styling at the call site vs inside the component?

> [!question]- Why not just give islands free access to server data?
> Because islands run on the **visitor's** machine — you can't ship your server's
> memory or your secrets with them. Serialization is the boundary that keeps the
> two worlds honest: only data you explicitly pass crosses, and it crosses in the
> clear.

## Further reading
- Astro — *Passing props to framework components* <https://docs.astro.build/en/guides/framework-components/#passing-props-to-framework-components>

Prev: [[23-framework-integration]] · Next: [[25-when-not-to-hydrate]] · Index: [[00-index]]
