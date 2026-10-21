# Design: colours and fonts

This site has a defined look. Two things keep it looking deliberate: a small
set of colours, and one accent. Read this before changing anything visual.

**Where to look:** `src/styles/global.css` — the top section holds every colour.

---

## The house rules

These come from the template's design brief. They are why the site looks the
way it does, rather than like a generic template.

1. **One accent colour.** Mauve is used for anything that draws the eye — links,
   the active menu item, highlights. Adding a second bright colour dilutes it.
2. **Calm, low-contrast surfaces.** Text is near-black on off-white, not pure
   black on pure white. Easier to read.
3. **Nothing shouting.** No all-caps labels, no rows of decorative dots, no
   numbered markers, no fading gradient backgrounds.
4. **Even spacing.** Sections breathe. Resist adding borders and boxes.

If you follow only rule one — **keep mauve as the only accent** — you can change
almost anything else and it will still look intentional.

---

## Changing a colour

**File:** `src/styles/global.css`

The colours are named and grouped. You will see blocks like:

```css
--background: oklch(0.985 0.003 264.542); /* Base #eff1f5 */
--primary: oklch(0.555 0.25 297.016); /* Mauve #8839ef */
```

Each line has a name, a value, and a plain-English comment showing the hex
colour. There are **two sets**: one for light mode, one for dark mode (look for
the `dark` section).

**To change a colour:**

1. Pick your new colour. Any colour picker gives you a hex code like `#8839ef`.
2. Find the line, e.g. `--primary:`.
3. Replace the `oklch(...)` value with your hex code. Hex works directly:
   `--primary: #8839ef;`
4. Update the comment so the next person knows what it is.
5. **Change it in both the light and dark blocks** so both themes stay
   consistent.

**The one to know:** `--primary` is the accent. Changing that single value
recolours links, the active menu item, and highlights across the whole site.

---

## Fonts

The site uses two: a clean text font (Inter) and a code-style font (JetBrains
Mono) for labels and headings. They are stored in `src/assets/fonts/` and set
up in `global.css`.

Changing fonts is more involved than changing colours — it means new font files
and several lines of setup — so it is worth asking before you start rather than
guessing. The short version lives in `global.css` under `--font-sans` and
`--font-mono`.

---

## Rounded corners

**File:** `src/styles/global.css`

```css
--radius: 0.625rem;
```

One value controls how rounded everything is. Bigger = softer and rounder.
Smaller = sharper. Change this one line to shift the whole feel.

---

## What is safe to change

| Change | Safe? |
| --- | --- |
| Colours (in both light and dark) | Yes |
| The accent colour (`--primary`) | Yes — this is the big lever |
| Corner roundness (`--radius`) | Yes |
| Text sizes in the body | Yes, gently |
| Fonts | Possible, but ask first |
| Layout and spacing | Risky — small edits ripple everywhere |

---

## Files this touched

- `src/styles/global.css`
