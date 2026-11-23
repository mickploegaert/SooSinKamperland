import "server-only";
import type { SumUpTransactionInput } from "@/lib/data/types";
import type { SumUpClient } from "./client";

/**
 * Voorbeeldtransacties voor ontwikkeling zolang er geen SumUp-sleutel is.
 * Eén transactie zit er bewust twee keer in om te laten zien dat dubbele
 * transacties maar één keer worden getoond.
 */
export const demoSumUpClient: SumUpClient = {
  mode: "demo",
  async fetchTransactions() {
    const now = Date.now();
    const hoursAgo = (hours: number) => new Date(now - hours * 3_600_000).toISOString();
    const base = { currency: "EUR", cardType: null, description: null, transactionCode: null };

    const items: SumUpTransactionInput[] = [
      { ...base, externalId: "demo-0001", transactionCode: "DEMO0001", amountCents: 1250, timestamp: hoursAgo(2), status: "SUCCESSFUL", paymentType: "POS", cardType: "MAESTRO", description: "2x bier, 1x fris" },
      { ...base, externalId: "demo-0002", transactionCode: "DEMO0002", amountCents: 450, timestamp: hoursAgo(3), status: "SUCCESSFUL", paymentType: "POS", cardType: "VISA", description: "1x tosti" },
      { ...base, externalId: "demo-0003", transactionCode: "DEMO0003", amountCents: 2000, timestamp: hoursAgo(5), status: "FAILED", paymentType: "POS", cardType: "MASTERCARD", description: "Entree" },
      { ...base, externalId: "demo-0004", transactionCode: "DEMO0004", amountCents: 875, timestamp: hoursAgo(26), status: "SUCCESSFUL", paymentType: "CASH", description: "3x fris, 1x chips" },
      { ...base, externalId: "demo-0005", transactionCode: "DEMO0005", amountCents: 3600, timestamp: hoursAgo(28), status: "SUCCESSFUL", paymentType: "POS", cardType: "MAESTRO", description: "Rondje voor de tafel" },
      { ...base, externalId: "demo-0006", transactionCode: "DEMO0006", amountCents: 500, timestamp: hoursAgo(50), status: "REFUNDED", paymentType: "POS", cardType: "VISA", description: "Muntjes" },
      { ...base, externalId: "demo-0007", transactionCode: "DEMO0007", amountCents: 1500, timestamp: hoursAgo(1), status: "PENDING", paymentType: "ECOM", description: "Kaartje Kerstparty" },
    ];
    return [...items, items[0]];
  },
};
