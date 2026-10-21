# Images

Three images matter. None require any design skill to replace.

---

## The tab icon (favicon)

**File:** `public/favicon.svg`

This is the little icon in the browser tab. It is an `.svg` file — a drawing
made of text.

**Replace it with your own:**

1. Get an `.svg` icon. Free sources: [Lucide](https://lucide.dev/icons),
   [Tabler](https://tabler.io/icons), or draw one at
   [favicon.io](https://favicon.io).
2. Name it exactly `favicon.svg`.
3. Put it in the `public/` folder, replacing the old one.

**The current icon adapts to light and dark mode** — it changes colour with the
visitor's theme. A simple replacement will not do this, and that is fine; it
will just stay one colour.

**Keep it simple.** At tab size it is tiny — a few bold shapes beat a detailed
picture.

---

## The social-share image

**File:** `public/og.png`

When someone shares your site on social media or in a chat, this image appears.
It should be **1200 × 630 pixels**.

**To replace it:**

1. Make or find a 1200×630 image.
2. Save it as `og.png`.
3. Put it in `public/`, replacing the old one.

You can design one free at [Canva](https://canva.com) or use a screenshot of
your site. Keep any text large — the preview is often shown small.

**Note:** blog posts and projects get their own share image automatically
(built from the title). This file is the fallback for pages without one.

---

## Your photo (optional)

The about page currently shows a letter in a circle. To use a photo instead:

1. Add your photo to the folder `src/assets/` — a square image works best, at
   least 400×400. Name it something simple like `me.jpg`.
2. Ask for help wiring it up, or follow [`troubleshooting.md`](troubleshooting.md)
   → "I want to change something not listed here". This step involves editing a
   page file, so it is the one task here that benefits from a second pair of
   eyes.

If you skip this, the letter circle stays — which is a perfectly good look.

---

## Where images go, in short

| Image | Folder | Filename |
| --- | --- | --- |
| Tab icon | `public/` | `favicon.svg` |
| Social-share image | `public/` | `og.png` |
| Your photo | `src/assets/` | anything, e.g. `me.jpg` |

**Rule of thumb:** files in `public/` are served exactly as named. Files in
`src/assets/` are processed by the site. For a straight replacement, `public/`
is the simple choice.

---

## Files this touched

- `public/favicon.svg`
- `public/og.png`
- `src/assets/` (only if adding a photo)
