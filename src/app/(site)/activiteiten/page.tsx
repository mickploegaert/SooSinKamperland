import type { Metadata } from "next";
import Image from "next/image";
import { connection } from "next/server";
import { formatActivityDate, upcomingActivities } from "@/lib/activities";

export const metadata: Metadata = { title: "Activiteiten" };

export default async function ActiviteitenPage() {
  await connection();
  const items = upcomingActivities();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <h1 className="text-4xl font-bold tracking-tight text-soos-dark sm:text-5xl">
        Activiteiten
      </h1>
      <p className="mt-4 max-w-2xl text-base">
        Ontdek wat er te doen is bij Soos in Kamperland.
      </p>

      {items.length === 0 ? (
        <p className="mt-10 rounded-xl bg-[#ede6fa] px-6 py-8 text-soos-dark">
          Er zijn nu geen aankomende activiteiten.
        </p>
      ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((activity) => (
            <li
              key={`${activity.date}-${activity.name}`}
              className="overflow-hidden rounded-xl border border-[#f4f4f7] bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={activity.image}
                  alt={activity.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <p className="text-sm font-semibold text-soos-purple">
                  <time dateTime={activity.date}>
                    {formatActivityDate(activity.date)}
                  </time>
                </p>
                <h2 className="mt-2 text-xl font-semibold text-soos-dark">
                  {activity.name}
                </h2>
                <p className="mt-2 text-base">{activity.description}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
