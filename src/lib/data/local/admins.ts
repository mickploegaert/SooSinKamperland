import "server-only";
import type { AdminRepository } from "../repositories";
import { readDb } from "./store";

export const localAdminRepository: AdminRepository = {
  async findById(id) {
    const db = await readDb();
    return db.admins.find((admin) => admin.id === id) ?? null;
  },

  async findByIdentifier(identifier) {
    const needle = identifier.trim().toLowerCase();
    if (!needle) return null;
    const db = await readDb();
    return (
      db.admins.find(
        (admin) =>
          admin.username.toLowerCase() === needle ||
          admin.email.toLowerCase() === needle,
      ) ?? null
    );
  },
};
