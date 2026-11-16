import React from 'react';

export const characterOptions = {
  type: [{id:'person',label:'Persona'},{id:'robot',label:'Robot'},{id:'cat',label:'Gatito'},{id:'alien',label:'Alien'},{id:'rabbit',label:'Conejo'},{id:'dog',label:'Perrito'}],
  skin: [{id:'peach',label:'Durazno',color:'#f2b993'},{id:'brown',label:'Canela',color:'#b87856'},{id:'dark',label:'Chocolate',color:'#754938'},{id:'mint',label:'Menta',color:'#9ee4c8'},{id:'blue',label:'Cielo',color:'#a6c7eb'},{id:'lilac',label:'Lila',color:'#cbb8e9'},{id:'rose',label:'Rosa',color:'#f1b6c9'},{id:'amber',label:'Miel',color:'#e5c187'}],
  outfit: [{id:'shirt',label:'Camiseta'},{id:'hoodie',label:'Buzo'},{id:'suit',label:'Elegante'},{id:'star',label:'Estrella'},{id:'stripes',label:'Rayas'},{id:'lightning',label:'Rayo'}],
  hat: [{id:'none',label:'Sin sombrero'},{id:'cap',label:'Gorra'},{id:'beanie',label:'Gorro'},{id:'crown',label:'Corona'},{id:'party',label:'Fiesta'},{id:'wizard',label:'Mago'},{id:'flower',label:'Flor'}],
  glasses: [{id:'none',label:'Sin lentes'},{id:'round',label:'Redondos'},{id:'sun',label:'De sol'},{id:'star',label:'Estrella'},{id:'square',label:'Cuadrados'}],
  outfitColor: [{id:'teal',label:'Turquesa',color:'#35a997'},{id:'coral',label:'Coral',color:'#ec8e83'},{id:'gold',label:'Dorado',color:'#e4b65c'},{id:'purple',label:'Violeta',color:'#a88fd1'},{id:'navy',label:'Azul',color:'#607fb0'},{id:'pink',label:'Rosa',color:'#db93b4'},{id:'green',label:'Verde',color:'#80b36b'},{id:'red',label:'Rojo',color:'#d86c68'}],
  hair: [{id:'classic',label:'Clásico'},{id:'short',label:'Corto'},{id:'long',label:'Largo'},{id:'spiky',label:'Puntas'},{id:'curly',label:'Rizado'},{id:'bald',label:'Sin cabello'}],
  hairColor: [{id:'dark',label:'Oscuro',color:'#394553'},{id:'chestnut',label:'Castaño',color:'#7b4e3a'},{id:'blond',label:'Rubio',color:'#e3bf70'},{id:'red',label:'Cobrizo',color:'#c76a4f'},{id:'silver',label:'Plateado',color:'#cbd3d7'}],
  expression: [{id:'smile',label:'Sonrisa'},{id:'happy',label:'Alegre'},{id:'surprised',label:'Sorpresa'},{id:'wink',label:'Guiño'}]
};
export const defaultCharacter = {type:'person',skin:'peach',outfit:'shirt',hat:'none',glasses:'none',outfitColor:'teal',hair:'classic',hairColor:'dark',expression:'smile'};
// Miniaturas vectoriales propias: no dependen de los emojis del dispositivo.
for (const category of ['type','outfit','hat','glasses','hair','expression']) {
  for (const option of characterOptions[category]) {
    option.icon=option.id==='none'
      ? <svg className="choice-svg" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="17" fill="none" stroke="currentColor" strokeWidth="3"/><path d="M15 15l18 18" fill="none" stroke="currentColor" strokeWidth="3"/></svg>
      : <span className="choice-character" aria-hidden="true"><Character value={{...defaultCharacter,[category]:option.id}}/></span>;
  }
}
export function parseCharacter(value) { try {const parsed=typeof value==='string'?JSON.parse(value):value; return Object.fromEntries(Object.entries(characterOptions).map(([key,options])=>[key,options.some(o=>o.id===parsed?.[key])?parsed[key]:defaultCharacter[key]]));} catch {return defaultCharacter} }
export function Character({value, className=''}) {
  const c=parseCharacter(value), skin=characterOptions.skin.find(x=>x.id===c.skin).color, shirt=characterOptions.outfitColor.find(x=>x.id===c.outfitColor).color, hair=characterOptions.hairColor.find(x=>x.id===c.hairColor).color;
  return <svg className={'character '+className} viewBox="0 0 200 220" role="img" aria-label={`Personaje ${characterOptions.type.find(x=>x.id===c.type).label}`}>
    <ellipse cx="100" cy="209" rx="55" ry="7" fill="#102432" opacity=".17"/>
    <path d="M65 157 L60 196 Q59 204 68 204 H85 L91 163 M109 163 L115 204 H132 Q141 204 140 196 L135 157" fill="#344a65"/>
    <path d="M57 202 Q64 195 82 199 L86 208 H55 Q51 208 57 202 M116 199 Q134 195 143 202 Q148 208 144 208 H114Z" fill="#203448"/>
    <path d="M58 119 Q43 123 38 146 L30 166 Q29 171 35 174 Q40 176 43 170 L56 148 M142 119 Q157 123 162 146 L170 166 Q171 171 165 174 Q160 176 157 170 L144 148" fill={skin} stroke="#263d4b" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M61 118 Q74 112 100 112 Q126 112 139 118 L148 157 Q148 166 140 169 Q100 177 60 169 Q52 166 52 157Z" fill={shirt} stroke="#263d4b" strokeWidth="3"/>
    {c.outfit==='hoodie'&&<><path d="M76 116 Q100 143 124 116" fill="none" stroke="#fff" strokeWidth="5" opacity=".65"/><path d="M85 151 Q100 148 115 151 L118 161 H82Z" fill="#fff" opacity=".22"/></>}
    {c.outfit==='suit'&&<><path d="M83 115 L100 143 L117 115" fill="#f7f5eb"/><path d="M98 122 L103 122 L106 143 L100 149 L95 143Z" fill="#df6c6c"/></>}
    {c.outfit==='star'&&<text x="100" y="154" textAnchor="middle" fontSize="35" fill="#fff4bc">★</text>}
    {c.outfit==='stripes'&&<><path d="M62 137 Q100 145 138 137 M59 151 Q100 159 141 151" fill="none" stroke="#fff" strokeWidth="5" opacity=".7"/></>}
    {c.outfit==='lightning'&&<path d="M105 124 L91 146 H100 L96 161 L112 139 H103Z" fill="#fff4bc" stroke="#263d4b" strokeWidth="1" strokeLinejoin="round"/>}
    {c.type==='cat'&&<path d="M57 62 L58 22 L83 42 M117 42 L142 22 L143 62" fill={skin} stroke="#263d4b" strokeWidth="3" strokeLinejoin="round"/>}
    {c.type==='rabbit'&&<><path d="M66 53 Q48 -4 67 6 Q82 13 86 44 M114 44 Q118 13 133 6 Q152 -4 134 53" fill={skin} stroke="#263d4b" strokeWidth="3"/><path d="M69 36 Q61 15 67 15 M131 36 Q139 15 133 15" fill="none" stroke="#e892a5" strokeWidth="4" strokeLinecap="round"/></>}
    {c.type==='dog'&&<path d="M57 52 Q35 45 35 76 Q37 95 53 92 M143 52 Q165 45 165 76 Q163 95 147 92" fill={skin} stroke="#263d4b" strokeWidth="3"/>}
    {c.type==='alien'&&<><path d="M79 40 Q68 16 60 19 M121 40 Q132 16 140 19" fill="none" stroke="#263d4b" strokeWidth="4"/><circle cx="59" cy="18" r="6" fill={skin} stroke="#263d4b" strokeWidth="3"/><circle cx="141" cy="18" r="6" fill={skin} stroke="#263d4b" strokeWidth="3"/></>}
    {c.type==='robot'&&<><path d="M100 39 V20" stroke="#263d4b" strokeWidth="4"/><circle cx="100" cy="17" r="6" fill="#f2c16f" stroke="#263d4b" strokeWidth="3"/></>}
    {c.hair==='long'&&<path d="M50 78 Q44 32 71 30 Q100 17 129 30 Q156 32 150 78 L154 127 Q143 136 131 123 L69 123 Q57 136 46 127Z" fill={hair} stroke="#263d4b" strokeWidth="3"/>}
    <rect x="53" y="39" width="94" height="83" rx={c.type==='robot'?20:39} fill={skin} stroke="#263d4b" strokeWidth="3"/>
    {((c.hair==='classic'&&c.type==='person')||c.hair==='long')&&<path d="M54 74 Q48 37 79 36 Q98 24 119 37 Q146 36 146 72 Q137 56 126 54 Q102 68 65 58Z" fill={hair}/>}
    {c.hair==='short'&&<path d="M54 64 Q51 33 79 34 Q102 25 125 36 Q146 39 146 64 Q137 55 128 55 Q111 62 95 54 Q76 62 61 55Z" fill={hair}/>}
    {c.hair==='spiky'&&<path d="M53 65 L57 38 L68 44 L75 25 L88 36 L101 21 L112 35 L127 25 L132 42 L143 37 L147 65 Q128 54 111 58 Q84 53 61 60Z" fill={hair} stroke="#263d4b" strokeWidth="2" strokeLinejoin="round"/>}
    {c.hair==='curly'&&<g fill={hair}><circle cx="64" cy="48" r="14"/><circle cx="78" cy="38" r="14"/><circle cx="94" cy="35" r="14"/><circle cx="110" cy="35" r="14"/><circle cx="126" cy="39" r="14"/><circle cx="138" cy="49" r="14"/></g>}
    {c.type==='robot'&&<path d="M65 89 H135" stroke="#263d4b" strokeWidth="2" opacity=".3"/>}
    {c.expression==='wink'?<path d="M76 78 Q82 73 88 78" fill="none" stroke="#263d4b" strokeWidth="3" strokeLinecap="round"/>:<ellipse cx="82" cy="78" rx="5" ry="7" fill="#263d4b"/>}<ellipse cx="118" cy="78" rx="5" ry="7" fill="#263d4b"/>
    {c.expression==='surprised'?<ellipse cx="100" cy="99" rx="5" ry="7" fill="#263d4b"/>:c.expression==='happy'?<path d="M88 96 Q100 113 112 96Z" fill="#263d4b"/>:<path d="M91 96 Q100 104 109 96" fill="none" stroke="#263d4b" strokeWidth="3" strokeLinecap="round"/>}
    {c.type==='cat'&&<><path d="M54 91 L70 94 M53 99 L69 99 M130 94 L146 91 M131 99 L147 99" stroke="#263d4b" strokeWidth="2"/><path d="M96 88 L104 88 L100 92Z" fill="#ef8e8a"/></>}
    {(c.type==='dog'||c.type==='rabbit')&&<ellipse cx="100" cy="89" rx="5" ry="3" fill="#263d4b"/>}
    {c.glasses!=='none'&&<g stroke="#263d4b" strokeWidth="4" fill={c.glasses==='sun'?'#263d4b':'#ffffff33'}>{c.glasses==='square'?<><rect x="67" y="65" width="30" height="26" rx="5"/><rect x="103" y="65" width="30" height="26" rx="5"/></>:<><circle cx="82" cy="78" r="15"/><circle cx="118" cy="78" r="15"/></>}<path d="M97 78 H103 M54 72 L67 76 M133 76 L146 72" fill="none"/>{c.glasses==='star'&&<><text x="82" y="84" textAnchor="middle" fontSize="17" stroke="none" fill="#f3b858">★</text><text x="118" y="84" textAnchor="middle" fontSize="17" stroke="none" fill="#f3b858">★</text></>}</g>}
    {c.hat==='cap'&&<path d="M59 53 Q59 18 100 20 Q139 20 141 52 L153 58 Q153 64 140 63 L60 59Z" fill="#e99486" stroke="#263d4b" strokeWidth="3"/>}
    {c.hat==='beanie'&&<><path d="M60 50 Q62 13 100 15 Q138 13 140 50Z" fill="#8a91c9" stroke="#263d4b" strokeWidth="3"/><rect x="57" y="45" width="86" height="14" rx="6" fill="#aaa7df" stroke="#263d4b" strokeWidth="3"/><circle cx="100" cy="13" r="8" fill="#aaa7df"/></>}
    {c.hat==='crown'&&<path d="M65 51 L59 19 L80 32 L100 12 L120 32 L141 19 L135 51Z" fill="#f7cd6a" stroke="#263d4b" strokeWidth="3" strokeLinejoin="round"/>}
    {c.hat==='party'&&<><path d="M75 49 L100 2 L125 49Z" fill="#f6b7a4" stroke="#263d4b" strokeWidth="3"/><path d="M85 31 L113 31 M80 41 L120 41" stroke="#fff" strokeWidth="4"/><circle cx="100" cy="3" r="5" fill="#f8d273"/></>}
    {c.hat==='wizard'&&<><path d="M65 48 L101 2 L132 48Z" fill="#8875be" stroke="#263d4b" strokeWidth="3" strokeLinejoin="round"/><ellipse cx="100" cy="49" rx="47" ry="7" fill="#8875be" stroke="#263d4b" strokeWidth="3"/><path d="M103 17 l2 5 5 1 -4 3 1 5 -4 -3 -4 3 1 -5 -4 -3 5 -1Z" fill="#f8d273"/></>}
    {c.hat==='flower'&&<g transform="translate(132 42)"><circle cx="0" cy="-9" r="7" fill="#f6b7c5"/><circle cx="8" cy="-3" r="7" fill="#f6b7c5"/><circle cx="5" cy="7" r="7" fill="#f6b7c5"/><circle cx="-5" cy="7" r="7" fill="#f6b7c5"/><circle cx="-8" cy="-3" r="7" fill="#f6b7c5"/><circle cx="0" cy="0" r="5" fill="#f8d273" stroke="#263d4b" strokeWidth="1.5"/></g>}
  </svg>
}
