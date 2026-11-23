import "server-only";
import type { SumUpTransactionInput } from "@/lib/data/types";

/**
 * Contract voor het ophalen van transacties uit SumUp. Er is een echte
 * koppeling (API-sleutel) en een demo-implementatie voor ontwikkeling.
 */
export interface SumUpClient {
  mode: "live" | "demo";
  fetchTransactions(options?: { limit?: number }): Promise<SumUpTransactionInput[]>;
}

export class SumUpUnavailableError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "SumUpUnavailableError";
  }
}

const API_BASE = "https://api.sumup.com";

type SumUpApiTransaction = {
  id?: string;
  transaction_code?: string;
  amount?: number;
  currency?: string;
  timestamp?: string;
  status?: string;
  payment_type?: string;
  card_type?: string;
  product_summary?: string;
};

/** Zet een transactie uit de SumUp API om naar ons eigen formaat. Bedragen komen in euro's binnen. */
export function mapApiTransaction(item: SumUpApiTransaction): SumUpTransactionInput | null {
  if (!item.id || typeof item.amount !== "number" || !item.timestamp) return null;
  return {
    externalId: item.id,
    transactionCode: item.transaction_code ?? null,
    amountCents: Math.round(item.amount * 100),
    currency: item.currency ?? "EUR",
    timestamp: new Date(item.timestamp).toISOString(),
    status: item.status ?? "UNKNOWN",
    paymentType: item.payment_type ?? null,
    cardType: item.card_type ?? null,
    description: item.product_summary ?? null,
  };
}

export function createLiveClient(apiKey: string, merchantCode: string): SumUpClient {
  return {
    mode: "live",
    async fetchTransactions({ limit = 100 } = {}) {
      const url = new URL(
        `/v2.1/merchants/${encodeURIComponent(merchantCode)}/transactions/history`,
        API_BASE,
      );
      url.searchParams.set("order", "descending");
      url.searchParams.set("limit", String(limit));

      let response: Response;
      try {
        response = await fetch(url, {
          headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" },
          cache: "no-store",
          signal: AbortSignal.timeout(8000),
        });
      } catch (error) {
        throw new SumUpUnavailableError("Geen verbinding met SumUp", { cause: error });
      }
      if (!response.ok) {
        throw new SumUpUnavailableError(`SumUp antwoordde met status ${response.status}`);
      }

      const body = (await response.json()) as { items?: SumUpApiTransaction[] };
      return (body.items ?? [])
        .map(mapApiTransaction)
        .filter((item): item is SumUpTransactionInput => item !== null);
    },
  };
}
