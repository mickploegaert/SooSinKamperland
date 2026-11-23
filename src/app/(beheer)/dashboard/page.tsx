import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/dal";

export const metadata: Metadata = { title: "Overzicht" };

export default async function DashboardPage() {
  const admin = await requireAdmin();

  return (
    <section aria-labelledby="overzicht-titel">
      <h1 id="overzicht-titel" className="text-2xl font-bold text-soos-navy">
        Welkom, {admin.username}
      </h1>
      <p className="mt-2 max-w-xl text-sm text-soos-muted">
        Je bent ingelogd op het beheerdersdashboard van Soos in Kamperland. Kies een onderdeel in
        het menu om de website te beheren.
      </p>
    </section>
  );
}
