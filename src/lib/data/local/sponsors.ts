import "server-only";
import type { SponsorRepository } from "../repositories";
import { sponsorOrder } from "../sponsor-order";
import { localTable } from "./table";

const table = localTable("sponsors");

export const localSponsorRepository: SponsorRepository = {
  async list() {
    return (await table.all()).sort(sponsorOrder);
  },
  findById: table.find,
  create: table.insert,
  update: table.update,
  delete: table.remove,
};
