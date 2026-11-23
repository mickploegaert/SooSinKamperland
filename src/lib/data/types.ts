/**
 * Domeintypes. De velden volgen het PDM uit het ontwerpdocument
 * (tabelnamen en kolommen staan per type in het commentaar), zodat een
 * Supabase-adapter de rijen één-op-één kan omzetten.
 */

export type AdminRole = "hoofdbeheerder" | "beheerder";

/** Tabel `beheerder` */
export type Admin = {
  /** beheerder_id */
  id: number;
  /** gebruikersnaam (UK) */
  username: string;
  /** email (UK) */
  email: string;
  /** wachtwoord_hash — bij Supabase beheert Supabase Auth dit veld zelf. */
  passwordHash: string;
  role: AdminRole;
  /** aangemaakt_op */
  createdAt: string;
};

/** Beheerdersgegevens zonder gevoelige velden, veilig om aan componenten door te geven. */
export type AdminProfile = Omit<Admin, "passwordHash">;
