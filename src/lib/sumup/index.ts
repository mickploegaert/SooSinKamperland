import "server-only";
import { getDatabase } from "@/lib/data";
import type { SumUpTransaction } from "@/lib/data/types";
import { createLiveClient, SumUpUnavailableError, type SumUpClient } from "./client";
import { demoSumUpClient } from "./demo";

export const SUMUP_UNAVAILABLE_MESSAGE = "SumUp is momenteel niet bereikbaar.";

export function getSumUpClient(): SumUpClient | null {
  const apiKey = process.env.SUMUP_API_KEY;
  const merchantCode = process.env.SUMUP_MERCHANT_CODE;
  if (apiKey && merchantCode) return createLiveClient(apiKey, merchantCode);
  if (process.env.SUMUP_DEMO === "true") return demoSumUpClient;
  // Zonder sleutel alleen in ontwikkeling demogegevens, nooit in productie.
  return process.env.NODE_ENV === "production" ? null : demoSumUpClient;
}

export type SumUpOverview = {
  status: "ok" | "unavailable" | "not-configured";
  mode: "live" | "demo" | null;
  /** Opgeslagen transacties, uniek per SumUp-id, nieuwste eerst. */
  transactions: SumUpTransaction[];
  lastSyncedAt: string | null;
};

/**
 * Haalt de nieuwste transacties op uit SumUp en slaat ze op. Als SumUp niet
 * bereikbaar is, worden de eerder opgehaalde transacties getoond met een melding.
 */
export async function loadSumUpOverview(): Promise<SumUpOverview> {
  const db = getDatabase();
  const client = getSumUpClient();
  let status: SumUpOverview["status"] = "ok";

  if (!client) {
    status = "not-configured";
  } else {
    try {
      const fetched = await client.fetchTransactions();
      // Ook binnen één antwoord kan een transactie dubbel voorkomen.
      const unique = [...new Map(fetched.map((item) => [item.externalId, item])).values()];

      if (client.mode === "demo") {
        // Demogegevens worden nooit opgeslagen, zodat ze later niet tussen echte transacties staan.
        const syncedAt = new Date().toISOString();
        const transactions = unique
          .map((item, index) => ({ ...item, id: index + 1, syncedAt }))
          .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        return { status, mode: "demo", transactions, lastSyncedAt: syncedAt };
      }

      await db.sumupTransactions.upsertMany(unique);
    } catch (error) {
      if (!(error instanceof SumUpUnavailableError)) console.error("SumUp-synchronisatie mislukt", error);
      else console.warn(error.message);
      status = "unavailable";
    }
  }

  const transactions = await db.sumupTransactions.list();
  const lastSyncedAt = transactions.reduce<string | null>(
    (latest, t) => (!latest || t.syncedAt > latest ? t.syncedAt : latest),
    null,
  );
  return { status, mode: client?.mode ?? null, transactions, lastSyncedAt };
}

export const SUMUP_STATUS_LABELS: Record<string, { label: string; className: string }> = {
  SUCCESSFUL: { label: "Geslaagd", className: "text-soos-income" },
  PENDING: { label: "In behandeling", className: "text-soos-muted" },
  FAILED: { label: "Mislukt", className: "text-soos-expense" },
  CANCELLED: { label: "Geannuleerd", className: "text-soos-expense" },
  REFUNDED: { label: "Terugbetaald", className: "text-soos-violet" },
};

export const PAYMENT_TYPE_LABELS: Record<string, string> = {
  POS: "Pin (kaartlezer)",
  CASH: "Contant",
  ECOM: "Online",
  RECURRING: "Terugkerend",
  MOTO: "Telefonisch",
  APM: "Alternatief",
};
