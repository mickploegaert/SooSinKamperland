-- Startgegevens: dezelfde inhoud als de lokale JSON-opslag.
-- Uitvoeren NA schema.sql, in de SQL Editor. Iedere tabel wordt alleen gevuld
-- als hij nog leeg is, dus opnieuw uitvoeren maakt geen dubbele rijen.

-- Website-inhoud (US08)
insert into public.website_inhoud (paginanaam, sectie, titel, inhoudstekst)
select * from (values
  ('home', 'welkom', 'Welkom bij Soos in Kamperland', 'Dé plek voor jong en oud in Kamperland. Bekijk onze activiteiten en meer!'),
  ('contact', 'contactgegevens', 'Neem contact met ons op', 'Heb je een vraag over een activiteit of wil je sponsor worden? Neem gerust contact met ons op, we helpen je graag verder.')
) as v
where not exists (select 1 from public.website_inhoud);

-- Activiteiten (US09)
insert into public.activiteit
  (naam, beschrijving, categorie, startdatum, starttijd, eindtijd, locatie, herhaling, herhaling_tot, afbeelding_url)
select naam, beschrijving, categorie, startdatum::date, starttijd::time, eindtijd::time, locatie, herhaling, herhaling_tot::date, afbeelding_url
from (values
  ('Bingo Avond', 'Een gezellige avond vol spel, plezier en leuke prijzen. Kom langs bij Soos in Kamperland en doe mee!', 'Spel', '2026-12-12', '20:00', '23:00', 'Soos in Kamperland', 'month', '2027-03-31', '/activiteiten/soos-1.jpg'),
  ('Pubquiz', 'Test je kennis samen met je vrienden tijdens onze pubquiz. Geef je team op aan de bar.', 'Spel', '2026-11-28', '20:00', '23:00', 'Soos in Kamperland', null, null, '/activiteiten/soos-1.jpg'),
  ('Kerstparty', 'Vier de feestdagen met ons tijdens de jaarlijkse kerstparty met muziek en drankjes.', 'Feest', '2026-12-19', '21:00', '01:00', 'Soos in Kamperland', null, null, '/activiteiten/soos-1.jpg'),
  ('DJ Avond', 'Lokale DJ''s draaien de hele avond de beste plaatjes. Dansen tot in de late uurtjes!', 'Feest', '2027-01-10', '20:00', '01:00', 'Soos in Kamperland', null, null, '/activiteiten/soos-1.jpg'),
  ('Filmavond', 'Een gezellige filmavond op groot scherm, met popcorn erbij.', 'Film', '2027-01-23', '19:30', '22:00', 'Soos in Kamperland', null, null, '/activiteiten/soos-2.jpg'),
  ('Themafeest', 'Kom verkleed volgens het thema van de avond en maak kans op een prijs voor de beste outfit.', 'Feest', '2027-02-06', '21:00', '01:00', 'Soos in Kamperland', null, null, '/activiteiten/soos-1.jpg')
) as v (naam, beschrijving, categorie, startdatum, starttijd, eindtijd, locatie, herhaling, herhaling_tot, afbeelding_url)
where not exists (select 1 from public.activiteit);

-- Sponsoren (US10)
insert into public.sponsor (naam, beschrijving, logo_url, weergave_volgorde)
select * from (values
  ('AH & Etos Kamperland', 'Supermarkt en drogist in Kamperland.', '/sponsoren/ah-etos-kamperland.png', 1),
  ('Installatiebedrijf Zuid', 'Installatiebedrijf IBZ b.v.', '/sponsoren/installatiebedrijf-zuid.jpeg', 2),
  ('Suukeruusje', 'Toarte om van te (tr)ouwe.', '/sponsoren/suukeruusje.png', 3),
  ('Schildersbedrijf Jongejan', 'Schildersbedrijf in Kamperland en omgeving.', '/sponsoren/schildersbedrijf-jongejan.png', 4),
  ('Eriks Optiek', 'Brillen en lenzen.', '/sponsoren/eriks-optiek.png', 5),
  ('De Visserie', 'Verse vis.', '/sponsoren/de-visserie.jpeg', 6),
  ('TA Makelaardij', 'Makelaardij.', '/sponsoren/ta-makelaardij.jpeg', 7),
  ('Novelty', 'Skin & health.', '/sponsoren/novelty.png', 8),
  ('Zilt Beauty', 'Beauty | Kamperland.', '/sponsoren/zilt-beauty.png', 9),
  ('Meulenberg Woon-ID', 'Vloeren, raamdecoratie en woonaccessoires.', '/sponsoren/meulenberg-woon-id.jpg', 10),
  ('Tino van Leeuwen', 'Vloerbedekking.', '/sponsoren/tino-van-leeuwen.jpeg', 11),
  ('Jacare', 'We care for you.', '/sponsoren/jacare.png', 12),
  ('Bouwcenter De Haze', 'Bouwmaterialen en doe-het-zelf.', '/sponsoren/bouwcenter-de-haze.jpg', 13),
  ('De Fietsloods', 'Fietsen.', '/sponsoren/de-fietsloods.png', 14),
  ('Kwalitaria', 'Natuurlijk de lekkerste.', '/sponsoren/kwalitaria.jpg', 15)
) as v
where not exists (select 1 from public.sponsor);
