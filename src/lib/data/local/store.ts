import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { hashPassword } from "@/lib/auth/password";
import { HERO_SECTION, type Activity, type Admin, type WebsiteContent } from "../types";

/**
 * Eenvoudige JSON-opslag voor lokale ontwikkeling zolang Supabase nog niet
 * beschikbaar is. Alle schrijfacties lopen via één wachtrij zodat gelijktijdige
 * verzoeken elkaar niet overschrijven.
 */

export type LocalSchema = {
  admins: Admin[];
  websiteContent: WebsiteContent[];
  activities: Activity[];
};

/** Voorbeeldactiviteiten uit de schermontwerpen. */
function seedActivities(): Activity[] {
  const base = { endDate: null, location: "Soos in Kamperland", imageUrl: null, isVisible: true, updatedBy: 1 };
  return [
    { ...base, id: 1, name: "Bingo Avond", category: "Spel", startDate: "2026-12-12", startTime: "20:00", endTime: "23:00",
      description: "Een gezellige avond vol spel, plezier en leuke prijzen. Kom langs bij Soos in Kamperland en doe mee!" },
    { ...base, id: 2, name: "Pubquiz", category: "Spel", startDate: "2026-11-28", startTime: "20:00", endTime: "23:00",
      description: "Test je kennis samen met je vrienden tijdens onze pubquiz. Geef je team op aan de bar." },
    { ...base, id: 3, name: "Kerstparty", category: "Feest", startDate: "2026-12-19", startTime: "21:00", endTime: "01:00",
      description: "Vier de feestdagen met ons tijdens de jaarlijkse kerstparty met muziek en drankjes." },
    { ...base, id: 4, name: "DJ Avond", category: "Feest", startDate: "2027-01-10", startTime: "20:00", endTime: "01:00",
      description: "Lokale DJ's draaien de hele avond de beste plaatjes. Dansen tot in de late uurtjes!" },
    { ...base, id: 5, name: "Filmavond", category: "Film", startDate: "2027-01-23", startTime: "19:30", endTime: "22:00",
      description: "Een gezellige filmavond op groot scherm, met popcorn erbij." },
    { ...base, id: 6, name: "Themafeest", category: "Feest", startDate: "2027-02-06", startTime: "21:00", endTime: "01:00",
      description: "Kom verkleed volgens het thema van de avond en maak kans op een prijs voor de beste outfit." },
  ];
}

export const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "soos-db.json");

async function createSeed(): Promise<LocalSchema> {
  const now = new Date().toISOString();
  return {
    admins: [
      {
        id: 1,
        username: process.env.SEED_ADMIN_USERNAME ?? "beheerder",
        email: process.env.SEED_ADMIN_EMAIL ?? "beheerder@soosinkamperland.nl",
        passwordHash: await hashPassword(
          process.env.SEED_ADMIN_PASSWORD ?? "SoosBeheer2026!",
        ),
        role: "hoofdbeheerder",
        createdAt: now,
      },
    ],
    websiteContent: [
      {
        id: 1,
        page: "home",
        section: HERO_SECTION,
        title: "Welkom bij Soos in Kamperland",
        body: "Dé plek voor jong en oud in Kamperland. Bekijk onze activiteiten, zalen en meer!",
        imageUrl: null,
        updatedAt: now,
        updatedBy: 1,
      },
      {
        id: 2,
        page: "contact",
        section: "contactgegevens",
        title: "Neem contact met ons op",
        body: "Heb je een vraag over een activiteit of wil je een zaal huren? Neem gerust contact met ons op, we helpen je graag verder.",
        imageUrl: null,
        updatedAt: now,
        updatedBy: 1,
      },
    ],
    activities: seedActivities(),
  };
}

let queue: Promise<unknown> = Promise.resolve();

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
}

async function load(): Promise<LocalSchema> {
  let stored: Partial<LocalSchema> | null = null;
  try {
    stored = JSON.parse(await readFile(DB_FILE, "utf8")) as Partial<LocalSchema>;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }

  const seed = await createSeed();
  if (!stored) {
    await save(seed);
    return seed;
  }

  // Tabellen die later zijn toegevoegd krijgen alsnog hun startgegevens.
  const missing = (Object.keys(seed) as (keyof LocalSchema)[]).filter(
    (key) => stored[key] === undefined,
  );
  const merged = { ...seed, ...stored } as LocalSchema;
  if (missing.length > 0) await save(merged);
  return merged;
}

async function save(data: LocalSchema) {
  await mkdir(DATA_DIR, { recursive: true });
  const tmp = `${DB_FILE}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await rename(tmp, DB_FILE);
}

/** Leest de volledige database (alleen-lezen gebruik). */
export function readDb(): Promise<LocalSchema> {
  return enqueue(load);
}

/** Past de database aan en slaat het resultaat atomair op. */
export function mutateDb<T>(change: (db: LocalSchema) => T | Promise<T>): Promise<T> {
  return enqueue(async () => {
    const db = await load();
    const result = await change(db);
    await save(db);
    return result;
  });
}

export function nextId(rows: { id: number }[]): number {
  return rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;
}
