import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getAuthService } from "./service";

export const LOGIN_PATH = "/inloggen";
export const DASHBOARD_PATH = "/dashboard";

/**
 * Data Access Layer: iedere dashboardpagina en server action roept dit aan.
 * Niet-ingelogde bezoekers worden naar de inlogpagina gestuurd.
 */
export const requireAdmin = cache(async () => {
  const admin = await getAuthService().getCurrentAdmin();
  if (!admin) redirect(LOGIN_PATH);
  return admin;
});
