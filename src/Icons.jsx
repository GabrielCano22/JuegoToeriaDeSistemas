import React from 'react';
import {Character,defaultCharacter} from './Character';

export function ChoiceIcon({category,id}) {
  if(id==='none') return <svg className="choice-svg" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="17" fill="none" stroke="currentColor" strokeWidth="3"/><path d="M15 15l18 18" fill="none" stroke="currentColor" strokeWidth="3"/></svg>;
  return <span className="choice-character" aria-hidden="true"><Character value={{...defaultCharacter,[category]:id}}/></span>;
}
export function Medal({place}) {return <svg className={'medal-icon medal-'+place} viewBox="0 0 80 96" role="img" aria-label={`${place+1}.º lugar`}><path d="M21 3h16l8 33-11 9zM59 3H43l-8 33 11 9z" fill="#8fb5d0" stroke="#263d4b" strokeWidth="3" strokeLinejoin="round"/><circle cx="40" cy="55" r="29" className="medal-fill" stroke="#263d4b" strokeWidth="3"/><circle cx="40" cy="55" r="22" fill="none" stroke="#ffffff88" strokeWidth="3"/><text x="40" y="65" textAnchor="middle" fill="#263d4b" fontFamily="sans-serif" fontSize="29" fontWeight="bold">{place+1}</text></svg>}
export function SoundIcon({muted}) {return <svg viewBox="0 0 24 24" className="sound-icon" aria-hidden="true"><path d="M3 9h4l5-4v14l-5-4H3z" fill="currentColor"/>{muted?<path d="m16 9 5 6m0-6-5 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>:<path d="M15 8c2 2 2 6 0 8m3-11c4 4 4 10 0 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>}</svg>}
