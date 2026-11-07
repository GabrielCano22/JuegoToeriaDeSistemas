import {useCallback, useEffect, useRef, useState} from 'react';

// Secuencia original sintetizada localmente: no usa archivos ni audio de terceros.
export function useQuizMusic(active, remaining) {
  const [muted,setMuted]=useState(()=>localStorage.getItem('mision-musica')==='off');
  const [unlocked,setUnlocked]=useState(false);
  const audio=useRef(null), state=useRef({active,remaining,muted}), beat=useRef(0), next=useRef(0);
  state.current={active,remaining,muted};
  const unlock=useCallback(()=>{
    try {
      const AudioContext=window.AudioContext||window.webkitAudioContext;
      if(!AudioContext) return;
      if(!audio.current) audio.current=new AudioContext();
      audio.current.resume().then(()=>setUnlocked(audio.current?.state==='running')).catch(()=>setUnlocked(false));
    } catch {setUnlocked(false)}
  },[]);
  const toggle=useCallback(()=>{
    if(muted) unlock();
    const nextMuted=!muted; setMuted(nextMuted); localStorage.setItem('mision-musica',nextMuted?'off':'on');
  },[muted,unlock]);
  useEffect(()=>{
    const melody=[220,261.63,329.63,261.63,196,246.94,293.66,246.94,174.61,220,261.63,220,196,246.94,293.66,329.63];
    function tone(ctx,freq,type,volume,length) {
      const osc=ctx.createOscillator(), gain=ctx.createGain(), t=ctx.currentTime;
      osc.type=type; osc.frequency.setValueAtTime(freq,t);
      gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(volume,t+.012);gain.gain.exponentialRampToValueAtTime(.0001,t+length);
      osc.connect(gain);gain.connect(ctx.destination);osc.start(t);osc.stop(t+length+.02);
    }
    const timer=setInterval(()=>{
      const ctx=audio.current, s=state.current;
      if(!ctx||ctx.state!=='running'||!s.active||s.muted||s.remaining<=0) {next.current=0;return}
      const now=performance.now();if(now<next.current)return;
      const urgent=s.remaining<=10, step=urgent?175:255;
      next.current=now+step;
      tone(ctx,melody[beat.current%melody.length], 'triangle', .055, urgent?.14:.20);
      if(beat.current%4===0)tone(ctx,melody[beat.current%melody.length]/2,'sine',.09,urgent?.20:.30);
      beat.current++;
    },35);
    return()=>{clearInterval(timer);audio.current?.close().catch(()=>{});audio.current=null};
  },[]);
  return {muted,unlocked,unlock,toggle};
}
