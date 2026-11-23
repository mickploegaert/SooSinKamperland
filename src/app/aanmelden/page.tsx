import type { Metadata } from "next";
import { connection } from "next/server";
import { PageCard, PageHero } from "@/components/page-hero";
import { RegistrationForm } from "@/components/registration-form";
import {
  activitySlug,
  formatActivityDate,
  upcomingActivities,
} from "@/lib/activities";

export const metadata: Metadata = {
  title: "Aanmelden",
  description: "Meld je aan voor een activiteit van Soos in Kamperland.",
};

export default async function AanmeldenPage({ searchParams }: PageProps<"/aanmelden">) {
  await connection();
  const params = await searchParams;
  const requested = typeof params.activiteit === "string" ? params.activiteit : undefined;

  const options = upcomingActivities().map((activity) => ({
    slug: activitySlug(activity),
    label: `${activity.name} (${formatActivityDate(activity.date)})`,
  }));
  const selected = options.some((option) => option.slug === requested) ? requested : undefined;

  return (
    <div className="bg-soos-mist">
      <PageHero eyebrow="Doe mee" title="Aanmelden">
        Meld je aan voor een activiteit, dan weten we hoeveel mensen we mogen verwachten.
      </PageHero>
      <PageCard>
        <div className="mx-auto max-w-2xl">
          {options.length === 0 ? (
            <p className="rounded-2xl bg-soos-mist px-6 py-8 text-soos-dark">
              Er zijn nu geen activiteiten waarvoor je je kunt aanmelden.
            </p>
          ) : (
            <RegistrationForm options={options} selected={selected} />
          )}
        </div>
      </PageCard>
    </div>
  );
}
