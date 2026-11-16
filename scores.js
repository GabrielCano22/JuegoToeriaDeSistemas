const positionGrades = [5.0, 4.8, 4.7, 4.6, 4.5, 4.4, 4.2, 4.0];
export const PROFESSOR_TEAM = 9;
export const teamName = team => Number(team) === PROFESSOR_TEAM ? 'Profesor' : `Equipo ${team}`;

// Los empates usan el promedio ya redondeado que se muestra en la aplicación.
export function rankTeams(teams) {
  const sorted = [...teams].sort((a,b)=>Number(b.count>0)-Number(a.count>0) || b.points-a.points || a.team-b.team);
  let previousPoints, previousRank;
  return sorted.map((team,index)=>{
    if (!team.count) return {...team,rank:null};
    const rank = index > 0 && team.points === previousPoints ? previousRank : index+1;
    previousPoints=team.points; previousRank=rank;
    return {...team,rank};
  });
}

// La clasificación para notas excluye al profesor, sin afectar su puesto en el podio.
export function rankForGrades(teams) {
  return new Map(rankTeams(teams.filter(team=>team.team!==PROFESSOR_TEAM)).map(team=>[team.team,team.rank]));
}

export function teamGrade(rank, points) {
  if (!Number.isInteger(rank) || rank < 1 || rank > positionGrades.length || !Number.isFinite(points) || points < 0) return null;
  const maximum = points >= 2000 ? 5 : points >= 1500 ? 3.9 : points >= 1000 ? 3.7 : points >= 500 ? 3.5 : points > 0 ? 3.2 : 3.0;
  return Math.min(positionGrades[rank-1],maximum);
}
