---
title: "term-notes"
description: "A terminal note-taking tool: capture, tag, and grep your notes without leaving the shell."
pubDate: 2026-04-02
tags: ["Python", "CLI"]
featured: true
repo: "https://github.com/ashik-maybe/term-notes"
---

Notes you write in two seconds are notes you actually write. `term-notes` is my capture
tool: `tn "regex is greedy in python" -t python`.

## Design choices

- Plain Markdown files in a folder — grep-able, git-friendly, no database
- Tags stored as YAML frontmatter, searchable with `tn --tag python`
- Interactive search with a fuzzy finder when no query is given

## What I learned

Argument parsing is where CLIs earn their keep. `argparse` got me 80% of the way; the last
20% was subcommands and making `--help` readable enough that I stopped needing a README.
