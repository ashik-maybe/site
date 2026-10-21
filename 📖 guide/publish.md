# Publish your site

This site is hosted **free** on GitHub Pages. Publishing means sending your
changes to GitHub; GitHub then builds and serves them automatically.

You do not need to pay for hosting.

---

## One-time setup (do this once)

These steps connect your repository to GitHub Pages.

**1. Push your code to GitHub.** If your repository is not on GitHub yet, create
one there and upload this project to it.

**2. Turn on Pages.**
In your repository on github.com, go to **Settings → Pages**. Under **Source**,
choose **GitHub Actions**. Save.

**3. Check the website address.**
Open `src/config.ts` and confirm the `site:` line is your live address:

```ts
site: "https://yourusername.github.io",
```

**4. Check the folder your site lives in.**
Open `astro.config.mjs` and find:

```js
const base = "/site"
```

- If your **repository is named `site`**, leave this as is.
- If your **repository has a different name**, change `"/site"` to
  `"/your-repo-name"`.
- If you use a **custom domain**, set it to `"/"`.

Getting these two right matters: they decide every link on your site. If they
are wrong, pages load without styling or links lead to nowhere.

---

## Publishing a change

Once the one-time setup is done, publishing is two steps.

**1. Check your work.** Run `bun run verify` — see [`checking.md`](checking.md).
Do this first; a broken change should not go live.

**2. Send it up.** In your terminal:

```
git add .
git commit -m "update my site"
git push
```

That is it. Within a minute or two, GitHub builds the site and your changes
appear at your address.

---

## Watching it happen

On github.com, open the **Actions** tab in your repository. You will see a run
starting when you push. A **green tick** means it published; a **red cross**
means something failed.

If it is red, click the run to see why. The usual cause is a failing check —
fix it with [`troubleshooting.md`](troubleshooting.md), then push again.

---

## Good to know

- **Publishing is automatic.** Every push to the main branch rebuilds the site. You never upload files by hand.
- **The first build is slowest.** Later ones are quick.
- **A red run does not break the live site.** The old version stays up until a build succeeds.
- **You can re-run a build** from the Actions tab without changing anything — useful after a GitHub hiccup.

---

## If your site shows up blank or unstyled

That almost always means the address or folder name in the one-time setup is
wrong. Recheck steps 3 and 4 above. See also
[`troubleshooting.md`](troubleshooting.md).

---

## Files this touched

- `src/config.ts` (the `site:` line)
- `astro.config.mjs` (the `base` line)

Both are one-time changes, not per-publish.
