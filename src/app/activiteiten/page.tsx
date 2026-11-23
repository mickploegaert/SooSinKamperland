import type { Metadata } from "next";
import { connection } from "next/server";
import { ActivityCard } from "@/components/activity-card";
import { PageCard, PageHero } from "@/components/page-hero";
import { upcomingActivities } from "@/lib/activities";

export const metadata: Metadata = { title: "Activiteiten" };

export default async function ActiviteitenPage() {
  await connection();
  const [next, ...rest] = upcomingActivities();

  return (
    <div className="bg-soos-mist">
      <PageHero eyebrow="Wat gaan we doen?" title="Activiteiten">
        Ontdek wat er te doen is bij Soos in Kamperland. Er is altijd iets leuks voor jong en
        oud.
      </PageHero>
      <PageCard>
        {!next ? (
          <p className="rounded-card bg-soos-mist px-6 py-8 text-soos-dark">
            Er zijn nu geen aankomende activiteiten. Kom snel weer kijken!
          </p>
        ) : (
          <>
            <ActivityCard activity={next} featured />
            {rest.length > 0 ? (
              <>
                <h2 className="mt-14 text-2xl font-bold tracking-tight text-soos-dark sm:text-3xl">
                  Daarna
                </h2>
                <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((activity) => (
                    <li key={`${activity.date}-${activity.name}`}>
                      <ActivityCard activity={activity} />
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </>
        )}
      </PageCard>
    </div>
  );
}
