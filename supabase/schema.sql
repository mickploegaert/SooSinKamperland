-- Databaseschema voor Supabase, gebaseerd op het PDM uit het ontwerpdocument.
--
-- Uitvoeren: Supabase-dashboard > SQL Editor > New query > dit hele bestand plakken > Run.
-- Het script kan veilig opnieuw worden uitgevoerd (tabellen worden niet overschreven).
--
-- Beveiliging in het kort:
-- * Wachtwoorden staan NIET in deze tabellen: Supabase Auth (auth.users) beheert ze.
-- * Row Level Security (RLS) staat op iedere tabel aan.
-- * Bezoekers (rol `anon`) mogen alleen website-inhoud, zichtbare activiteiten en
--   sponsoren lezen. Al het andere is alleen voor ingelogde beheerders.
-- * Rechten worden expliciet toegekend (GRANT), omdat nieuwe Supabase-projecten
--   tabellen niet meer automatisch openzetten voor de Data API.

-- ─── Hulpfunctie in een afgeschermd schema ───────────────────────────────────
-- Het schema `private` staat niet in de Data API, dus de functie is niet als
-- RPC aan te roepen. RLS-regels gebruiken hem wel.
create schema if not exists private;
grant usage on schema private to anon, authenticated, service_role;

-- ─── Beheerders (US07, US17) ─────────────────────────────────────────────────
create table if not exists public.beheerder (
  beheerder_id   bigint generated always as identity primary key,
  auth_user_id   uuid not null unique references auth.users (id) on delete cascade,
  gebruikersnaam varchar(50)  not null unique,
  email          varchar(255) not null unique,
  aangemaakt_op  timestamptz  not null default now()
);

-- Geeft true als de ingelogde gebruiker in de tabel beheerder staat.
create or replace function private.is_beheerder() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.beheerder where auth_user_id = (select auth.uid())
  );
$$;
revoke execute on function private.is_beheerder() from public;
grant execute on function private.is_beheerder() to anon, authenticated, service_role;

alter table public.beheerder enable row level security;
revoke all on table public.beheerder from anon, authenticated;
grant select on table public.beheerder to authenticated;
grant all on table public.beheerder to service_role;

-- Een ingelogde beheerder mag alleen zijn eigen profiel lezen. Inloggen met een
-- gebruikersnaam zoekt het e-mailadres op met de geheime sleutel (alleen op de server).
drop policy if exists "beheerder leest eigen profiel" on public.beheerder;
create policy "beheerder leest eigen profiel" on public.beheerder
  for select to authenticated using (auth_user_id = (select auth.uid()));

-- ─── Website-inhoud (US08) ───────────────────────────────────────────────────
create table if not exists public.website_inhoud (
  inhoud_id         bigint generated always as identity primary key,
  paginanaam        varchar(100) not null,
  sectie            varchar(100) not null,
  titel             varchar(255) not null,
  inhoudstekst      text         not null,
  afbeelding_url    varchar(255),
  laatste_wijziging timestamptz  not null default now(),
  beheerder_id      bigint references public.beheerder (beheerder_id) on delete set null,
  unique (paginanaam, sectie)
);

alter table public.website_inhoud enable row level security;
revoke all on table public.website_inhoud from anon, authenticated;
grant select on table public.website_inhoud to anon;
grant select, insert, update, delete on table public.website_inhoud to authenticated;
grant all on table public.website_inhoud to service_role;

drop policy if exists "iedereen leest website-inhoud" on public.website_inhoud;
create policy "iedereen leest website-inhoud" on public.website_inhoud
  for select to anon, authenticated using (true);
drop policy if exists "beheerders beheren website-inhoud" on public.website_inhoud;
create policy "beheerders beheren website-inhoud" on public.website_inhoud
  for all to authenticated
  using ((select private.is_beheerder())) with check ((select private.is_beheerder()));

-- ─── Activiteiten (US09) ─────────────────────────────────────────────────────
create table if not exists public.activiteit (
  activiteit_id  bigint generated always as identity primary key,
  naam           varchar(255) not null,
  beschrijving   text         not null,
  categorie      varchar(50),
  startdatum     date         not null,
  einddatum      date,
  starttijd      time,
  eindtijd       time,
  locatie        varchar(255),
  herhaling      varchar(5) check (herhaling in ('week', 'month')),
  herhaling_tot  date,
  afbeelding_url varchar(255),
  is_zichtbaar   boolean      not null default true,
  beheerder_id   bigint references public.beheerder (beheerder_id) on delete set null,
  check (einddatum is null or einddatum >= startdatum)
);

alter table public.activiteit enable row level security;
revoke all on table public.activiteit from anon, authenticated;
grant select on table public.activiteit to anon;
grant select, insert, update, delete on table public.activiteit to authenticated;
grant all on table public.activiteit to service_role;

-- Bezoekers zien alleen zichtbare activiteiten; beheerders zien alles.
drop policy if exists "iedereen leest zichtbare activiteiten" on public.activiteit;
create policy "iedereen leest zichtbare activiteiten" on public.activiteit
  for select to anon, authenticated
  using (is_zichtbaar or (select private.is_beheerder()));
drop policy if exists "beheerders beheren activiteiten" on public.activiteit;
create policy "beheerders beheren activiteiten" on public.activiteit
  for all to authenticated
  using ((select private.is_beheerder())) with check ((select private.is_beheerder()));

-- ─── Agenda met afspraken en vergaderingen (US11, US12) ──────────────────────
create table if not exists public.afspraak (
  afspraak_id  bigint generated always as identity primary key,
  titel        varchar(255) not null,
  datum        date         not null,
  starttijd    time         not null,
  eindtijd     time,
  locatie      varchar(255),
  notities     text,
  beheerder_id bigint references public.beheerder (beheerder_id) on delete set null,
  check (eindtijd is null or eindtijd > starttijd)
);

alter table public.afspraak enable row level security;
revoke all on table public.afspraak from anon, authenticated;
grant select, insert, update, delete on table public.afspraak to authenticated;
grant all on table public.afspraak to service_role;

drop policy if exists "beheerders beheren afspraken" on public.afspraak;
create policy "beheerders beheren afspraken" on public.afspraak
  for all to authenticated
  using ((select private.is_beheerder())) with check ((select private.is_beheerder()));

-- ─── Sponsoren (US10) ────────────────────────────────────────────────────────
create table if not exists public.sponsor (
  sponsor_id            bigint generated always as identity primary key,
  naam                  varchar(255) not null,
  beschrijving          text,
  logo_url              varchar(255),
  website_url           varchar(255),
  niveau                varchar(10) check (niveau in ('goud', 'zilver', 'brons')),
  is_vriend_van_de_soos boolean not null default false,
  weergave_volgorde     int     not null default 0,
  beheerder_id          bigint references public.beheerder (beheerder_id) on delete set null
);

alter table public.sponsor enable row level security;
revoke all on table public.sponsor from anon, authenticated;
grant select on table public.sponsor to anon;
grant select, insert, update, delete on table public.sponsor to authenticated;
grant all on table public.sponsor to service_role;

drop policy if exists "iedereen leest sponsoren" on public.sponsor;
create policy "iedereen leest sponsoren" on public.sponsor
  for select to anon, authenticated using (true);
drop policy if exists "beheerders beheren sponsoren" on public.sponsor;
create policy "beheerders beheren sponsoren" on public.sponsor
  for all to authenticated
  using ((select private.is_beheerder())) with check ((select private.is_beheerder()));

-- ─── Financiële transacties (US13, US14) ─────────────────────────────────────
-- Inkomsten en uitgaven staan in één tabel en worden gescheiden via transactietype.
create table if not exists public.financiele_transactie (
  transactie_id         bigint generated always as identity primary key,
  transactietype        varchar(20)   not null check (transactietype in ('inkomst', 'uitgave')),
  bedrag                decimal(10,2) not null check (bedrag > 0),
  datum                 date          not null,
  omschrijving          text          not null,
  bron                  varchar(20)   not null default 'handmatig',
  externe_transactie_id varchar(255)  unique,
  beheerder_id          bigint references public.beheerder (beheerder_id) on delete set null
);

alter table public.financiele_transactie enable row level security;
revoke all on table public.financiele_transactie from anon, authenticated;
grant select, insert, update, delete on table public.financiele_transactie to authenticated;
grant all on table public.financiele_transactie to service_role;

-- Alleen beheerders mogen financiële gegevens zien of wijzigen.
drop policy if exists "beheerders beheren financiën" on public.financiele_transactie;
create policy "beheerders beheren financiën" on public.financiele_transactie
  for all to authenticated
  using ((select private.is_beheerder())) with check ((select private.is_beheerder()));

-- ─── SumUp-transacties (US15, US16) ──────────────────────────────────────────
create table if not exists public.sumup_transactie (
  sumup_transactie_id     bigint generated always as identity primary key,
  externe_transactie_id   varchar(255)  not null unique,
  transactiecode          varchar(50),
  bedrag                  decimal(10,2) not null,
  valuta                  varchar(3)    not null,
  transactiedatum         timestamptz   not null,
  status                  varchar(50)   not null,
  betaalwijze             varchar(30),
  kaarttype               varchar(30),
  omschrijving            text,
  laatst_gesynchroniseerd timestamptz   not null default now()
);

alter table public.sumup_transactie enable row level security;
revoke all on table public.sumup_transactie from anon, authenticated;
grant select, insert, update, delete on table public.sumup_transactie to authenticated;
grant all on table public.sumup_transactie to service_role;

drop policy if exists "beheerders lezen sumup-transacties" on public.sumup_transactie;
drop policy if exists "beheerders beheren sumup-transacties" on public.sumup_transactie;
create policy "beheerders beheren sumup-transacties" on public.sumup_transactie
  for all to authenticated
  using ((select private.is_beheerder())) with check ((select private.is_beheerder()));

-- ─── Oude versie opruimen ────────────────────────────────────────────────────
-- Een eerdere versie van dit script zette is_beheerder() in het schema public.
drop function if exists public.is_beheerder();
