import "server-only";
import type { FinancialTransaction } from "../types";
import type { FinancialTransactionRepository } from "../repositories";
import { localTable } from "./table";

const table = localTable("transactions");

/** Nieuwste datum eerst; bij gelijke datum de laatst toegevoegde eerst. */
const newestFirst = (a: FinancialTransaction, b: FinancialTransaction) =>
  b.date.localeCompare(a.date) || b.id - a.id;

export const localTransactionRepository: FinancialTransactionRepository = {
  async list() {
    return (await table.all()).sort(newestFirst);
  },
  async listByType(type) {
    return (await table.all()).filter((t) => t.type === type).sort(newestFirst);
  },
  findById: table.find,
  create: table.insert,
  update: table.update,
  delete: table.remove,
};
