---
title: Code Blocks and Expressive Code
aliases: [Expressive Code, Syntax Highlighting, Fenced Code]
tags: [astro, styling, content, code]
level: intermediate
---

# 34 · Code Blocks and Expressive Code

> [!abstract] In one line
> Markdown fences become rich code blocks through **Expressive Code** — an
> Astro integration that themes, frames, and adds copy buttons, driven by config
> rather than by hand.

## Mental model

```mermaid
flowchart LR
  MD["```ts fence in markdown"] --> EC["Expressive Code integration"]
  EC --> T["dual-theme highlighting"]
  EC --> F["frame + copy button"]
  T --> H["<pre><code> with CSS-variable themes"]
  F --> H
```

Markdown gives you *a* code block. Expressive Code gives you a **themed, framed,
copyable** one, and wires its colours to your design tokens.

## How it works

Add the integration (this repo already has it):

```js
// astro.config.mjs
import expressiveCode from "astro-expressive-code"

export default defineConfig({
  integrations: [
    expressiveCode({
      themes: ["catppuccin-latte", "catppuccin-macchiato"],
      themeCssSelector: (theme) => (theme.type === "dark" ? ".dark" : ":root:not(.dark)"),
      frames: { showCopyButton: true },
      styleOverrides: {
        borderColor: "var(--border)",
        codeBackground: "var(--card)",
        codeFontFamily: '"JetBrains Mono Variable", ui-monospace, monospace',
        uiFontFamily: '"Inter Variable", sans-serif',
      },
    }),
  ],
})
```

Then any fence in your markdown is styled automatically:

````md
```ts {2}
const answer = 42   // line 2 is highlighted
```
````

Extra features you get for free: titles (` ```ts title="src/x.ts" `), line ranges
to highlight/diff (`{2,5-7}`, `ins={3}`, `del={4}`), and collapsible sections.

## The dual-theme trick

Expressive Code ships **both** themes at once and switches via CSS. Two keys make
it follow *this* repo's theme:

| Option | Job |
|---|---|
| `themes: [light, dark]` | which palettes to generate |
| `themeCssSelector` | which CSS selector activates the dark one |

Here `themeCssSelector` returns `".dark"` for dark and `":root:not(.dark)"` for
light — the **same class** the theme script toggles ([[25-when-not-to-hydrate]],
[[33-design-tokens-theming]]). So a manual theme toggle immediately re-themes every
code block, with no JavaScript involved.

By default EC only honours `prefers-color-scheme`. Setting `themeCssSelector` is
what binds it to a **class-based** theme, which is what a manual toggle needs.

## Matching your design tokens

`styleOverrides` re-point EC's chrome at your semantic tokens:

```js
styleOverrides: {
  borderColor: "var(--border)",
  codeBackground: "var(--card)",
  codeFontFamily: '"JetBrains Mono Variable", ui-monospace, monospace',
}
```

Now code blocks use the same border and surface as the rest of the site, and the
mono font is the self-hosted one ([[64-fonts]]). They inherit theme changes for free.

> [!warning] Astro 7 — integration order and config shape
> `expressiveCode()` goes in `integrations`, and it **must come before** the MDX
> integration if you use MDX, so it can intercept fences. Options moved under keys
> like `frames` and `styleOverrides`; old top-level options from v0.x tutorials
> won't all apply.

> [!tip] Don't hand-write `<pre>` blocks
> Let EC do it. If you need a special block (a diff, a titled file), use the fence
> meta syntax — you keep the content in markdown and the styling in one config.

## Gotchas

> [!warning] The copy button is a frame feature
> `frames: { showCopyButton: true }` applies to framed blocks. Toggle `frames` and
> the button's behaviour changes with it.

> [!warning] Fonts must actually load
> `codeFontFamily: '"JetBrains Mono Variable"'` only looks right if that
> `@font-face` is defined and preloaded. Otherwise you silently fall back to a
> system mono ([[64-fonts]]).

> [!warning] Highlighting is build-time
> EC highlights during the build; the browser just renders styled HTML. That's why
> it adds no client JS and why the theme switch is pure CSS.

## Exercise

- [ ] In `astro.config.mjs`, explain what breaks if `themeCssSelector` is removed
      (hint: try toggling the theme and watch the code blocks).
- [ ] Add a titled, line-highlighted fence to a markdown file and confirm both the
      title and the highlight appear in `dist/`.
- [ ] Change `codeBackground` to `var(--background)` and rebuild; decide whether
      the contrast against the page is still good. Revert.

> [!question]- Why is the theme switch instant, with no flash?
> Because both themes are in the CSS and the switch is just a `.dark` class change
> ([[25-when-not-to-hydrate]]). No re-highlighting, no JS round-trip — the browser
> applies a different set of variables.

## Further reading
- Expressive Code — *Configuration* <https://expressive-code.com/reference/configuration/>
- Astro — *Syntax highlighting* <https://docs.astro.build/en/guides/syntax-highlighting/>

Prev: [[33-design-tokens-theming]] · Next: [[41-endpoints]] · Index: [[00-index]]
