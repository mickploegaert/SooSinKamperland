# Supabase instellen

De website draait standaard op een lokale JSON-opslag (`DATA_PROVIDER=local`). Met
`DATA_PROVIDER=supabase` gebruikt hij de Supabase-database en Supabase Auth. De code
daarvoor is klaar; je hoeft alleen een project aan te maken en de stappen hieronder te volgen.

## Hoe het werkt

| Onderdeel | Bestand |
| --- | --- |
| Tabellen, rechten en RLS-regels | `supabase/schema.sql` |
| Startgegevens (website-inhoud, activiteiten, sponsoren) | `supabase/seed.sql` |
| Beheerder koppelen aan een Supabase-account | `supabase/create-admin.sql` |
| Gegevens lezen en schrijven | `src/lib/data/supabase/` |
| Inloggen, uitloggen, sessie | `src/lib/auth/supabase-auth.ts` |
| Supabase-clients en sleutels | `src/lib/supabase/` |

- Alle verbindingen met Supabase lopen via de server. De browser praat nooit direct met Supabase.
- Iedere tabel heeft Row Level Security (RLS). Bezoekers mogen alleen website-inhoud,
  zichtbare activiteiten en sponsoren lezen. Al het andere is alleen voor beheerders.
- Een beheerder is een gebruiker in Supabase Auth **én** een rij in de tabel `beheerder`.
  Alleen een Auth-account is niet genoeg om in het dashboard te komen.
- De secret key wordt alleen gebruikt om bij het inloggen een gebruikersnaam om te
  zetten naar het e-mailadres.
- De sessie staat in httpOnly-cookies. De proxy (`src/proxy.ts`) ververst verlopen tokens,
  en na uitloggen werkt een oude cookie niet meer.

## Stappen

### 1. Project aanmaken
1. Ga naar <https://supabase.com/dashboard> en klik op **New project**.
2. Kies de organisatie, een projectnaam (bijv. `soos-in-kamperland`) en een sterk
   databasewachtwoord. Bewaar dit wachtwoord in een wachtwoordmanager. De website heeft het
   niet nodig, maar je hebt het later wel nodig voor directe databasetoegang.
3. **Region**: kies een regio in de EU (bijv. *Central EU (Frankfurt)* of *West EU (Ireland)*),
   zodat persoonsgegevens in de EU blijven.
4. Als deze opties verschijnen:
   - **Enable Data API**: ✅ aan. De website gebruikt de Data API.
   - **Automatically expose new tables (and functions)**: mag uit (☐). `schema.sql` geeft zelf
     de juiste rechten. Uit is veiliger.
   - **Enable automatic RLS** (of vergelijkbaar): ✅ aan. `schema.sql` zet RLS hoe dan ook aan.
   - Bij een keuze tussen het `public`-schema en een apart API-schema: kies **public**.

### 2. Database vullen
1. Open **SQL Editor** → **New query**.
2. Plak de volledige inhoud van `supabase/schema.sql` en klik op **Run**. Je ziet "Success. No rows returned".
3. Maak een nieuwe query met de inhoud van `supabase/seed.sql` en klik op **Run**.
4. Controleer onder **Table Editor** of de tabellen bestaan. Elke tabel hoort het label
   "RLS enabled" te hebben. `sponsor` heeft 15 rijen, `activiteit` 6 en `website_inhoud` 2.

Beide scripts mogen opnieuw worden uitgevoerd; er komen geen dubbele rijen.

### 3. Inloggen instellen (Authentication)
**Authentication → Sign In / Providers**
- **Allow new users to sign up**: ☐ **uit**. Anders kan iedereen een account maken.
  Zo'n account komt overigens niet in het dashboard zonder rij in `beheerder`.
- **Allow anonymous sign-ins**: ☐ uit.
- **Email**-provider: ✅ aan (zo loggen beheerders in).
  - **Confirm email**: mag aan blijven. Beheerders maak je zelf aan en bevestig je direct (stap 4).
  - **Minimum password length**: zet op **12**.
  - **Password requirements**: kies minimaal kleine letters, hoofdletters en cijfers.
  - **Secure email change** / **Secure password change**: ✅ aan laten.
- Alle andere providers (Google, GitHub, Apple, telefoon, …): ☐ uit.

**Authentication → URL Configuration**
- **Site URL**: het adres van de website (bijv. `https://soos-in-kamperland.vercel.app`).
  Lokaal: `http://localhost:3000`.

**Authentication → Attack Protection** (optioneel)
- **Leaked password protection** is alleen beschikbaar op het Pro-abonnement. Op het
  gratis abonnement kan dit uit blijven.
- CAPTCHA: uit laten. Het inlogformulier stuurt geen CAPTCHA mee, dus met CAPTCHA aan kan
  niemand meer inloggen.

### 4. Beheerder aanmaken
1. **Authentication → Users → Add user → Create new user**.
2. Vul het e-mailadres en een sterk wachtwoord in en zet **Auto Confirm User** ✅ aan.
3. Open `supabase/create-admin.sql` en pas het e-mailadres en de gebruikersnaam aan.
   Voer het daarna uit in de **SQL Editor**. Je ziet de nieuwe beheerder in het resultaat.
4. Herhaal dit voor iedere beheerder.

Een beheerder verwijderen: verwijder de gebruiker onder **Authentication → Users**.
De rij in `beheerder` verdwijnt dan automatisch.

### 5. Sleutels in de website zetten
1. **Project URL**: klik bovenaan op **Connect**, of kijk onder **Project Settings → Data API**.
2. **Project Settings → API Keys**: kopieer de **Publishable key** (`sb_publishable_...`)
   en de **Secret key** (`sb_secret_...`). Maak er eventueel een aan als hij er nog niet staat.
3. Zet in `.env.local` (lokaal) of bij de omgevingsvariabelen van de hosting (bijv. Vercel):

   ```env
   DATA_PROVIDER=supabase
   SUPABASE_URL=https://<project-ref>.supabase.co
   SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   SUPABASE_SECRET_KEY=sb_secret_...
   ```

   - Gebruik **geen** `NEXT_PUBLIC_`-voorvoegsel.
   - Zet de secret key nooit in git, in een chat of in code. Hij omzeilt alle RLS-regels.
   - Gebruik de legacy `anon`- en `service_role`-sleutels niet. Supabase stopt daar in 2027 mee.

4. Start de website opnieuw (`npm run dev`). Na het wijzigen van omgevingsvariabelen op Vercel
   moet je opnieuw deployen.

### 6. Controleren
- [ ] De homepage, `/activiteiten` en `/sponsoren` tonen de startgegevens.
- [ ] Inloggen op `/inloggen` werkt met de gebruikersnaam én met het e-mailadres.
- [ ] Een fout wachtwoord geeft "Onjuiste inloggegevens.".
- [ ] Een activiteit of sponsor toevoegen in het dashboard staat direct op de website.
- [ ] Een inkomst toevoegen verschijnt in het financieel overzicht.
- [ ] Na **Uitloggen** kom je niet meer in `/dashboard`.
- [ ] **Advisors → Security Advisor** toont geen fouten (ERROR) voor deze tabellen.

## Terug naar lokaal
Zet `DATA_PROVIDER=local` (of laat het weg). De JSON-opslag in `.data/` wordt dan weer
gebruikt; de gegevens in Supabase blijven bewaard.

## Lokaal testen met Docker (optioneel)
Met Docker Desktop en de Supabase CLI kun je een lokale Supabase draaien:
`npx supabase init`, daarna `npx supabase start`. Gebruik de getoonde URL en sleutels in `.env.local`,
en voer `schema.sql`, `seed.sql` en `create-admin.sql` uit via de lokale Studio of `psql`.
