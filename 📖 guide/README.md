# 📖 Guide

A plain-language manual for running this website. No prior knowledge of Astro,
or of any web framework, is assumed.

You write text in files, save, and push. That is the whole job.

---

## Start here

If this is your first time, read in this order:

1. **Your info** — fill in your name, email, and links. See [`data/your-info.md`](data/your-info.md).
2. **Edit text** — change the words visitors see. See [`edit-text.md`](edit-text.md).
3. **Publish** — make it live. See [`publish.md`](publish.md).

After that, look up one task at a time. You never need to read the whole guide.

---

## Looking for…?

This is the map. Find what you want to change, then open the file in the
right-hand column.

| I want to change… | Open this file | Where inside |
| --- | --- | --- |
| My name | `src/config.ts` | the `name:` line |
| The browser tab title | `src/config.ts` | the `title:` line |
| The search-engine blurb | `src/config.ts` | the `description:` line |
| My email address | `src/config.ts` | the line starting `mailto:` |
| My social links | `src/config.ts` | the `socials:` list |
| The menu at the top | `src/config.ts` | the `nav:` list |
| The headline on the home page | `src/pages/index.astro` | the words inside `<h1>` |
| The short "about" blurb on the home page | `src/pages/index.astro` | the about section |
| The long "about" page | `src/pages/about.astro` | the paragraphs below the name |
| My education | `src/pages/about.astro` | the Education card |
| My work experience | `src/pages/about.astro` | the `timeline` list near the top |
| My skills | `src/pages/about.astro` | the `raw` list near the top |
| My interests | `src/pages/about.astro` | the last paragraph |
| The contact page | `src/pages/contact.astro` | the paragraphs |
| A blog post | `src/content/blog/` | one file per post |
| A project | `src/content/projects/` | one file per project |
| Colours and fonts | `src/styles/global.css` | the top section |
| The tab icon (favicon) | `public/favicon.svg` | — |
| The social-share image | `public/og.png` | — |
| The copyright name | `LICENSE` and `src/config.ts` | — |
| The website address | `src/config.ts` | the `site:` line |
| The repository folder name | `astro.config.mjs` | the `base` line |

If what you want is not listed, it is probably a "words" change — find the
words in the table under **[Edit text](edit-text.md)**.

---

## How this site is arranged

```
You edit these:
  src/config.ts           your name, email, links, menu  (start here)
  src/pages/…             the pages: home, about, contact
  src/content/blog/…      one text file per blog post
  src/content/projects/…  one text file per project
  public/…                images (favicon, share image)

You normally ignore these:
  src/components/…        building blocks the pages are made of
  src/lib/…               behind-the-scenes helpers
  src/styles/global.css   colours and fonts (editable, see design.md)
  scripts/…               the automatic checks
```

**The rule of thumb:** if it is a *word*, you can change it. If it is inside
`< >` or `{ }` and you do not understand it, leave it alone.

---

## Two kinds of files

**Simple text files** (blog posts, projects) — they start with a block between
two lines of `---`. That block is the *label*; the text below it is the *body*.
Both are just text. Edit freely.

**Page files** (`.astro`) — a web page. Words are between `<tags>` like
`<p>hello</p>`. Change the words, keep the tags. When unsure, change only the
text you can read on the live site.

---

## The one safety net

Before you publish, run one command. It tells you if you broke something:

```
bun run verify
```

If it ends with **All checks passed**, you are safe. If it shows an **error**,
see [`checking.md`](checking.md). This catches almost every beginner mistake
(a mistyped date, a missing quote, a broken tag) before anyone sees it.

---

## What is in this folder

| File | What it is for |
| --- | --- |
| [`data/your-info.md`](data/your-info.md) | Fill in your details here first |
| [`edit-text.md`](edit-text.md) | Change the words on the site |
| [`change-links.md`](change-links.md) | Change your email, menu, social links |
| [`add-a-post.md`](add-a-post.md) | Write a new blog post |
| [`add-a-project.md`](add-a-project.md) | Add a new project |
| [`images.md`](images.md) | Replace the icon, share image, or photo |
| [`design.md`](design.md) | Colours, fonts, and the house rules |
| [`checking.md`](checking.md) | Run the checks and read the result |
| [`publish.md`](publish.md) | Put the site online |
| [`troubleshooting.md`](troubleshooting.md) | Something looks wrong — start here |
| [`templates/`](templates/) | Blank copies to start from |
