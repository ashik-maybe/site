import { Avatar, AvatarFallback } from "@/components/ui/avatar"

/**
 * Composed inside a React component (not in .astro) because Base UI parts
 * need to share React context, which does not cross Astro's renderer.
 */
export function ProfileAvatar({ initial }: { initial: string }) {
  return (
    <Avatar size="lg" className="size-16!">
      <AvatarFallback className="bg-primary/10 font-mono text-xl">
        {initial}
      </AvatarFallback>
    </Avatar>
  )
}
