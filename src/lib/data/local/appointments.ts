import "server-only";
import type { Appointment } from "../types";
import type { AppointmentRepository } from "../repositories";
import { localTable } from "./table";

const table = localTable("appointments");

const byDateTime = (a: Appointment, b: Appointment) =>
  a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime);

export const localAppointmentRepository: AppointmentRepository = {
  async list() {
    return (await table.all()).sort(byDateTime);
  },
  async listUpcoming(today) {
    return (await table.all()).filter((item) => item.date >= today).sort(byDateTime);
  },
  findById: table.find,
  create: table.insert,
  update: table.update,
  delete: table.remove,
};
