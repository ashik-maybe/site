---
title: "ml-from-scratch"
description: "Classic machine learning algorithms implemented in NumPy, one file per algorithm, with plots."
pubDate: 2026-08-30
tags: ["Python", "Machine Learning", "Education"]
featured: false
repo: "https://github.com/ashik-maybe/ml-from-scratch"
---

Linear regression, logistic regression, k-means, a small MLP, and PCA — each in a single
file with a runnable demo at the bottom.

## Why

Course lectures taught me to call `model.fit()`. Calling it hides the loop that actually
does the work. Reimplementing each algorithm fixed that gap permanently.

## Structure

One file per algorithm, zero dependencies beyond NumPy and Matplotlib, and a test file per
algorithm checking against `scikit-learn` outputs within a tolerance.
