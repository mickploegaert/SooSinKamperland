import Link from "next/link";
import type { Activity } from "@/lib/data/types";
import { dateBadge, formatTimeRange } from "@/lib/format";
import { ClockIcon } from "./icons";

export const activityGradient = "bg-gradient-to-r from-[#1b1642] to-[#7b2aa8]";

export function ActivityCard({ activity }: { activity: Activity }) {
  const badge = dateBadge(activity.startDate);
  const time = formatTimeRange(activity.startTime, activity.endTime);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-soos-line bg-white transition-shadow hover:shadow-[0_6px_20px_rgba(17,17,43,0.12)]">
      <div className={`relative h-32 ${activityGradient}`}>
        {activity.imageUrl ? (
          // Afbeeldingen komen van door beheerders opgegeven URL's.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={activity.imageUrl} alt="" className="size-full object-cover" />
        ) : null}
        <span className="absolute left-3 top-3 rounded-md bg-white px-2 py-1 text-xs font-bold text-soos-violet shadow-sm">
          <time dateTime={activity.startDate}>
            {badge.day} {badge.month}
          </time>
        </span>
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <h2 className="text-base font-bold text-soos-navy">{activity.name}</h2>
        {time ? (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-soos-muted">
            <ClockIcon className="size-3.5" />
            {time}
          </p>
        ) : null}
        <Link
          href={`/activiteiten/${activity.id}`}
          className="mt-auto pt-5 text-sm font-bold text-soos-violet after:absolute after:inset-0 group-hover:underline"
        >
          Meer info <span aria-hidden="true">→</span>
          <span className="sr-only"> over {activity.name}</span>
        </Link>
      </div>
    </article>
  );
}
