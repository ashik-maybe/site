import { useEffect, useState } from "react"
import { ALargeSmallIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type TextSize = "default" | "large" | "xlarge"

const STORAGE_KEY = "text-size"
const DEFAULT: TextSize = "default"

/** Percentages of the browser's own default, written to <html>. The whole type
 *  and spacing scale is rem-based, so both grow together and the layout keeps
 *  its proportions instead of shearing. */
const options: { value: TextSize; label: string; size: string }[] = [
  { value: "default", label: "Default", size: "100%" },
  { value: "large", label: "Large", size: "112.5%" },
  { value: "xlarge", label: "Larger", size: "125%" },
]

const isTextSize = (value: string | null): value is TextSize =>
  options.some((option) => option.value === value)

export default function TextSizeToggle({ className }: { className?: string }) {
  const [size, setSize] = useState<TextSize>(DEFAULT)

  // The inline script in the layout already applied the stored size before
  // paint; this only syncs the control's state with the stored preference.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isTextSize(stored)) {
      // Reading storage must wait until after hydration (the server rendered
      // the default), so this post-mount setState is deliberate.
      // eslint-disable-next-line react/set-state-in-effect
      setSize(stored)
    }
  }, [])

  useEffect(() => {
    const scale = options.find((option) => option.value === size) ?? options[0]
    document.documentElement.style.fontSize = scale.size
  }, [size])

  const choose = (value: string) => {
    if (!isTextSize(value)) return
    localStorage.setItem(STORAGE_KEY, value)
    setSize(value)
  }

  const current = options.find((option) => option.value === size) ?? options[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className={className}
            aria-label={`Change text size, currently ${current.label.toLowerCase()}`}
          />
        }
      >
        <ALargeSmallIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuRadioGroup value={size} onValueChange={choose}>
          <DropdownMenuLabel>Text size</DropdownMenuLabel>
          {options.map(({ value, label }) => (
            <DropdownMenuRadioItem key={value} value={value}>
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
