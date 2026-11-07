import React from 'react';

export const characterOptions = {
  type: [{id:'person',label:'Persona',icon:'🙂'},{id:'robot',label:'Robot',icon:'🤖'},{id:'cat',label:'Gatito',icon:'🐱'},{id:'alien',label:'Alien',icon:'👽'}],
  skin: [{id:'peach',label:'Durazno',color:'#f2b993'},{id:'brown',label:'Canela',color:'#b87856'},{id:'dark',label:'Chocolate',color:'#754938'},{id:'mint',label:'Menta',color:'#9ee4c8'},{id:'blue',label:'Cielo',color:'#a6c7eb'},{id:'lilac',label:'Lila',color:'#cbb8e9'}],
  outfit: [{id:'shirt',label:'Camiseta',icon:'👕'},{id:'hoodie',label:'Buzo',icon:'🧥'},{id:'suit',label:'Elegante',icon:'👔'},{id:'star',label:'Estrella',icon:'⭐'}],
  hat: [{id:'none',label:'Sin sombrero',icon:'✕'},{id:'cap',label:'Gorra',icon:'🧢'},{id:'beanie',label:'Gorro',icon:'🎩'},{id:'crown',label:'Corona',icon:'👑'},{id:'party',label:'Fiesta',icon:'🎉'}],
  glasses: [{id:'none',label:'Sin lentes',icon:'✕'},{id:'round',label:'Redondos',icon:'👓'},{id:'sun',label:'De sol',icon:'🕶️'},{id:'star',label:'Estrella',icon:'⭐'}],
  outfitColor: [{id:'teal',label:'Turquesa',color:'#35a997'},{id:'coral',label:'Coral',color:'#ec8e83'},{id:'gold',label:'Dorado',color:'#e4b65c'},{id:'purple',label:'Violeta',color:'#a88fd1'},{id:'navy',label:'Azul',color:'#607fb0'},{id:'pink',label:'Rosa',color:'#db93b4'}]
};
export const defaultCharacter = {type:'person',skin:'peach',outfit:'shirt',hat:'none',glasses:'none',outfitColor:'teal'};
export function parseCharacter(value) { try {const parsed=typeof value==='string'?JSON.parse(value):value; return Object.fromEntries(Object.entries(characterOptions).map(([key,options])=>[key,options.some(o=>o.id===parsed?.[key])?parsed[key]:defaultCharacter[key]]));} catch {return defaultCharacter} }
export function Character({value, className=''}) {
  const c=parseCharacter(value), skin=characterOptions.skin.find(x=>x.id===c.skin).color, shirt=characterOptions.outfitColor.find(x=>x.id===c.outfitColor).color;
  return <svg className={'character '+className} viewBox="0 0 200 220" role="img" aria-label={`Personaje ${characterOptions.type.find(x=>x.id===c.type).label}`}>
    <ellipse cx="100" cy="209" rx="55" ry="7" fill="#102432" opacity=".17"/>
    <path d="M65 157 L60 196 Q59 204 68 204 H85 L91 163 M109 163 L115 204 H132 Q141 204 140 196 L135 157" fill="#344a65"/>
    <path d="M57 202 Q64 195 82 199 L86 208 H55 Q51 208 57 202 M116 199 Q134 195 143 202 Q148 208 144 208 H114Z" fill="#203448"/>
    <path d="M58 119 Q43 123 38 146 L30 166 Q29 171 35 174 Q40 176 43 170 L56 148 M142 119 Q157 123 162 146 L170 166 Q171 171 165 174 Q160 176 157 170 L144 148" fill={skin} stroke="#263d4b" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M61 118 Q74 112 100 112 Q126 112 139 118 L148 157 Q148 166 140 169 Q100 177 60 169 Q52 166 52 157Z" fill={shirt} stroke="#263d4b" strokeWidth="3"/>
    {c.outfit==='hoodie'&&<><path d="M76 116 Q100 143 124 116" fill="none" stroke="#fff" strokeWidth="5" opacity=".65"/><path d="M85 151 Q100 148 115 151 L118 161 H82Z" fill="#fff" opacity=".22"/></>}
    {c.outfit==='suit'&&<><path d="M83 115 L100 143 L117 115" fill="#f7f5eb"/><path d="M98 122 L103 122 L106 143 L100 149 L95 143Z" fill="#df6c6c"/></>}
    {c.outfit==='star'&&<text x="100" y="154" textAnchor="middle" fontSize="35" fill="#fff4bc">★</text>}
    {c.type==='cat'&&<path d="M57 62 L58 22 L83 42 M117 42 L142 22 L143 62" fill={skin} stroke="#263d4b" strokeWidth="3" strokeLinejoin="round"/>}
    {c.type==='alien'&&<><path d="M79 40 Q68 16 60 19 M121 40 Q132 16 140 19" fill="none" stroke="#263d4b" strokeWidth="4"/><circle cx="59" cy="18" r="6" fill={skin} stroke="#263d4b" strokeWidth="3"/><circle cx="141" cy="18" r="6" fill={skin} stroke="#263d4b" strokeWidth="3"/></>}
    {c.type==='robot'&&<><path d="M100 39 V20" stroke="#263d4b" strokeWidth="4"/><circle cx="100" cy="17" r="6" fill="#f2c16f" stroke="#263d4b" strokeWidth="3"/></>}
    <rect x="53" y="39" width="94" height="83" rx={c.type==='robot'?20:39} fill={skin} stroke="#263d4b" strokeWidth="3"/>
    {c.type==='person'&&<path d="M54 74 Q48 37 79 36 Q98 24 119 37 Q146 36 146 72 Q137 56 126 54 Q102 68 65 58Z" fill="#394553"/>}
    {c.type==='robot'&&<path d="M65 89 H135" stroke="#263d4b" strokeWidth="2" opacity=".3"/>}
    <ellipse cx="82" cy="78" rx="5" ry="7" fill="#263d4b"/><ellipse cx="118" cy="78" rx="5" ry="7" fill="#263d4b"/>
    <path d="M91 96 Q100 104 109 96" fill="none" stroke="#263d4b" strokeWidth="3" strokeLinecap="round"/>
    {c.type==='cat'&&<><path d="M54 91 L70 94 M53 99 L69 99 M130 94 L146 91 M131 99 L147 99" stroke="#263d4b" strokeWidth="2"/><path d="M96 88 L104 88 L100 92Z" fill="#ef8e8a"/></>}
    {c.glasses!=='none'&&<g stroke="#263d4b" strokeWidth="4" fill={c.glasses==='sun'?'#263d4b':'#ffffff33'}><circle cx="82" cy="78" r="15"/><circle cx="118" cy="78" r="15"/><path d="M97 78 H103 M54 72 L67 76 M133 76 L146 72" fill="none"/>{c.glasses==='star'&&<><text x="82" y="84" textAnchor="middle" fontSize="17" stroke="none" fill="#f3b858">★</text><text x="118" y="84" textAnchor="middle" fontSize="17" stroke="none" fill="#f3b858">★</text></>}</g>}
    {c.hat==='cap'&&<path d="M59 53 Q59 18 100 20 Q139 20 141 52 L153 58 Q153 64 140 63 L60 59Z" fill="#e99486" stroke="#263d4b" strokeWidth="3"/>}
    {c.hat==='beanie'&&<><path d="M60 50 Q62 13 100 15 Q138 13 140 50Z" fill="#8a91c9" stroke="#263d4b" strokeWidth="3"/><rect x="57" y="45" width="86" height="14" rx="6" fill="#aaa7df" stroke="#263d4b" strokeWidth="3"/><circle cx="100" cy="13" r="8" fill="#aaa7df"/></>}
    {c.hat==='crown'&&<path d="M65 51 L59 19 L80 32 L100 12 L120 32 L141 19 L135 51Z" fill="#f7cd6a" stroke="#263d4b" strokeWidth="3" strokeLinejoin="round"/>}
    {c.hat==='party'&&<><path d="M75 49 L100 2 L125 49Z" fill="#f6b7a4" stroke="#263d4b" strokeWidth="3"/><path d="M85 31 L113 31 M80 41 L120 41" stroke="#fff" strokeWidth="4"/><circle cx="100" cy="3" r="5" fill="#f8d273"/></>}
  </svg>
}
