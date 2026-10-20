---
title: "This site"
description: "This portfolio and blog: Astro, Tailwind, and shadcn, deployed straight from GitHub to GitHub Pages."
pubDate: 2026-10-16
tags: ["TypeScript", "Web", "Astro"]
featured: false
repo: "https://github.com/johndoe/site"
---

The site you are reading. Built with Astro's static output, Tailwind v4, shadcn components,
and Catppuccin Latte/Macchiato theming.

## Why static

No server to run, no database to lose, and GitHub Pages deploys it from the same repository
that holds the content. Writing in Markdown and pushing is the whole publishing workflow.

## What I learned

- Base paths and GitHub Pages: everything internal is prefixed with `/site`
- Astro's content collections turn Markdown folders into typed APIs
- Islands architecture: only the theme toggle and the mobile menu ship any JavaScript
