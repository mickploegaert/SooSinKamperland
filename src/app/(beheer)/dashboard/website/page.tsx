import type { Metadata } from "next";
import Link from "next/link";
import {
  DashboardHeading,
  EmptyState,
  Notice,
  TableCard,
  td,
  th,
} from "@/components/dashboard/ui";
import { requireAdmin } from "@/lib/auth/dal";
import { getDatabase } from "@/lib/data";
import { WEBSITE_PAGES } from "@/lib/data/types";
import { formatDateTime } from "@/lib/format";
import { noticeFrom } from "@/lib/forms";

export const metadata: Metadata = { title: "Website-informatie" };

export default async function WebsiteContentPage({ searchParams }: PageProps<"/dashboard/website">) {
  await requireAdmin();
  const [items, params] = await Promise.all([getDatabase().websiteContent.list(), searchParams]);
  const pageLabel = (value: string) => WEBSITE_PAGES.find((page) => page.value === value)?.label ?? value;

  return (
    <section>
      <DashboardHeading
        title="Website-informatie"
        description="Pas de teksten op de website aan. Opgeslagen wijzigingen zijn direct zichtbaar op de publieke website."
        action={{ href: "/dashboard/website/nieuw", label: "+ Toevoegen" }}
      />
      <Notice message={noticeFrom(params.melding)} />

      <div className="mt-6">
        {items.length === 0 ? (
          <EmptyState>Er is nog geen website-informatie toegevoegd.</EmptyState>
        ) : (
          <TableCard>
            <table className="w-full min-w-[640px]">
              <thead>
                <tr>
                  <th className={th}>Pagina</th>
                  <th className={th}>Sectie</th>
                  <th className={th}>Titel</th>
                  <th className={th}>Laatst gewijzigd</th>
                  <th className={th}>
                    <span className="sr-only">Acties</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className={`${td} font-semibold`}>{pageLabel(item.page)}</td>
                    <td className={`${td} text-soos-muted`}>{item.section}</td>
                    <td className={td}>{item.title}</td>
                    <td className={`${td} whitespace-nowrap text-soos-muted`}>{formatDateTime(item.updatedAt)}</td>
                    <td className={`${td} text-right`}>
                      <Link
                        href={`/dashboard/website/${item.id}`}
                        className="font-semibold text-soos-violet hover:underline"
                      >
                        Bewerken<span className="sr-only"> {item.title}</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>
        )}
      </div>
    </section>
  );
}
