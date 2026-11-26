"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNavigation, isActiveDashboardItem } from "@/lib/dashboard-navigation";

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Dashboardmenu"
      className="focus-light rounded-xl bg-soos-navy px-3 py-4 text-white lg:min-h-[calc(100vh-7.5rem)] lg:flex-1 lg:px-4 lg:py-6"
    >
      <p className="px-2 text-xs font-semibold uppercase tracking-wider text-[#c9c3e6]">Menu</p>
      <ul className="relative mt-3 flex gap-1 overflow-x-auto lg:mt-5 lg:flex-col lg:gap-3">
        {dashboardNavigation.map((item) => {
          const active = isActiveDashboardItem(pathname, item.href);
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="block rounded-lg px-2 py-2 text-sm text-white/75 transition-colors hover:bg-white/10 hover:text-white aria-[current=page]:font-semibold aria-[current=page]:text-white"
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
