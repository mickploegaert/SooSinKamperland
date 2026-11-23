"use server";

import { redirect } from "next/navigation";
import { DASHBOARD_PATH } from "@/lib/auth/dal";
import { getAuthService } from "@/lib/auth/service";

export type LoginState = {
  identifier?: string;
  message?: string;
  fieldErrors?: { identifier?: string; password?: string };
};

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const fieldErrors: LoginState["fieldErrors"] = {};
  if (!identifier) fieldErrors.identifier = "Vul je e-mailadres of gebruikersnaam in.";
  if (!password) fieldErrors.password = "Vul je wachtwoord in.";
  if (fieldErrors.identifier || fieldErrors.password) {
    return { identifier, fieldErrors };
  }

  let result: Awaited<ReturnType<ReturnType<typeof getAuthService>["signIn"]>>;
  try {
    result = await getAuthService().signIn(identifier, password);
  } catch (error) {
    console.error("Inloggen mislukt door een serverfout", error);
    result = { ok: false, reason: "unavailable" };
  }
  if (!result.ok) {
    return {
      identifier,
      message:
        result.reason === "invalid-credentials"
          ? "Onjuiste inloggegevens."
          : "Inloggen is op dit moment niet mogelijk. Probeer het later opnieuw.",
    };
  }

  redirect(DASHBOARD_PATH);
}
