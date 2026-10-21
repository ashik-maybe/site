# Add a blog post

A blog post is one text file. You copy a blank one, fill in the top, and write.

**Where posts live:** the folder `src/content/blog/`
**Start from:** [`templates/post.md`](templates/post.md)

---

## Steps

**1. Copy the blank post.**
Copy the file [`templates/post.md`](templates/post.md) into the folder
`src/content/blog/`.

**2. Rename it.**
The filename becomes the web address. Use lowercase, dashes instead of spaces,
and end with `.md`:

```
green-tea-notes.md    →    yoursite.com/blog/green-tea-notes/
```

**3. Fill in the top.**
At the very top, between the two `---` lines, there are four lines:

```yaml
title: "Put your post title here"
description: "One sentence summarising the post. Shows in lists and when shared."
pubDate: 2026-01-01
tags: ["Notes"]
```

Replace the words inside the quotes. Rules:

- Keep the quotes.
- `pubDate` is the date as `YYYY-MM-DD`. Today is fine.
- `tags` is a list: `["Notes", "Python"]` — square brackets, quotes, commas.
- Do not add blank lines inside this block.

**4. Write the post.**
Below the second `---`, replace the example text with your own. Plain text is
fine. See the formatting cheatsheet below.

**5. Delete the instructions.**
At the bottom of the file there is a note starting `<!--`. Delete the note and
everything below the last `---`.

**6. Check.**
Run `bun run verify` — see [`checking.md`](checking.md). If it passes, publish
(see [`publish.md`](publish.md)).

---

## Formatting cheatsheet

| To get | Type |
| --- | --- |
| A heading | `## My heading` |
| A bullet | `- my point` |
| **Bold** | `**bold words**` |
| *Italic* | `*italic words*` |
| A link | `[text](https://example.com)` |
| A code word | `` `like this` `` |
| A code block | three backticks above and below |

Two headings or more automatically build a "On this page" list.

---

## Common mistakes

- **Missing a quote** at the start or end of a line in the top block → check fails. Every quoted value needs matching quotes.
- **A bad date** like `2026/01/01` → use dashes: `2026-01-01`.
- **Forgetting a comma** between tags → `["Notes" "Python"]` breaks; use `["Notes", "Python"]`.
- **A blank line inside the top block** → the site may ignore your post. Keep the four lines together.

---

## Files this touched

- `src/content/blog/<your-new-file>.md`
