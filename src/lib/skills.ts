import {
  SiAstro,
  SiCss,
  SiCplusplus,
  SiDocker,
  SiGit,
  SiGnubash,
  SiHtml5,
  SiJavascript,
  SiLinux,
  SiMysql,
  SiNumpy,
  SiPytorch,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si"
import type { ComponentType } from "react"

type IconProps = {
  className?: string
  "aria-hidden"?: boolean | "true" | "false"
}

/** Brand icons from Simple Icons. A skill with no entry renders as text only —
 *  never guess an icon for a label, wrong marks are worse than none. */
export const skillIcons: Record<string, ComponentType<IconProps>> = {
  Python: SiPython,
  "C/C++": SiCplusplus,
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  Astro: SiAstro,
  React: SiReact,
  "Tailwind CSS": SiTailwindcss,
  HTML: SiHtml5,
  CSS: SiCss,
  Git: SiGit,
  Linux: SiLinux,
  Bash: SiGnubash,
  Docker: SiDocker,
  NumPy: SiNumpy,
  PyTorch: SiPytorch,
  MySQL: SiMysql,
}
