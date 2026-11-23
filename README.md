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

Er wordt voorlopig een lokale JSON-opslag gebruikt. Alle code praat met de contracten in
`src/lib/data/repositories.ts` en `src/lib/auth/service.ts`, zodat later eenvoudig naar
Supabase kan worden overgestapt. Zie [docs/supabase.md](docs/supabase.md).
