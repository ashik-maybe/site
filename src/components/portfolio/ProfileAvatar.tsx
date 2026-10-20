import { Avatar, AvatarFallback } from "@/components/ui/avatar"

/**
 * Composed inside a React component (not in .astro) because Base UI parts
 * need to share React context, which does not cross Astro's renderer.
 *
 * The entrance animation is built from `tw-animate-css` utilities (already
 * imported in global.css), so it stays self-contained here — no keyframes of
 * our own, no extra dependency, no hydration.
 *
 * `fill-mode-both` is required: the enter keyframes start at an invisible
 * state, and without it the element snaps back to that state when the
 * animation ends. Duration utilities on this plugin are `animation-duration-*`
 * — plain `duration-*` is not defined and would silently do nothing.
 *
 * Entrances run once on page load. They are all transform/opacity (plus blur
 * for one), and the global `prefers-reduced-motion` block in global.css
 * neutralises them for users who ask.
 */
const ENTRANCES = {
  fade: "animate-in fade-in animation-duration-200 ease-out fill-mode-both",
  scale:
    "animate-in fade-in zoom-in-95 animation-duration-250 ease-out fill-mode-both",
  rise: "animate-in fade-in slide-in-from-bottom-1 animation-duration-250 ease-out fill-mode-both",
  drop: "animate-in fade-in slide-in-from-top-1 animation-duration-250 ease-out fill-mode-both",
  slideL:
    "animate-in fade-in slide-in-from-left-2 animation-duration-250 ease-out fill-mode-both",
  slideR:
    "animate-in fade-in slide-in-from-right-2 animation-duration-250 ease-out fill-mode-both",
  blur: "animate-in fade-in blur-in-4 animation-duration-300 ease-out fill-mode-both",
  spin: "animate-in fade-in spin-in-6 animation-duration-300 ease-out fill-mode-both",
  none: "",
} as const

export type AvatarEntrance = keyof typeof ENTRANCES

export function ProfileAvatar({
  initial,
  animation = "none",
}: {
  initial: string
  animation?: AvatarEntrance
}) {
  return (
    <Avatar size="lg" className="size-16!">
      <AvatarFallback
        className={`bg-primary/10 font-mono text-xl uppercase select-none ${ENTRANCES[animation]}`}
      >
        {initial}
      </AvatarFallback>
    </Avatar>
  )
}
