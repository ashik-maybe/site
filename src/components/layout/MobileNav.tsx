import { useEffect, useState } from "react"
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

type Side = "left" | "right"

const hrefFor = (href: string) => (href === "/" ? `${base}/` : `${base}${href}`)

const isSide = (value: string | null): value is Side =>
  value === "left" || value === "right"

export default function MobileNav({
  current,
  className,
}: {
  /** Route path with the base and any trailing slash removed, e.g. `/blog`. */
  current: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [side, setSide] = useState<Side>("right")

  // The inline script in the layout already resolved the stored side before
  // paint (it drives the trigger's edge); this only syncs the control's state.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isSide(stored)) {
      // Reading storage must wait until after hydration (the server rendered
      // the default), so this post-mount setState is deliberate.
      // eslint-disable-next-line react/set-state-in-effect
      setSide(stored)
    }
  }, [])

  // Mirror the choice onto <html> so the header CSS can move the trigger to the
  // matching edge. The inline script set it pre-paint; this keeps it in sync
  // when the reader flips the control.
  useEffect(() => {
    document.documentElement.dataset.navSide = side
  }, [side])

  const choose = (value: Side) => {
    localStorage.setItem(STORAGE_KEY, value)
    setSide(value)
  }

  return (
    <>
      {/* The segmented control is a sibling of the sheet so its trigger can sit
          at whichever edge the drawer opens from: `data-nav-side` on <html>
          reorders `.nav-trigger-slot` in the header. */}
      <div
        role="radiogroup"
        aria-label="Navigation slide-in side"
        className="flex items-center rounded-full bg-muted p-0.5"
      >
        {(
          [
            {
              value: "left",
              label: "Open navigation from the left",
              Icon: PanelLeftIcon,
            },
            {
              value: "right",
              label: "Open navigation from the right",
              Icon: PanelRightIcon,
            },
          ] as const
        ).map(({ value, label, Icon }) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={side === value}
            aria-label={label}
            onClick={() => choose(value)}
            className={
              side === value
                ? "flex size-8 items-center justify-center rounded-full bg-primary/15 text-primary transition-colors"
                : "flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors active:bg-background/60"
            }
          >
            <Icon className="size-4" aria-hidden="true" />
          </button>
        ))}
      </div>

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
    </>
  )
}
