---
title: "Study Hub"
description: "A small web app that turns my course notes into flashcards and spaced-repetition decks."
pubDate: 2026-06-18
tags: ["TypeScript", "Web", "Astro"]
featured: true
repo: "https://github.com/johndoe/study-hub"
---

Markdown notes in, flashcards out. Built because every Anki workflow I tried had too much
maintenance overhead for my taste.

## What it does

- Parses course notes written in Markdown with a simple `Q: / A:` convention
- Groups cards by course tag and schedules reviews with a SM-2 style algorithm
- Exports to a real Anki package when I want reviews on my phone

## What I learned

Static site generation for the deck viewer, and that a hand-rolled parser is fine until it
isn't — the moment two note formats existed, splitting parsing into a small pipeline stage
made the whole thing simpler.
