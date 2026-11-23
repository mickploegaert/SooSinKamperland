import "server-only";
import type { Database } from "../repositories";
import { localAdminRepository } from "./admins";
import { localWebsiteContentRepository } from "./website-content";

export const localDatabase: Database = {
  admins: localAdminRepository,
  websiteContent: localWebsiteContentRepository,
};
