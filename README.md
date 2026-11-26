# Soos in Kamperland

Next.js-project voor de website van Soos in Kamperland. De user stories worden één voor één gebouwd.

## Starten

```powershell
npm install
npm run dev
```

## Beheerdersdashboard

Het dashboard staat op [`/inloggen`](http://localhost:3000/inloggen). Bij de eerste start wordt
een lokale database in `.data/` aangemaakt met dit account:

| Gebruikersnaam | E-mailadres | Wachtwoord |
| --- | --- | --- |
| `beheerder` | `beheerder@soosinkamperland.nl` | `SoosBeheer2026!` |

Dit account kan worden aangepast met de `SEED_ADMIN_*`-variabelen in `.env.local`
(zie `.env.example`). Verwijder de map `.data/` om opnieuw te beginnen.

## Opslag en Supabase

De website kan met twee soorten opslag draaien, ingesteld met `DATA_PROVIDER` in `.env.local`:

- `local` (standaard): een JSON-bestand in `.data/`, handig voor ontwikkeling zonder account.
- `supabase`: de Supabase-database met Supabase Auth voor het inloggen.

Alle code praat met de contracten in `src/lib/data/repositories.ts` en
`src/lib/auth/service.ts`; pagina's en formulieren werken met beide hetzelfde.
Hoe je Supabase instelt staat in [docs/supabase.md](docs/supabase.md).
