import "server-only";
import type { Database } from "../repositories";
import { localActivityRepository } from "./activities";
import { localAdminRepository } from "./admins";
import { localAppointmentRepository } from "./appointments";
import { localSumUpTransactionRepository } from "./sumup-transactions";
import { localTransactionRepository } from "./transactions";
import { localSponsorRepository } from "./sponsors";
import { localWebsiteContentRepository } from "./website-content";

export const localDatabase: Database = {
  admins: localAdminRepository,
  websiteContent: localWebsiteContentRepository,
  activities: localActivityRepository,
  appointments: localAppointmentRepository,
  sponsors: localSponsorRepository,
  transactions: localTransactionRepository,
  sumupTransactions: localSumUpTransactionRepository,
};
