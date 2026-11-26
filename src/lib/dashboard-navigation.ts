export type DashboardNavItem = {
  href: string;
  label: string;
  /** Alleen tonen als de SumUp-koppeling aanstaat (SUMUP_ENABLED=true). */
  requiresSumUp?: boolean;
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
  { href: "/dashboard/kassa", label: "Kassa", requiresSumUp: true },
  { href: "/dashboard/sumup", label: "SumUp", requiresSumUp: true },
];

/** Het menu zonder de items van functies die (nog) uitstaan. */
export function visibleDashboardNavigation(sumUpEnabled: boolean): DashboardNavItem[] {
  return dashboardNavigation.filter((item) => sumUpEnabled || !item.requiresSumUp);
}

export function isActiveDashboardItem(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}
