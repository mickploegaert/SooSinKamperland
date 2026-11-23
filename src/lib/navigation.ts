export type NavItem = {
  href: string;
  label: string;
};

export const mainNavigation: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/activiteiten", label: "Activiteiten" },
  { href: "/sponsoren", label: "Sponsoren" },
  { href: "/agenda", label: "Agenda" },
  { href: "/contact", label: "Contact" },
];

export function isCurrentPage(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
