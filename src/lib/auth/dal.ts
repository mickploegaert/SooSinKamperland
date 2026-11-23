import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import type { AdminProfile, AdminRole } from "@/lib/data/types";
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

/** Rechten per rol. Nieuwe rollen (bijv. vrijwilliger) krijgen alleen wat hier staat. */
const PERMISSIONS = {
  "kassa:bekijken": ["hoofdbeheerder", "beheerder"],
} as const satisfies Record<string, readonly AdminRole[]>;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(admin: AdminProfile, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly AdminRole[]).includes(admin.role);
}
