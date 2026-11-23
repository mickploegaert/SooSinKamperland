import "server-only";
import type { Database } from "../repositories";
import { localActivityRepository } from "./activities";
import { localAdminRepository } from "./admins";
import { localSumUpTransactionRepository } from "./sumup-transactions";
import { localTransactionRepository } from "./transactions";
import { localSponsorRepository } from "./sponsors";
import { localWebsiteContentRepository } from "./website-content";

export const localDatabase: Database = {
  admins: localAdminRepository,
  websiteContent: localWebsiteContentRepository,
  activities: localActivityRepository,
  sponsors: localSponsorRepository,
  transactions: localTransactionRepository,
  sumupTransactions: localSumUpTransactionRepository,
};
