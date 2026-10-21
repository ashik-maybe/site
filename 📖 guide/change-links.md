# Email, menu, and social links

All three live in **one file**: `src/config.ts`. That is the point of this file
— change a link once, and it updates everywhere it appears.

Open `src/config.ts`. Below your name you will find two lists: `nav` (the menu)
and `socials` (your links).

---

## Change your email

Find the line in the `socials` list starting with `mailto:`:

```ts
{ href: "mailto:hello@example.com", label: "Email" },
```

Replace `hello@example.com` with your address. Keep `mailto:` in front and keep
the quotes. Do not change `label: "Email"`.

```ts
{ href: "mailto:you@yourdomain.com", label: "Email" },
```

This one line updates the contact page, the footer icon, and the "Email me"
button on the home page — all at once.

---

## Change your social links

The `socials` list holds one line per link:

```ts
socials: [
  { href: "https://github.com/johndoe", label: "GitHub" },
  { href: "mailto:hello@example.com", label: "Email" },
  { href: "https://linkedin.com/in/johndoe", label: "LinkedIn" },
  { href: "https://discord.com/users/000000000000000000", label: "Discord" },
],
```

Each line is `{ href, label }`:

- **`href`** — where the link goes.
- **`label`** — the name shown and the icon picked.

Replace each `href` with your own URL.

**The order matters** — they appear in the order listed. Move a line up or down
to reorder.

**To remove one:** delete its whole line, including the trailing comma.

**To add one:** the four common ones are already set up. If you add a *new*
kind of link (say Mastodon), copy a line and change `href` and `label`. The
icon will show a generic envelope until someone adds a matching icon — this is
expected and harmless. For the common four, the icons are already correct.

**Note:** keep the `label` exactly as written for the four built-in ones
(`GitHub`, `Email`, `LinkedIn`, `Discord`) so the right icon shows.

---

## Change the menu at the top

The `nav` list, just above `socials`:

```ts
nav: [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/search", label: "Search" },
  { href: "/contact", label: "Contact" },
],
```

Each line is `{ href, label }`. `href` is the page path — **leave these alone**
unless you are removing a page. You will normally only change `label`, the name
shown in the menu.

To remove a menu item, delete its whole line. To reorder, move lines.

---

## Change your GitHub username

**File:** `src/config.ts`

```ts
handle: "ashik-maybe",
```

Replace with your username. This appears in your site's structured data (what
search engines read).

---

## Change the website address

**File:** `src/config.ts`

```ts
site: "https://ashik-maybe.github.io",
```

Replace with your own live address — **no trailing slash**. This is where your
site is published; every canonical link and share preview is built from it.

If you also changed the folder name your site lives in, see
[`publish.md`](publish.md), which covers the matching one-line change.

---

## Files this touched

- `src/config.ts`

After editing, run the check: [`checking.md`](checking.md).
