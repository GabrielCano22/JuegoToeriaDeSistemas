// Compartido por el editor y el servidor para mantener el mismo contrato.
export const avatarValues = {
  type:['person','robot','cat','alien','rabbit','dog'],
  skin:['peach','brown','dark','mint','blue','lilac','rose','amber'],
  outfit:['shirt','hoodie','suit','star','stripes','lightning'],
  hat:['none','cap','beanie','crown','party','wizard','flower'],
  glasses:['none','round','sun','star','square'],
  outfitColor:['teal','coral','gold','purple','navy','pink','green','red'],
  hair:['classic','short','long','spiky','curly','bald'],
  hairColor:['dark','chestnut','blond','red','silver'],
  expression:['smile','happy','surprised','wink']
};
const optionalFields=new Set(['hair','hairColor','expression']);
export function validAvatar(character) {
  return !!character && typeof character==='object' && !Array.isArray(character)
    && Object.keys(character).every(key=>Object.hasOwn(avatarValues,key))
    && Object.entries(avatarValues).every(([key,values])=>optionalFields.has(key) && character[key]===undefined || values.includes(character[key]));
}
