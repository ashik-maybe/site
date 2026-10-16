---
title: "anagram-racer"
description: "A typing-race game where you fight anagrams of the same word, rendered in the terminal."
pubDate: 2026-02-14
tags: ["Rust", "CLI"]
featured: true
repo: "https://github.com/ashik-maybe/anagram-racer"
---

A game written to learn Rust's ownership model under real time pressure — literally.

## How it works

Words come from a wordlist; each round scrambles one and races you against an "opponent"
typed at a fixed words-per-minute. The opponent is fake. The panic is real.

## What I learned

- `crossterm` for raw terminal input and cursor control
- Borrow-checker fights: keeping the game state in one struct and passing `&mut` to the
  update function removed most of the pain
- Frame timing with `std::time::Instant` instead of sleeping blindly
