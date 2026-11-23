import "server-only";
import { SPONSOR_LEVELS, type Sponsor } from "../types";
import type { SponsorRepository } from "../repositories";
import { localTable } from "./table";

const table = localTable("sponsors");

const levelRank = (sponsor: Sponsor) => {
  const index = SPONSOR_LEVELS.findIndex((level) => level.value === sponsor.level);
  return index === -1 ? SPONSOR_LEVELS.length : index;
};

/** Volgorde: niveau (goud eerst), daarna weergavevolgorde, daarna naam. */
export const sponsorOrder = (a: Sponsor, b: Sponsor) =>
  levelRank(a) - levelRank(b) || a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "nl");

export const localSponsorRepository: SponsorRepository = {
  async list() {
    return (await table.all()).sort(sponsorOrder);
  },
  findById: table.find,
  create: table.insert,
  update: table.update,
  delete: table.remove,
};
