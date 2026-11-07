import test from 'node:test';
import assert from 'node:assert/strict';
import {rankTeams,teamGrade} from '../scores.js';
import {createResultsCsv} from '../src/results.js';

test('aplica notas por posición y límites de puntos en cada frontera',()=>{
  assert.deepEqual(Array.from({length:8},(_,i)=>teamGrade(i+1,2000)),[5,4.8,4.7,4.6,4.5,4.4,4.2,4]);
  for(const [points,grade] of [[0,3],[1,3.2],[499,3.2],[500,3.5],[999,3.5],[1000,3.7],[1499,3.7],[1500,3.9],[1999,3.9],[2000,5]]) assert.equal(teamGrade(1,points),grade);
  assert.equal(teamGrade(8,1999),3.9);
  assert.equal(teamGrade(null,0),null);
});

test('empates comparten posición y la siguiente posición salta; vacíos no compiten',()=>{
  const result=rankTeams([{team:4,count:0,points:0},{team:3,count:1,points:1000},{team:2,count:2,points:2000},{team:1,count:1,points:2000},{team:5,count:1,points:0}]);
  assert.deepEqual(result.map(t=>[t.team,t.rank]),[[1,1],[2,1],[3,3],[5,4],[4,null]]);
  assert.equal(teamGrade(result[0].rank,result[0].points),teamGrade(result[1].rank,result[1].points));
});

test('CSV agrupa integrantes, incluye equipos vacíos y protege nombres como fórmulas',()=>{
  const teams=rankTeams([{team:1,count:2,points:2000},{team:2,count:0,points:0}]);
  const csv=createResultsCsv({teams,players:[{team:1,name:'Ana; "Gómez"',points:2100},{team:1,name:'=1+1',points:1900}]});
  assert.ok(csv.startsWith('\ufeff"Posición";"Equipo"'));
  assert.ok(csv.includes('"1";"Equipo 1";"2000";"5,0";"Ana; ""Gómez""";"2100"'));
  assert.ok(csv.includes('"\'=1+1";"1900"'));
  assert.ok(csv.includes('"";"Equipo 2";"";"";"Sin participantes";""'));
});
