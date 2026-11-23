# Overstappen naar Supabase

Zolang er nog geen toegang tot Supabase is, draait de website op een lokale
JSON-opslag (`.data/soos-db.json`) met eigen authenticatie. De rest van de code
praat alleen met twee contracten, zodat de overstap beperkt blijft tot het
schrijven van twee adapters.

| Contract | Bestand | Lokale implementatie |
| --- | --- | --- |
| `Database` (repositories per tabel) | `src/lib/data/repositories.ts` | `src/lib/data/local/*` |
| `AuthService` (inloggen, uitloggen, sessie) | `src/lib/auth/service.ts` | `src/lib/auth/local-auth.ts` |

## Stappen

1. Maak een Supabase-project aan en voer `supabase/schema.sql` uit in de SQL-editor.
2. Installeer de clients: `npm install @supabase/supabase-js @supabase/ssr`.
3. Vul in `.env.local` de variabelen `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` en `SUPABASE_SERVICE_ROLE_KEY` in.
4. Schrijf `src/lib/data/supabase/index.ts` die het `Database`-contract
   implementeert. Zet kolomnamen om naar de velden in `src/lib/data/types.ts`
   (bijvoorbeeld `beheerder_id` → `id`, `aangemaakt_op` → `createdAt`).
5. Schrijf `src/lib/auth/supabase-auth.ts` die het `AuthService`-contract implementeert:
   - `signIn`: zoek bij een gebruikersnaam eerst het e-mailadres op in `beheerder`
     en roep daarna `supabase.auth.signInWithPassword` aan.
   - `signOut`: `supabase.auth.signOut()` (verwijdert ook de sessiecookies).
   - `getCurrentAdmin`: `supabase.auth.getUser()` en daarna het profiel uit `beheerder`.
   - `hasValidSession`: maak in de proxy een server client met de request-cookies
     en controleer `supabase.auth.getClaims()`.
6. Laat `getDatabase()` (`src/lib/data/index.ts`) en `getAuthService()`
   (`src/lib/auth/service.ts`) de Supabase-adapters teruggeven als
   `DATA_PROVIDER=supabase`.
7. Zet `DATA_PROVIDER=supabase` en maak de beheerders aan via Supabase Auth.

Pagina's, formulieren en server actions hoeven daarvoor niet aangepast te worden.

## Gegevens overzetten

De lokale opslag is gewoon JSON. Records uit `.data/soos-db.json` kunnen met een
klein script of via de CSV-import van Supabase in de bijbehorende tabellen worden
gezet. Wachtwoordhashes kunnen niet mee; beheerders krijgen een nieuw wachtwoord via
Supabase Auth.
