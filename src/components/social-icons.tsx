import { ArrowUpRight } from "lucide-react";
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

function BrandIcon({ name, className }: { name: SocialLink["name"]; className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      {icons[name]}
    </svg>
  );
}

function activeLinks() {
  return socialLinks.filter((link) => link.href);
}

const newTab = "(opent in een nieuw tabblad)";

/** Compacte knoppen met icoon en naam, voor op een donkere achtergrond (footer). */
export function SocialPills() {
  const links = activeLinks();
  if (links.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Sociale media">
      {links.map((link) => (
        <li key={link.name}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-white hover:text-soos-dark motion-reduce:transition-none"
          >
            <BrandIcon name={link.name} className="size-5" />
            {link.name}
            <span className="sr-only">{newTab}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Lichte kaarten met icoon, naam en account, voor op een witte achtergrond (contact). */
export function SocialCards() {
  const links = activeLinks();
  if (links.length === 0) return null;

  return (
    <ul className="space-y-3" aria-label="Sociale media">
      {links.map((link) => (
        <li key={link.name}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-card bg-white p-4 ring-1 ring-soos-dark/10 transition hover:bg-soos-mist hover:ring-soos-purple/40 motion-reduce:transition-none"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-soos-mist text-soos-purple transition group-hover:bg-white">
              <BrandIcon name={link.name} className="size-5" />
            </span>
            <span className="flex-1">
              <span className="block font-semibold text-soos-dark">{link.name}</span>
              <span className="block text-sm text-soos-ink/75">{link.handle}</span>
            </span>
            <ArrowUpRight
              aria-hidden
              className="size-5 text-soos-ink/50 transition group-hover:text-soos-purple"
            />
            <span className="sr-only">{newTab}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
