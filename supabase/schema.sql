-- Databaseschema voor Supabase, gebaseerd op het PDM uit het ontwerpdocument.
-- Uitvoeren in de Supabase SQL-editor zodra het project beschikbaar is.
-- Wachtwoorden staan NIET in deze tabellen: Supabase Auth (auth.users) hasht ze met bcrypt.

-- ─── Beheerders (US07, US17, US18) ───────────────────────────────────────────
create table if not exists public.beheerder (
  beheerder_id   bigint generated always as identity primary key,
  auth_user_id   uuid not null unique references auth.users (id) on delete cascade,
  gebruikersnaam varchar(50)  not null unique,
  email          varchar(255) not null unique,
  rol            varchar(20)  not null default 'beheerder'
                 check (rol in ('hoofdbeheerder', 'beheerder')),
  aangemaakt_op  timestamptz  not null default now()
);

alter table public.beheerder enable row level security;

-- Een ingelogde beheerder mag zijn eigen profiel lezen.
create policy "beheerder leest eigen profiel" on public.beheerder
  for select to authenticated using (auth_user_id = auth.uid());

-- Hulpfunctie voor RLS-regels op de overige tabellen.
create or replace function public.is_beheerder() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.beheerder where auth_user_id = auth.uid());
$$;

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
create policy "iedereen leest website-inhoud" on public.website_inhoud
  for select using (true);
create policy "beheerders beheren website-inhoud" on public.website_inhoud
  for all to authenticated using (public.is_beheerder()) with check (public.is_beheerder());

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
  afbeelding_url varchar(255),
  is_zichtbaar   boolean      not null default true,
  beheerder_id   bigint references public.beheerder (beheerder_id) on delete set null,
  check (einddatum is null or einddatum >= startdatum)
);

alter table public.activiteit enable row level security;
create policy "iedereen leest zichtbare activiteiten" on public.activiteit
  for select using (is_zichtbaar or public.is_beheerder());
create policy "beheerders beheren activiteiten" on public.activiteit
  for all to authenticated using (public.is_beheerder()) with check (public.is_beheerder());

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
create policy "iedereen leest sponsoren" on public.sponsor for select using (true);
create policy "beheerders beheren sponsoren" on public.sponsor
  for all to authenticated using (public.is_beheerder()) with check (public.is_beheerder());

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
-- Alleen beheerders mogen financiële gegevens zien of wijzigen.
create policy "beheerders beheren financiën" on public.financiele_transactie
  for all to authenticated using (public.is_beheerder()) with check (public.is_beheerder());

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
create policy "beheerders lezen sumup-transacties" on public.sumup_transactie
  for all to authenticated using (public.is_beheerder()) with check (public.is_beheerder());
