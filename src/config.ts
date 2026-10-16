export const site = {
  /** Deployment URL of the GitHub Pages site. */
  site: "https://ashik-maybe.github.io",
  /** GitHub handle, used for the repository and the profile link. */
  handle: "ashik-maybe",
  name: "Ashik's Website",
  /** Browser tab title for the home page. */
  title: "Ashik's Website",
  description:
    "Portfolio, blog, and notes from a CSE undergrad working on software engineering and AI.",
  nav: [
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ],
  /** Replace the placeholder entries with your real profiles. */
  socials: [
    { href: "https://github.com/ashik-maybe", label: "GitHub" },
    { href: "mailto:hello@example.com", label: "Email" },
    { href: "https://linkedin.com/in/ashik-maybe", label: "LinkedIn" },
  ],
} as const
