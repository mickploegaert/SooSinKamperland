import "server-only";
import type { Activity } from "../types";
import type { ActivityRepository } from "../repositories";
import { localTable } from "./table";

const table = localTable("activities");

const byDate = (a: Activity, b: Activity) =>
  a.startDate.localeCompare(b.startDate) || (a.startTime ?? "").localeCompare(b.startTime ?? "");

export const localActivityRepository: ActivityRepository = {
  async list() {
    return (await table.all()).sort(byDate);
  },
  async listUpcoming(today) {
    return (await table.all())
      .filter((activity) => activity.isVisible && (activity.endDate ?? activity.startDate) >= today)
      .sort(byDate);
  },
  findById: table.find,
  create: table.insert,
  update: table.update,
  delete: table.remove,
};
