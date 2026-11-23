import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { PinIcon } from "@/components/activities/icons";
import { PageHero } from "@/components/activities/page-hero";
import { Paragraphs } from "@/components/content-sections";
import { getDatabase } from "@/lib/data";
import { formatDayMonth, formatTimeRange, todayIso } from "@/lib/format";
import { parseId } from "@/lib/forms";

const getVisibleActivity = cache(async (rawId: string) => {
  await connection();
  const id = parseId(rawId);
  const activity = id ? await getDatabase().activities.findById(id) : null;
  return activity?.isVisible ? activity : null;
});

export async function generateMetadata({ params }: PageProps<"/activiteiten/[id]">): Promise<Metadata> {
  const activity = await getVisibleActivity((await params).id);
  return activity
    ? { title: activity.name, description: activity.description.slice(0, 160) }
    : { title: "Activiteit niet gevonden" };
}

export default async function ActivityDetailPage({ params }: PageProps<"/activiteiten/[id]">) {
  const activity = await getVisibleActivity((await params).id);
  if (!activity) notFound();

  const today = todayIso();
  const time = formatTimeRange(activity.startTime, activity.endTime);
  const dateLabel = activity.endDate && activity.endDate !== activity.startDate
    ? `${formatDayMonth(activity.startDate, today)} t/m ${formatDayMonth(activity.endDate, today)}`
    : formatDayMonth(activity.startDate, today);
  const past = (activity.endDate ?? activity.startDate) < today;

  return (
    <>
      <PageHero
        size="large"
        overline="Activiteit"
        title={activity.name}
        imageUrl={activity.imageUrl}
        subtitle={
          <>
            <time dateTime={activity.startDate}>{dateLabel}</time>
            {time ? (
              <>
                <span aria-hidden="true" className="mx-2">·</span>
                {time}
              </>
            ) : null}
          </>
        }
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {past ? (
          <p className="mb-6 rounded-lg bg-soos-lilac px-4 py-3 text-sm font-semibold text-soos-violet">
            Deze activiteit heeft al plaatsgevonden.
          </p>
        ) : null}
        <h2 className="text-2xl font-bold text-soos-navy">Over deze activiteit</h2>
        <div className="mt-4 max-w-3xl space-y-3 text-base leading-relaxed text-soos-muted">
          <Paragraphs text={activity.description} />
        </div>
        {activity.location ? (
          <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-soos-navy">
            <PinIcon className="size-4 text-soos-violet" />
            {activity.location}
          </p>
        ) : null}
        <Link
          href="/activiteiten"
          className="mt-12 inline-flex items-center rounded-lg bg-soos-lilac px-8 py-3 text-sm font-bold text-soos-violet transition-colors hover:bg-[#e3dcf6]"
        >
          ← Alle activiteiten
        </Link>
      </div>
    </>
  );
}
