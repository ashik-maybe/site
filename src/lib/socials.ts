import { FaDiscord, FaGithub, FaLinkedin } from "react-icons/fa"
import { MailIcon } from "lucide-react"
import { site } from "@/config"
import type { ComponentType } from "react"

/** Props the icon components accept — enough for `aria-hidden` and sizing. */
type IconProps = {
  className?: string
  "aria-hidden"?: boolean | "true" | "false"
}

/** Brand icons come from `react-icons/fa`; Mail is Lucide, matching the rest of
 *  the UI chrome. The key must match the `label` used in `site.socials`. */
export const socialIcons: Record<string, ComponentType<IconProps>> = {
  GitHub: FaGithub,
  Email: MailIcon,
  LinkedIn: FaLinkedin,
  Discord: FaDiscord,
}

/** Resolve an icon for a `site.socials` entry, falling back to Mail so a new
 *  entry still renders before its icon is added. */
export function socialIcon(label: string): ComponentType<IconProps> {
  return socialIcons[label] ?? MailIcon
}

/** The `mailto:` href of the Email entry in `site.socials`. CTAs read it from
 *  here so the address has one source of truth instead of being hardcoded at
 *  every call site. */
export const emailHref =
  site.socials.find((social) => social.label === "Email")?.href ?? "mailto:"
