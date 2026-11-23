export const activityCategories = ["Feest", "Spel", "Film"] as const;
export type ActivityCategory = (typeof activityCategories)[number];

export type Activity = {
  name: string;
  date: string;
  description: string;
  image: string;
  imageAlt: string;
  category: ActivityCategory;
};

// Een terugkerende activiteit voer je één keer in. De eerste datum staat in `date`;
// `repeat` zorgt voor de volgende keren tot en met de einddatum.
type ActivitySource = Omit<Activity, "category"> & {
  category: ActivityCategory;
  repeat?: { every: "week" | "month"; until: string };
};

const activitySources: ActivitySource[] = [
  {
    name: "Nazomerborrel",
    category: "Feest",
    date: "2026-09-12",
    description: "Afsluiting van de zomer met muziek en een drankje in de soos.",
    image: "/activiteiten/soos-1.jpg",
    imageAlt: "Bezoekers in de soos onder de vlaggetjes en discoballen",
  },
  {
    name: "Bingo Avond",
    category: "Spel",
    date: "2026-11-22",
    repeat: { every: "month", until: "2027-03-31" },
    description: "Een avond bingo voor jong en oud, met prijzen en een pauze tussendoor.",
    image: "/activiteiten/soos-1.jpg",
    imageAlt: "Bezoekers in de soos onder de vlaggetjes en discoballen",
  },
  {
    name: "Pubquiz",
    category: "Spel",
    date: "2026-11-28",
    description: "Vorm een team en speel mee met vragen over muziek, sport en Kamperland.",
    image: "/activiteiten/soos-1.jpg",
    imageAlt: "Bezoekers in de soos onder de vlaggetjes en discoballen",
  },
  {
    name: "Kerstparty",
    category: "Feest",
    date: "2026-12-19",
    description: "Feestelijke avond met muziek, versiering en een hapje en een drankje.",
    image: "/activiteiten/soos-1.jpg",
    imageAlt: "Bezoekers in de soos onder de vlaggetjes en discoballen",
  },
  {
    name: "DJ Avond",
    category: "Feest",
    date: "2027-01-10",
    description: "Dansavond met een dj. De deuren gaan open voor iedereen die wil meedoen.",
    image: "/activiteiten/soos-1.jpg",
    imageAlt: "Bezoekers in de soos onder de vlaggetjes en discoballen",
  },
  {
    name: "Filmavond",
    category: "Film",
    date: "2027-01-23",
    description: "Samen een film kijken in de zaal, met iets te drinken erbij.",
    image: "/activiteiten/soos-2.jpg",
    imageAlt: "Kinderen kijken een film op het grote scherm in de soos",
  },
  {
    name: "Themafeest",
    category: "Feest",
    date: "2027-02-06",
    description: "Feest met een thema. Kom in de sfeer en vier de avond in de soos.",
    image: "/activiteiten/soos-1.jpg",
    imageAlt: "Bezoekers in de soos onder de vlaggetjes en discoballen",
  },
];

function addToIsoDate(isoDate: string, every: "week" | "month", count: number) {
  const [year, month, day] = isoDate.split("-").map(Number);
  let date: Date;
  if (every === "week") {
    date = new Date(Date.UTC(year, month - 1, day + 7 * count));
  } else {
    const target = new Date(Date.UTC(year, month - 1 + count, 1));
    const lastDay = new Date(
      Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0),
    ).getUTCDate();
    target.setUTCDate(Math.min(day, lastDay));
    date = target;
  }
  return date.toISOString().slice(0, 10);
}

export const activities: Activity[] = activitySources.flatMap(({ repeat, ...activity }) => {
  if (!repeat) return [activity];
  const result: Activity[] = [activity];
  for (let count = 1; count < 200; count++) {
    const date = addToIsoDate(activity.date, repeat.every, count);
    if (date > repeat.until) break;
    result.push({ ...activity, date });
  }
  return result;
});

export function formatActivityDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function formatDayMonth(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return {
    day: String(day),
    month: new Intl.DateTimeFormat("nl-NL", { month: "short", timeZone: "UTC" })
      .format(date)
      .replace(".", ""),
  };
}

export function formatMonthYear(isoDate: string) {
  const [year, month] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("nl-NL", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

export function formatWeekday(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("nl-NL", { weekday: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, day)),
  );
}

export function upcomingActivities(today = new Date()) {
  const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

  return activities
    .filter((activity) => {
      const [year, month, day] = activity.date.split("-").map(Number);
      return Date.UTC(year, month - 1, day) >= todayUtc;
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function activitySlug(activity: Activity) {
  const name = activity.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${activity.date}-${name}`;
}
