import { useState } from "react"
import { MenuIcon } from "lucide-react"

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
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle className="font-mono text-sm font-medium">
            {site.name}
          </SheetTitle>
          <SheetDescription className="sr-only">Site navigation</SheetDescription>
        </SheetHeader>
        <nav aria-label="Primary" className="px-2">
          <ul className="flex flex-col gap-1">
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
                        ? "block rounded-lg border-l-2 border-primary bg-muted px-3 py-3 text-base font-medium text-foreground"
                        : "block rounded-lg px-3 py-3 text-base text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
