# Troubleshooting

Something looks wrong. Find the symptom, apply the fix.

If you are unsure, run `bun run verify` first — see [`checking.md`](checking.md).
It names the problem more precisely than the live site does.

---

## My change did not appear

- **Did you save the file?** Most editors show an unsaved dot on the tab.
- **Did you publish?** Editing alone does nothing until you push — see [`publish.md`](publish.md).
- **Wait a minute.** GitHub takes a moment to rebuild. Watch the Actions tab.
- **Hard-refresh the page.** Your browser caches old pages. `Ctrl+Shift+R` (or `Cmd+Shift+R`).

---

## The site built but a page looks broken

Likely a stray tag while editing a page file. When editing `.astro` files,
change **only the words between the tags**, never the tags themselves.

Compare your edit against the original. A missing `</p>`, a deleted backtick, or
a broken quote is the usual cause.

---

## A blog post or project does not show up

Open the file and check the top block, between the two `---` lines:

| Check | Looks right | Looks wrong |
| --- | --- | --- |
| Quotes | `title: "Hello"` | `title: Hello` |
| Date | `pubDate: 2026-01-01` | `pubDate: 01/01/2026` |
| Tags | `tags: ["Notes", "Python"]` | `tags: ["Notes" "Python"]` |
| Featured | `featured: true` | `featured: yes` |
| Blank lines | none inside the block | a gap between lines |

Also confirm the file ends in `.md` and sits in the right folder
(`src/content/blog/` or `src/content/projects/`).

---

## `verify` says a check failed

Scroll to the **first** line beginning with `error`. That is the real problem;
the rest are usually knock-on effects. It names the file — open it and compare
against [`templates/`](templates/).

---

## A link leads nowhere (404)

- **A project's "Source" button** → its `repo:` link is wrong or points to a repository that does not exist. Fix the link or delete the line.
- **The whole site is unstyled or links are broken site-wide** → the address or folder name is wrong. See step 3 and 4 in [`publish.md`](publish.md).
- **A menu item** → check the `nav` list in `src/config.ts` — see [`change-links.md`](change-links.md).

---

## The wrong icon shows on a social link

**File:** `src/config.ts`

The icon is chosen from the `label` in the `socials` list. Keep the four built-in
labels spelled exactly `GitHub`, `Email`, `LinkedIn`, `Discord`. A brand-new
kind of link shows a plain envelope until a matching icon is added — harmless.

---

## The GitHub build failed (red cross)

Open the **Actions** tab, click the failed run, and read the bottom. The message
usually names a file and a line.

Nine times out of ten it is the same thing `bun run verify` would have caught
locally — a mistyped top block. Fix it, then push again.

A failed build does **not** take your live site down. The previous version stays
up until a build succeeds.

---

## I want to change something not listed here

Ask. Describe what you want to change and where you expect it to appear. Some
things — fonts, the avatar photo, layout — touch more than one file, and a quick
question beats guessing.

---

## Starting over on a broken change

If a change went wrong and you want to undo it:

```
git checkout -- path/to/the/file
```

This restores a file to its last committed version, discarding your unsaved
changes to it. Replace `path/to/the/file` with the real path.

Be careful: this discards work on **that file** with no undo. Only use it when
you are happy to lose the changes to it.
