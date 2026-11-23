import "server-only";
import type { Database } from "../repositories";
import { localAdminRepository } from "./admins";

export const localDatabase: Database = {
  admins: localAdminRepository,
};
