# Checking your changes

One command tells you whether the site is still healthy. Use it after any edit,
before publishing.

---

## The command

```
bun run verify
```

Run it in the project folder, in your terminal.

---

## Reading the result

**Good — you are safe to publish:**

```
All 86 dist checks passed (3 posts, 5 projects, 31 html files).
```

The number will change as you add posts and projects. What matters is the words
**passed** and that it stops with no error.

**Bad — something is wrong:**

You will see a line starting with `error`, and it will stop early. The line just
above the error usually names the file and the problem.

---

## What it actually checks

A long list of yes/no questions about the built site. In plain terms, it
confirms:

- Every page built, and links point to the right place.
- Blog and project files are all valid — no mistyped dates or missing quotes.
- The search index built.
- The share images generated.
- The site address is applied everywhere it should be.

If you changed words or colours, it will pass. If you mistyped a blog post's
top block, it will tell you.

---

## When it fails

The error names the file. Ninety percent of the time it is one of these:

| What the error is about | Likely cause | Fix |
| --- | --- | --- |
| A blog post or project file | A mistyped top block | See [`troubleshooting.md`](troubleshooting.md) |
| A missing quote | Unbalanced `"` in a value | Every quoted value needs an opening and closing quote |
| A date | Wrong format | Use `YYYY-MM-DD` |
| A page or link | A broken tag while editing text | Change only words, keep `<tags>` |

Full list in [`troubleshooting.md`](troubleshooting.md).

---

## Why bother

This is the safety net. It catches almost every beginner mistake **before** the
site goes live, so a broken page never reaches a visitor. Getting in the habit of
running it after each editing session saves a lot of head-scratching.

It does not change any of your files. Running it is always safe.

---

## Files this touched

None. Checking reads your work; it never writes.

The checks themselves live in `scripts/check-dist.mjs` if you are curious — but
you never need to open it.
