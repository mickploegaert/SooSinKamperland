import { socialLinks, type SocialLink } from "@/lib/social";

const icons: Record<SocialLink["name"], React.ReactNode> = {
  Facebook: (
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3Z" />
  ),
  Instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.9" cy="7.1" r="1.1" />
    </>
  ),
};

export function SocialIcons() {
  const links = socialLinks.filter((link) => link.href);
  if (links.length === 0) return null;

  return (
    <ul className="flex gap-3" aria-label="Sociale media">
      {links.map((link) => (
        <li key={link.name}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex size-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition hover:-translate-y-0.5 hover:bg-white hover:text-soos-purple"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-5">
              {icons[link.name]}
            </svg>
            <span
              aria-hidden
              className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-soos-dark opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              {link.name}
            </span>
            <span className="sr-only">
              {link.name} van Soos in Kamperland (opent in een nieuw tabblad)
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
