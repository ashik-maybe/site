# Edit text

Change the words visitors read. Nothing here changes how the site works, only
what it says.

**Where to look:** every task below names the file and the exact spot.

---

## Your name

**File:** `src/config.ts`

Find the lines:

```ts
name: "John Doe",
title: "John Doe",
```

`name` is used in the header, the copyright line, and social sharing.
`title` is the browser tab on the home page. Usually both are your name.

Replace `John Doe` with your name, keeping the quotes:

```ts
name: "Your Name",
title: "Your Name",
```

---

## The search-engine blurb

**File:** `src/config.ts`

Find:

```ts
description:
  "Portfolio, blog, and notes from a CSE undergrad working on software engineering and AI.",
```

Replace the quoted sentence with your own. Keep the quotes, keep it one
sentence. Delete the old text entirely.

---

## The home page

**File:** `src/pages/index.astro`

This is the first page visitors see. Three things to change.

**1. The big headline.** Find `<h1` and, further along the line, the words:

```
I'm John Doe. I study computer science and build things in software and AI.
```

Change those words. Keep everything else on the line.

**2. The line under it.** Find the paragraph beginning:

```
This is where I write up what I learn and collect the projects I've shipped.
```

**3. The "About" blurb** lower down. Find:

```
CSE undergrad with a focus on software engineering and AI.
```

**Tip:** change one thing, save, then look at the site. Repeat. Small steps.

---

## The About page

**File:** `src/pages/about.astro`

**Tagline** — find the line near the top:

```
CSE undergrad, SWE/AI focus
```

**Intro paragraph** — find:

```
My name is John Doe. I study computer science and build things in software and AI...
```

**Education** — find the Education card:

```
<CardTitle>Degree (replace me)</CardTitle>
<CardDescription>
  Example University (placeholder), TODO — expected year
</CardDescription>
```

Replace with your degree and school. Keep the tags (`<CardTitle>` etc.) and
change only the text between them.

**Experience** — near the top of the file there is a list called `timeline`:

```ts
const timeline = [
  {
    role: "Example Role (replace me)",
    org: "Example Company (placeholder)",
    period: "TODO — your dates",
    detail: "One line about what you shipped and what it changed.",
  },
  ...
]
```

Replace the values, keeping the quotes and commas. To **remove** an entry,
delete the whole block from `{` to `},`. To **add** one, copy a block, paste it
below, and edit. If you have no experience to show yet, delete both blocks so
the list is empty.

**Interests** — find the last paragraph:

```
Competitive programming, terminal tooling, machine learning papers, chess.
```

**Skills** — the list called `raw` near the top. Each `group` is a heading;
each `items` list is the words under it. Add or remove items inside the
`[ "..." ]` brackets, separated by commas.

---

## The contact page

**File:** `src/pages/contact.astro`

Change the paragraphs — the ones saying how to reach you. The email link
itself is set elsewhere; see [`change-links.md`](change-links.md).

---

## Files this touched

- `src/config.ts`
- `src/pages/index.astro`
- `src/pages/about.astro`
- `src/pages/contact.astro`

After editing, run the check: [`checking.md`](checking.md).
