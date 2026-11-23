export type DashboardNavItem = {
  href: string;
  label: string;
};

/** Zijbalkmenu uit het schermontwerp "Dashboard & financiën". */
export const dashboardNavigation: DashboardNavItem[] = [
  { href: "/dashboard", label: "Overzicht" },
];

export function isActiveDashboardItem(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}
