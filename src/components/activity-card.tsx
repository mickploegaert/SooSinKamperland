import { CalendarDays, CalendarPlus } from "lucide-react";
import Image from "next/image";
import { ButtonLink } from "@/components/button";
import {
  activitySlug,
  formatActivityDate,
  formatDayMonth,
  formatWeekday,
  type Activity,
} from "@/lib/activities";

function DateBadge({ date }: { date: string }) {
  const { day, month } = formatDayMonth(date);
  return (
    <div className="flex size-16 flex-col items-center justify-center rounded-card bg-white text-center shadow-lg">
      <span className="text-2xl font-bold leading-none text-soos-dark">{day}</span>
      <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-soos-purple">
        {month}
      </span>
    </div>
  );
}

export function ActivityCard({
  activity,
  featured = false,
}: {
  activity: Activity;
  featured?: boolean;
}) {
  return (
    <article
      className={`soos-card group overflow-hidden ${
        featured ? "grid lg:grid-cols-2" : "flex h-full flex-col"
      }`}
    >
      <div className={`relative ${featured ? "min-h-64 lg:min-h-96" : "aspect-[4/3]"}`}>
        <Image
          src={activity.image}
          alt={activity.imageAlt}
          unoptimized={activity.image.startsWith("http")}
          fill
          sizes={
            featured
              ? "(min-width: 1024px) 560px, 100vw"
              : "(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
          }
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4">
          <DateBadge date={activity.date} />
        </div>
        {featured ? (
          <span className="absolute bottom-4 left-4 rounded-full bg-soos-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-soos-dark shadow">
            Eerstvolgende
          </span>
        ) : null}
      </div>
      <div className={`flex flex-col justify-center ${featured ? "p-6 sm:p-10" : "flex-1 p-5"}`}>
        <p className="flex items-center gap-2 text-sm font-semibold capitalize text-soos-purple">
          <CalendarDays aria-hidden className="size-4 shrink-0" />
          <time dateTime={activity.date}>
            {formatWeekday(activity.date)} {formatActivityDate(activity.date)}
          </time>
        </p>
        <h3
          className={`mt-2 font-semibold text-soos-dark ${featured ? "text-3xl sm:text-4xl" : "text-xl"}`}
        >
          {activity.name}
        </h3>
        <p
          className={`mt-3 leading-7 text-soos-ink/85 ${featured ? "text-base sm:text-lg" : "text-sm"}`}
        >
          {activity.description}
        </p>
        <div className="mt-auto flex items-center gap-2 pt-5">
          <ButtonLink
            href={`/aanmelden?activiteit=${activitySlug(activity)}`}
            variant="secondary"
            size="sm"
            arrow
          >
            Aanmelden
            <span className="sr-only"> voor {activity.name}</span>
          </ButtonLink>
          <a
            href={`/agenda.ics?activiteit=${activitySlug(activity)}`}
            download
            className="flex size-11 items-center justify-center rounded-full text-soos-purple ring-1 ring-inset ring-soos-dark/15 transition hover:bg-soos-mist hover:ring-soos-purple/40"
          >
            <CalendarPlus aria-hidden className="size-5" />
            <span className="sr-only">Zet {activity.name} in je agenda</span>
          </a>
        </div>
      </div>
    </article>
  );
}
