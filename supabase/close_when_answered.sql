-- Actualización para instalaciones existentes; reemplaza solo la función de envío.
create or replace function public.quiz_submit(p_game uuid, p_player uuid, p_token uuid, p_question integer, p_choice integer, p_correct integer)
returns jsonb language plpgsql security definer set search_path = public as $$
declare g quiz_games%rowtype; player quiz_players%rowtype; elapsed double precision; score integer;
begin
  select * into g from quiz_games where id = p_game for update;
  select * into player from quiz_players where id = p_player and game_id = p_game and token = p_token and active = true;
  if player.id is null then raise exception 'Participante no válido'; end if;
  if g.phase <> 'answer' or g.question_index <> p_question or g.started_at is null then raise exception 'La pregunta ya no está disponible'; end if;
  elapsed := extract(epoch from (clock_timestamp() - g.started_at));
  if elapsed < 0 or elapsed >= g.duration then raise exception 'El tiempo terminó'; end if;
  if p_choice not between 0 and 2 then raise exception 'Opción inválida'; end if;
  score := case when p_choice = p_correct then greatest(500, round(1000 - 500 * elapsed / g.duration)::integer) else 0 end;
  insert into quiz_answers(game_id, player_id, question_index, choice, points) values(p_game, p_player, p_question, p_choice, score);
  if not exists (
    select 1 from quiz_players p where p.game_id = p_game and p.active = true
    and not exists (select 1 from quiz_answers a where a.player_id = p.id and a.game_id = p_game and a.question_index = p_question)
  ) then
    update quiz_games set phase = 'result' where id = p_game and phase = 'answer' and question_index = p_question;
  end if;
  return jsonb_build_object('ok', true);
exception when unique_violation then raise exception 'Ya enviaste tu respuesta';
end $$;
revoke all on function public.quiz_submit(uuid,uuid,uuid,integer,integer,integer) from public, anon, authenticated;
grant execute on function public.quiz_submit(uuid,uuid,uuid,integer,integer,integer) to service_role;
