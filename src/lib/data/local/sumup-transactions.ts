import "server-only";
import type { SumUpTransactionRepository } from "../repositories";
import { mutateDb, nextId } from "./store";
import { localTable } from "./table";

const table = localTable("sumupTransactions");

export const localSumUpTransactionRepository: SumUpTransactionRepository = {
  async list() {
    return (await table.all()).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  },
  findById: table.find,
  upsertMany(items) {
    return mutateDb((db) => {
      const syncedAt = new Date().toISOString();
      let added = 0;
      let updated = 0;
      for (const item of items) {
        const existing = db.sumupTransactions.find((row) => row.externalId === item.externalId);
        if (existing) {
          Object.assign(existing, item, { syncedAt });
          updated += 1;
        } else {
          db.sumupTransactions.push({ ...item, id: nextId(db.sumupTransactions), syncedAt });
          added += 1;
        }
      }
      return { added, updated };
    });
  },
};
