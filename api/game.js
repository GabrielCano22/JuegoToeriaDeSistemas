import { createClient } from '@supabase/supabase-js';
import { randomInt, randomUUID, timingSafeEqual } from 'node:crypto';
import { questions } from '../questions.js';
import { rankTeams } from '../scores.js';

const equal = (a, b) => { const x = Buffer.from(String(a || '')), y = Buffer.from(String(b || '')); return x.length > 0 && x.length === y.length && timingSafeEqual(x, y); };
const fail = (message, status = 400) => { const e = new Error(message); e.status = status; throw e; };

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({error:'Método no permitido'});
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.HOST_PASSWORD) fail('El servidor aún no está configurado.', 503);
    const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {auth:{persistSession:false}});
    const b = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const query = async (q) => { const {data,error} = await q; if (error) throw new Error(error.message); return data; };
    if (b.action === 'create') {
      if (!equal(b.password, process.env.HOST_PASSWORD)) fail('Clave de anfitrión incorrecta.', 403);
      let game;
      for (let i=0;i<8;i++) {
        const result = await db.from('quiz_games').insert({pin:String(randomInt(100000,1000000)),host_token:randomUUID()}).select().single();
        if (!result.error) {game=result.data; break;} if (result.error.code !== '23505') throw result.error;
      }
      if (!game) fail('No se pudo crear la sala. Intenta de nuevo.');
      return res.status(200).json({pin:game.pin, hostToken:game.host_token});
    }
    const game = await query(db.from('quiz_games').select('*').eq('pin', String(b.pin || '')).maybeSingle());
    if (!game) fail('No encontramos esa sala.', 404);
    const isHost = equal(b.hostToken, game.host_token);
    if (b.action === 'join') {
      if (game.phase !== 'lobby') fail('La partida ya comenzó.');
      const name = String(b.name || '').trim().replace(/\s+/g,' ');
      const team = Number(b.team);
      if (name.length < 1 || name.length > 24 || !Number.isInteger(team) || team < 1 || team > 8) fail('Revisa tu nombre y equipo.');
      let character;
      try { character = JSON.parse(b.avatar); } catch { fail('Personaje inválido.'); }
      const allowed={type:['person','robot','cat','alien'],skin:['peach','brown','dark','mint','blue','lilac'],outfit:['shirt','hoodie','suit','star'],hat:['none','cap','beanie','crown','party'],glasses:['none','round','sun','star'],outfitColor:['teal','coral','gold','purple','navy','pink']};
      if (!character || typeof character !== 'object' || Object.keys(character).length !== Object.keys(allowed).length || !Object.entries(allowed).every(([key,values])=>values.includes(character[key])) || !['mint','coral','gold','lavender'].includes(b.color)) fail('Personaje inválido.');
      const player = await query(db.from('quiz_players').insert({game_id:game.id,name,team,avatar:b.avatar,color:b.color}).select('id,token').single());
      return res.status(200).json({playerId:player.id, playerToken:player.token});
    }
    let player = null;
    if (b.playerId && b.playerToken) player = await query(db.from('quiz_players').select('*').eq('game_id',game.id).eq('id',b.playerId).eq('token',b.playerToken).eq('active',true).maybeSingle());
    if (!isHost && !player) fail('Tu acceso a la partida ya no está activo.', 403);
    if (b.action === 'submit') {
      if (!player || !Number.isInteger(b.questionIndex) || !questions[b.questionIndex]) fail('Respuesta inválida.');
      await query(db.rpc('quiz_submit',{p_game:game.id,p_player:player.id,p_token:player.token,p_question:b.questionIndex,p_choice:b.choice,p_correct:questions[b.questionIndex].correct}));
      return res.status(200).json({ok:true});
    }
    if (b.action === 'control') {
      if (!isHost) fail('Solo el anfitrión puede hacer eso.',403);
      if (b.command === 'remove') {
        if (game.phase !== 'lobby') fail('Solo puedes retirar jugadores antes de comenzar.');
        await query(db.from('quiz_players').update({active:false}).eq('game_id',game.id).eq('id',b.target));
      } else {
        let update;
        if (b.command === 'start' && game.phase === 'lobby') {
          const members = await query(db.from('quiz_players').select('id').eq('game_id',game.id).eq('active',true).limit(1));
          if (!members.length) fail('Espera a que entre al menos un participante.');
          update={phase:'reading',question_index:0};
        } else if (b.command === 'answer' && game.phase === 'reading') update={phase:'answer',started_at:new Date().toISOString(),duration:Math.min(180,Math.max(20,Number(b.duration)||60))};
        else if (b.command === 'reveal' && game.phase === 'answer') update={phase:'result'};
        else if (b.command === 'next' && game.phase === 'result') update=game.question_index + 1 < questions.length ? {phase:'reading',question_index:game.question_index+1,started_at:null} : {phase:'final'};
        else fail('Esta acción no está disponible.');
        await query(db.from('quiz_games').update(update).eq('id',game.id).eq('phase',game.phase).select());
      }
      return res.status(200).json({ok:true});
    }
    if (b.action !== 'state') fail('Acción desconocida.');
    if (game.phase === 'answer' && Date.now() >= Date.parse(game.started_at) + game.duration * 1000) {
      await query(db.from('quiz_games').update({phase:'result'}).eq('id',game.id).eq('phase','answer'));
      game.phase='result';
    }
    const [players, answers] = await Promise.all([
      query(db.from('quiz_players').select('id,name,team,avatar,color').eq('game_id',game.id).eq('active',true).order('created_at')),
      query(db.from('quiz_answers').select('player_id,question_index,choice,points').eq('game_id',game.id))
    ]);
    const q=questions[game.question_index];
    const reveal=game.phase === 'result' || game.phase === 'final';
    const safeQuestion=q && game.phase !== 'lobby' ? {title:q.title,scenario:q.scenario,question:q.question,options:q.options,...(reveal ? {correct:q.correct,explanation:q.explanation}:{})} : null;
    const totals=Object.fromEntries(players.map(p=>[p.id, answers.filter(a=>a.player_id===p.id && (reveal || a.question_index < game.question_index)).reduce((n,a)=>n+a.points,0)]));
    const teams=rankTeams(Array.from({length:8},(_,i)=>{const members=players.filter(p=>p.team===i+1);return {team:i+1,count:members.length,points:members.length ? Math.round(members.reduce((n,p)=>n+(totals[p.id]||0),0)/members.length):0};}));
    const mine=player ? answers.find(a=>a.player_id===player.id && a.question_index===game.question_index) : null;
    const current=answers.filter(a=>a.question_index===game.question_index);
    return res.status(200).json({pin:game.pin,phase:game.phase,index:game.question_index,total:questions.length,startedAt:game.started_at,duration:game.duration,serverNow:new Date().toISOString(),question:safeQuestion,players:players.map(p=>({...p,points:totals[p.id]})),teams,answerCount:current.length,answered:!!mine,personal:reveal && mine ? {choice:mine.choice,points:mine.points} : null,counts:reveal ? [0,1,2].map(i=>current.filter(a=>a.choice===i).length) : null});
  } catch (e) { return res.status(e.status || 400).json({error:e.message || 'Ocurrió un error.'}); }
}
