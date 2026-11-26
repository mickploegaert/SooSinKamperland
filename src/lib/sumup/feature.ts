import "server-only";

/**
 * Kassa en SumUp staan voorlopig uit, omdat de koppeling met een echt
 * SumUp-account nog niet getest is. Zet SUMUP_ENABLED=true om de pagina's en
 * menu-items weer te tonen.
 */
export function isSumUpEnabled(): boolean {
  return process.env.SUMUP_ENABLED === "true";
}
