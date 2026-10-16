---
title: "The tiny MLP I finally understood"
description: "Backpropagation stopped being magic after I implemented a two-layer network in NumPy and broke it on purpose."
pubDate: 2026-10-05
tags: ["Machine Learning", "Python", "Notes"]
---

Frameworks hide the math. So I rebuilt the smallest possible neural network in NumPy to see
the math move.

## The shape

Two layers. Input `x` of size 2, hidden of size 8 with a sigmoid, output of size 1 with a
sigmoid, binary cross-entropy loss. About 30 lines.

## The loop

1. Forward pass: `h = sigmoid(W1 @ x + b1)`, `y = sigmoid(W2 @ h + b2)`
2. Loss: binary cross-entropy between `y` and the label
3. Backward pass: gradients chain from loss to output to hidden to weights
4. Step: `W1 -= lr * dW1`

Step 3 is where "backpropagation" lives, and all it is is the chain rule applied
systematically. Writing out `dL/dW1 = dL/dy · dy/dh · dh/dW1` by hand made it click.

## What broke, and what it taught

- Forgetting to transpose the weight matrix — shapes lined up in the transposed world, so
  the bug was invisible until predictions were garbage.
- Learning rate too high: loss oscillated. Too low: flatline. Watching the loss curve was
  more informative than any lecture.

## Next

Attention from scratch. Same approach: NumPy first, framework second.
