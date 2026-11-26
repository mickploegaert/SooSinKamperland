-- Maakt van een bestaande Supabase Auth-gebruiker een beheerder.
--
-- 1. Maak eerst de gebruiker aan: Authentication > Users > Add user > Create new user.
-- 2. Vul hieronder het e-mailadres en de gewenste gebruikersnaam in.
-- 3. Voer dit uit in de SQL Editor.
--
-- Alleen gebruikers die in de tabel beheerder staan, kunnen in het dashboard.
-- Herhaal dit voor iedere beheerder (met een eigen gebruikersnaam).

insert into public.beheerder (auth_user_id, gebruikersnaam, email)
select id, 'beheerder', email                 -- ← gebruikersnaam om mee in te loggen
from auth.users
where email = 'beheerder@soosinkamperland.nl' -- ← e-mailadres van de gebruiker
on conflict (auth_user_id) do nothing;

-- Controle: hier hoort de nieuwe beheerder in te staan.
select beheerder_id, gebruikersnaam, email, aangemaakt_op from public.beheerder;
