-- Amplía el rango sin modificar ni eliminar participantes existentes.
begin;
alter table public.quiz_players drop constraint quiz_players_team_check;
alter table public.quiz_players add constraint quiz_players_team_check check (team between 1 and 9);
commit;
