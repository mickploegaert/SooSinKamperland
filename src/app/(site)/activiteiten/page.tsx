import type { Metadata } from "next";
import Form from "next/form";
import { connection } from "next/server";
import { ActivityCard } from "@/components/activities/activity-card";
import { AutoSubmitSelect } from "@/components/activities/auto-submit-select";
import { PageHero } from "@/components/activities/page-hero";
import { ContentSections } from "@/components/content-sections";
import { categoriesOf, DATE_FILTERS, filterActivities } from "@/lib/activity-filters";
import { getDatabase } from "@/lib/data";
import type { Activity } from "@/lib/data/types";
import { todayIso } from "@/lib/format";
import { getPageContent } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Activiteiten",
  description: "Ontdek wat er te doen is bij Soos in Kamperland.",
};

async function loadUpcoming(today: string): Promise<Activity[] | null> {
  await connection();
  try {
    return await getDatabase().activities.listUpcoming(today);
  } catch (error) {
    console.error("Activiteiten konden niet worden geladen", error);
    return null;
  }
}

export default async function ActiviteitenPage({ searchParams }: PageProps<"/activiteiten">) {
  const today = todayIso();
  const [upcoming, params, content] = await Promise.all([
    loadUpcoming(today),
    searchParams,
    getPageContent("activiteiten"),
  ]);

  const category = typeof params.categorie === "string" ? params.categorie : "";
  const date = typeof params.datum === "string" ? params.datum : "";
  const categories = categoriesOf(upcoming ?? []);
  const activities = filterActivities(upcoming ?? [], { category, date, today });
  const filtered = Boolean(category || date);

  return (
    <>
      <PageHero title="Activiteiten" subtitle="Ontdek wat er te doen is bij Soos in Kamperland." />

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <Form action="/activiteiten" className="flex flex-wrap items-center gap-3" aria-label="Activiteiten filteren">
          <AutoSubmitSelect
            name="categorie"
            label="Categorie"
            value={category}
            options={[{ value: "", label: "Alle categorieën" }, ...categories.map((c) => ({ value: c, label: c }))]}
          />
          <AutoSubmitSelect name="datum" label="Datum" value={date} options={DATE_FILTERS} />
          <noscript>
            <button type="submit" className="h-10 rounded-lg bg-soos-violet px-4 text-sm font-semibold text-white">
              Filteren
            </button>
          </noscript>
        </Form>

        <div className="mt-5" aria-live="polite">
          {upcoming === null ? (
            <p className="rounded-lg bg-soos-expense-soft px-4 py-6 text-center text-sm font-semibold text-soos-expense">
              De activiteiten kunnen op dit moment niet worden geladen. Probeer het later opnieuw.
            </p>
          ) : activities.length === 0 ? (
            <p className="rounded-lg border border-dashed border-soos-line px-4 py-12 text-center text-sm text-soos-muted">
              {filtered
                ? "Er zijn geen activiteiten die bij deze filters passen."
                : "Er staan op dit moment geen activiteiten gepland. Kijk binnenkort nog eens!"}
            </p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activities.map((activity) => (
                <li key={activity.id} className="flex">
                  <div className="grid w-full">
                    <ActivityCard activity={activity} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ContentSections items={content} />
    </>
  );
}
