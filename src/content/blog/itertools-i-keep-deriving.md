---
title: "itertools functions I keep re-deriving"
description: "groupby, pairwise, and chunking: Python's standard library already solved my little loops."
pubDate: 2026-09-24
tags: ["Python", "Notes"]
---

Half my small Python scripts are reimplementations of functions that already exist in
`itertools`. Here are the three I keep rebuilding.

## Pairwise

Walking a list two elements at a time — for comparing neighbors, computing deltas:

```python
from itertools import pairwise

deltas = [b - a for a, b in pairwise(readings)]
```

Before I knew this, I wrote `zip(values, values[1:])` every single time.

## Groupby, run-length style

```python
from itertools import groupby

for key, group in groupby("aaabbc"):
    print(key, len(list(group)))
# a 3, b 2, c 1
```

The gotcha: `groupby` only groups *consecutive* runs, so sort first if you want global
groups.

## Chunking

Not in the stdlib, but the official recipe:

```python
def chunks(seq, n):
    for i in range(0, len(seq), n):
        yield seq[i : i + n]

for batch in chunks(ids, 100):
    send(batch)
```

## Takeaway

`itertools` reads badly the first week and obviously forever after. Worth the week.
