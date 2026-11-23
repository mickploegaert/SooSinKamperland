import type { Metadata } from "next";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { requireAdmin } from "@/lib/auth/dal";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Dashboard Soos in Kamperland" },
  robots: { index: false },
};

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const admin = await requireAdmin();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-3 p-3 sm:p-4">
      <DashboardTopbar admin={admin} />
      <div className="flex flex-1 flex-col gap-4 lg:flex-row">
        <aside className="lg:flex lg:w-44 lg:shrink-0 lg:flex-col">
          <DashboardSidebar />
        </aside>
        <main id="inhoud" className="min-w-0 flex-1 py-1 lg:py-2">
          {children}
        </main>
      </div>
    </div>
  );
}
