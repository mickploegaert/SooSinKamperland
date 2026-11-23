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
