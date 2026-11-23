import type { Metadata } from "next";
import { BackLink, DashboardHeading } from "@/components/dashboard/ui";
import { requireAdmin } from "@/lib/auth/dal";
import { saveWebsiteContent } from "../actions";
import { ContentForm } from "../content-form";

export const metadata: Metadata = { title: "Website-informatie toevoegen" };

export default async function NewWebsiteContentPage() {
  await requireAdmin();
  return (
    <section>
      <BackLink href="/dashboard/website" label="Website-informatie" />
      <div className="mt-3">
        <DashboardHeading title="Informatie toevoegen" />
      </div>
      <ContentForm action={saveWebsiteContent.bind(null, null)} />
    </section>
  );
}
