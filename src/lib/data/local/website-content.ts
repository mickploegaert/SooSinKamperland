import "server-only";
import type { WebsiteContentRepository } from "../repositories";
import { localTable } from "./table";

const table = localTable("websiteContent");

export const localWebsiteContentRepository: WebsiteContentRepository = {
  async list() {
    return (await table.all()).sort(
      (a, b) => a.page.localeCompare(b.page) || a.id - b.id,
    );
  },
  async listByPage(page) {
    return (await table.all()).filter((item) => item.page === page).sort((a, b) => a.id - b.id);
  },
  async findBySection(page, section) {
    return (await table.all()).find((item) => item.page === page && item.section === section) ?? null;
  },
  findById: table.find,
  create: (input) => table.insert({ ...input, updatedAt: new Date().toISOString() }),
  update: (id, input) => table.update(id, { ...input, updatedAt: new Date().toISOString() }),
  delete: table.remove,
};
