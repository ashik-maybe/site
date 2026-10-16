---
title: "Big-O, briefly"
description: "The complexity notation I keep re-learning before every interview, written down once and for all."
pubDate: 2026-09-12
tags: ["DSA", "Notes"]
---

Every semester I re-derive Big-O from scratch. Not anymore.

## What it actually measures

Big-O describes how work grows with input size, ignoring constants and lower-order terms.
`3n + 2` is `O(n)`. The constant `3` and the `+ 2` do not matter because what we care about
is the shape of the curve, not the point.

## The shapes that matter

- **`O(1)`** — array index, hash map lookup. Constant work.
- **`O(log n)`** — binary search. Each step halves the problem.
- **`O(n)`** — single loop over the input.
- **`O(n log n)`** — good sorting. Merge sort, Timsort, heapsort.
- **`O(n^2)`** — nested loops. Usually a warning sign.
- **`O(2^n)`** — subsets, brute-force recursion over include/exclude.

## Amortized cost

A dynamic array appends in `O(1)` *amortized*. When it grows it copies everything, but the
copy happens rarely enough that averaged out it is still constant per append. Worth saying
out loud in an interview: "amortized constant" and "constant" are different claims.

## My rule of thumb

Ask "what happens when the input gets 10× bigger?" If the work gets 10× bigger, linear.
100×, quadratic. Barely changes, constant or log.
