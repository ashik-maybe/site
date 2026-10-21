# Add a project

Same idea as a blog post: one text file. Copy a blank one, fill in the top,
write the rest.

**Where projects live:** the folder `src/content/projects/`
**Start from:** [`templates/project.md`](templates/project.md)

---

## Steps

**1. Copy the blank project.**
Copy [`templates/project.md`](templates/project.md) into
`src/content/projects/`.

**2. Rename it.**
Lowercase, dashes, `.md`:

```
tea-timer.md    →    yoursite.com/projects/tea-timer/
```

**3. Fill in the top** (between the two `---` lines):

```yaml
title: "Put your project name here"
description: "One sentence about what it does. Shows in lists and when shared."
pubDate: 2026-01-01
tags: ["Web"]
featured: false
repo: "https://github.com/yourname/your-repo"
```

- `title`, `description` — in quotes.
- `pubDate` — the date as `YYYY-MM-DD`.
- `tags` — a list, e.g. `["Python", "CLI"]`.
- `featured` — `true` puts it on the home page; `false` does not.
- `repo` — the GitHub link in quotes. **Delete this whole line** if the code
  is not public. (An empty or fake link shows a "Source" button that leads
  nowhere.)

**4. Write the description.**
Below the second `---`, replace the example with your own words.

**5. Delete the instructions** at the bottom of the file (the `<!--` note).

**6. Check**, then publish — see [`checking.md`](checking.md) and
[`publish.md`](publish.md).

---

## Optional: a live demo link

To add a "Live demo" button, put this line directly under the `repo` line:

```yaml
demo: "https://your-live-site.com"
```

Delete it if there is no live version.

---

## Marking a project as featured

`featured: true` lists it in the "Selected projects" section on the home page.
Aim for two or three featured at most — more looks cluttered.

---

## Common mistakes

- **A `repo` link to a project that does not exist** → visitors get a 404. Point it at a real repository, or delete the line.
- **A bad date** → use `YYYY-MM-DD`.
- **Missing quotes** around `title`, `description`, `repo`, or `demo`.

---

## Files this touched

- `src/content/projects/<your-new-file>.md`
