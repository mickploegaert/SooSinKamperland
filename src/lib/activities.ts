export type Activity = {
  name: string;
  date: string;
  description: string;
  image: string;
  imageAlt: string;
};

export const activities: Activity[] = [
  {
    name: "Nazomerborrel",
    date: "2026-09-12",
    description: "Afsluiting van de zomer met muziek en een drankje in de soos.",
    image: "/activiteiten/soos-1.jpg",
    imageAlt: "Bezoekers in de soos onder de vlaggetjes en discoballen",
  },
  {
    name: "Bingo Avond",
    date: "2026-11-22",
    description: "Een avond bingo voor jong en oud, met prijzen en een pauze tussendoor.",
    image: "/activiteiten/soos-1.jpg",
    imageAlt: "Bezoekers in de soos onder de vlaggetjes en discoballen",
  },
  {
    name: "Pubquiz",
    date: "2026-11-28",
    description: "Vorm een team en speel mee met vragen over muziek, sport en Kamperland.",
    image: "/activiteiten/soos-1.jpg",
    imageAlt: "Bezoekers in de soos onder de vlaggetjes en discoballen",
  },
  {
    name: "Kerstparty",
    date: "2026-12-19",
    description: "Feestelijke avond met muziek, versiering en een hapje en een drankje.",
    image: "/activiteiten/soos-1.jpg",
    imageAlt: "Bezoekers in de soos onder de vlaggetjes en discoballen",
  },
  {
    name: "DJ Avond",
    date: "2027-01-10",
    description: "Dansavond met een dj. De deuren gaan open voor iedereen die wil meedoen.",
    image: "/activiteiten/soos-1.jpg",
    imageAlt: "Bezoekers in de soos onder de vlaggetjes en discoballen",
  },
  {
    name: "Filmavond",
    date: "2027-01-23",
    description: "Samen een film kijken in de zaal, met iets te drinken erbij.",
    image: "/activiteiten/soos-2.jpg",
    imageAlt: "Kinderen kijken een film op het grote scherm in de soos",
  },
  {
    name: "Themafeest",
    date: "2027-02-06",
    description: "Feest met een thema. Kom in de sfeer en vier de avond in de soos.",
    image: "/activiteiten/soos-1.jpg",
    imageAlt: "Bezoekers in de soos onder de vlaggetjes en discoballen",
  },
];

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
