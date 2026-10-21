export const site = {
  /** Deployment URL of the GitHub Pages site.
   *  TODO(deploy): still the owner's real origin so the live build keeps
   *  resolving — it stays visible in every page's canonical/OG tags. Point this
   *  at your own Pages URL when you deploy your copy. */
  site: "https://ashik-maybe.github.io",
  /** GitHub handle, used for the repository and the profile link.
   *  TODO(deploy): likewise still the owner's — it appears in the site's
   *  structured data (Person `identifier`) and repo links. */
  handle: "ashik-maybe",
  name: "John Doe",
  /** Browser tab title for the home page. */
  title: "John Doe",
  description:
    "Portfolio, blog, and notes from a CSE undergrad working on software engineering and AI.",
  nav: [
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/search", label: "Search" },
    { href: "/contact", label: "Contact" },
  ],
  /** Replace the placeholder entries with your real profiles. Array order is
   *  the display order everywhere (footer row and contact page), so keep it
   *  deliberate: GitHub, Email, LinkedIn, Discord. */
  socials: [
    { href: "https://github.com/johndoe", label: "GitHub" },
    { href: "mailto:hello@example.com", label: "Email" },
    { href: "https://linkedin.com/in/johndoe", label: "LinkedIn" },
    { href: "https://discord.com/users/000000000000000000", label: "Discord" },
  ],
} as const
