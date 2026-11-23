import "server-only";
import type { Database } from "../repositories";
import { localActivityRepository } from "./activities";
import { localAdminRepository } from "./admins";
import { localWebsiteContentRepository } from "./website-content";

export const localDatabase: Database = {
  admins: localAdminRepository,
  websiteContent: localWebsiteContentRepository,
  activities: localActivityRepository,
};
