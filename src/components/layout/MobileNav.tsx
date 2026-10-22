import { useState, useEffect } from "react"
import { MenuIcon, PanelLeftIcon, PanelRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { site } from "@/config"

const base = import.meta.env.BASE_URL
const STORAGE_KEY = "nav-side"

const hrefFor = (href: string) => (href === "/" ? `${base}/` : `${base}${href}`)

export default function MobileNav({
  current,
  className,
}: {
  /** Route path with the base and any trailing slash removed, e.g. `/blog`. */
  current: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [side, setSide] = useState<"left" | "right">("right")

  // Remember which edge the drawer slides in from (left-handed friendly).
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "left" || stored === "right") {
      // eslint-disable-next-line react/set-state-in-effect
      setSide(stored)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, side)
  }, [side])

  const left = side === "left"

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className={className}
            aria-label="Open navigation menu"
          />
        }
      >
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side={side} className="w-72">
        <SheetHeader>
          <SheetTitle className="font-mono text-sm font-medium">
            {site.name}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Site navigation
          </SheetDescription>
          <div className="flex items-center gap-2 px-2 pt-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label={
                left
                  ? "Navigation opens from the right, tap to move to the left"
                  : "Navigation opens from the left, tap to move to the right"
              }
              aria-pressed={left}
              className="size-8"
              onClick={() => setSide(left ? "right" : "left")}
            >
              {left ? <PanelRightIcon /> : <PanelLeftIcon />}
            </Button>
            <span className="text-xs text-muted-foreground">Slide-in side</span>
          </div>
        </SheetHeader>
        <nav aria-label="Primary" className="px-2">
          <ul className="flex flex-col gap-2">
            {site.nav.map((item) => {
              const active =
                current === item.href || current.startsWith(`${item.href}/`)
              return (
                <li key={item.href}>
                  <a
                    href={hrefFor(item.href)}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={
                      active
                        ? "relative block rounded-lg bg-muted px-3 py-3 text-base font-medium text-foreground after:absolute after:inset-y-3 after:left-0 after:w-0.5 after:rounded-full after:bg-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                        : "block rounded-lg px-3 py-3 text-base text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none active:bg-muted"
                    }
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
