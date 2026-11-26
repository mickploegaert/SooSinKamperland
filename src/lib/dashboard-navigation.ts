export type DashboardNavItem = {
  href: string;
  label: string;
};

/** Zijbalkmenu uit het schermontwerp "Dashboard & financiën". */
export const dashboardNavigation: DashboardNavItem[] = [
  { href: "/dashboard", label: "Overzicht" },
  { href: "/dashboard/activiteiten", label: "Activiteiten" },
  { href: "/dashboard/agenda", label: "Agenda" },
  { href: "/dashboard/inkomsten", label: "Inkomsten" },
  { href: "/dashboard/uitgaven", label: "Uitgaven" },
  { href: "/dashboard/website", label: "Website" },
  { href: "/dashboard/sponsoren", label: "Sponsoren" },
  { href: "/dashboard/kassa", label: "Kassa" },
  { href: "/dashboard/sumup", label: "SumUp" },
];

export function isActiveDashboardItem(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}
