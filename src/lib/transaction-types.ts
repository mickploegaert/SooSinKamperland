import type { TransactionType } from "@/lib/data/types";

export const TRANSACTION_TYPES: Record<
  TransactionType,
  { label: string; plural: string; path: string; addLabel: string; description: string }
> = {
  inkomst: {
    label: "Inkomst",
    plural: "Inkomsten",
    path: "/dashboard/inkomsten",
    addLabel: "+ Inkomst",
    description: "Registreer inkomsten zoals baromzet, entreegeld en verhuur.",
  },
  uitgave: {
    label: "Uitgave",
    plural: "Uitgaven",
    path: "/dashboard/uitgaven",
    addLabel: "+ Uitgave",
    description: "Registreer uitgaven zoals inkoop, huur en energie.",
  },
};

export function isTransactionType(value: string): value is TransactionType {
  return value === "inkomst" || value === "uitgave";
}
