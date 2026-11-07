import {teamGrade} from '../scores.js';

// El separador de punto y coma y la coma decimal funcionan con Excel en español.
function csvCell(value) {
  let text=String(value ?? '');
  // Evita que un nombre introducido por un participante se ejecute como fórmula.
  if (/^[\s\u0000-\u001f]*[=+\-@]/.test(text)) text="'"+text;
  return '"'+text.replaceAll('"','""')+'"';
}
export function createResultsCsv(game) {
  const rows=[['Posición','Equipo','Puntos promedio del equipo','Nota del equipo','Integrante','Puntos individuales']];
  for (const team of game.teams) {
    const members=game.players.filter(player=>player.team===team.team);
    const grade=team.count ? teamGrade(team.rank,team.points) : null;
    const common=[team.rank ?? '',`Equipo ${team.team}`,team.count ? team.points : '',grade===null ? '' : grade.toFixed(1).replace('.',',')];
    if (!members.length) rows.push([...common,'Sin participantes','']);
    else for (const member of members) rows.push([...common,member.name,member.points]);
  }
  return '\ufeff'+rows.map(row=>row.map(csvCell).join(';')).join('\r\n');
}
