export type NavItem = {
  href: string;
  label: string;
};

export const mainNavigation: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/activiteiten", label: "Activiteiten" },
  { href: "/sponsoren", label: "Sponsoren" },
  { href: "/agenda", label: "Agenda" },
  { href: "/over-ons", label: "Over ons" },
  { href: "/contact", label: "Contact" },
];

export function isCurrentPage(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
