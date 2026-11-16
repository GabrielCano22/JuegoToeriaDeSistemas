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

// La nota depende exclusivamente de los puntos promedio redondeados del equipo.
export function teamGrade(points) {
  if (!Number.isInteger(points) || points < 0 || points > 6000) return null;
  if (points >= 5500) return 5;
  if (points >= 5000) return 4.8;
  if (points >= 4500) return 4.5;
  if (points >= 4000) return 4;
  if (points >= 3500) return 3.5;
  if (points >= 3000) return 3;
  if (points >= 2500) return 2.8;
  return 2.5;
}
