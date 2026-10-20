import {
  SiAstro,
  SiCss,
  SiC,
  SiCplusplus,
  SiDocker,
  SiFishshell,
  SiGit,
  SiGnubash,
  SiHtml5,
  SiJavascript,
  SiLinux,
  SiFedora,
  SiMysql,
  SiNextdotjs,
  SiNumpy,
  SiPodman,
  SiPytorch,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiScikitlearn,
} from "react-icons/si"
import { DiJava } from "react-icons/di"
import type { ComponentType } from "react"

type IconProps = {
  className?: string
  "aria-hidden"?: boolean | "true" | "false"
}

/** Brand icons from Simple Icons. A skill with no entry renders as text only —
 *  never guess an icon for a label, wrong marks are worse than none. */
export const skillIcons: Record<string, ComponentType<IconProps>> = {
  Python: SiPython,
  C: SiC,
  "C++": SiCplusplus,
  Java: DiJava,
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  Astro: SiAstro,
  React: SiReact,
  "Next.js": SiNextdotjs,
  "Tailwind CSS": SiTailwindcss,
  HTML: SiHtml5,
  CSS: SiCss,
  Git: SiGit,
  Linux: SiLinux,
  "Fedora Linux": SiFedora,
  Bash: SiGnubash,
  "fish shell": SiFishshell,
  Docker: SiDocker,
  Podman: SiPodman,
  "Scikit-learn": SiScikitlearn,
  NumPy: SiNumpy,
  PyTorch: SiPytorch,
  MySQL: SiMysql,
}
