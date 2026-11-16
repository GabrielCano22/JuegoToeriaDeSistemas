import test from 'node:test';
import assert from 'node:assert/strict';
import {rankTeams,teamGrade} from '../scores.js';
import {questions} from '../questions.js';
import {resultsData,createResultsWorkbook,createResultsPdf} from '../src/results.js';

test('aplica la escala de puntos en cada frontera',()=>{
  for(const [points,grade] of [[0,2.5],[2499,2.5],[2500,2.8],[2999,2.8],[3000,3],[3499,3],[3500,3.5],[3999,3.5],[4000,4],[4499,4],[4500,4.5],[4999,4.5],[5000,4.8],[5499,4.8],[5500,5],[6000,5]]) assert.equal(teamGrade(points),grade,`${points} puntos`);
  for(const invalid of [null,-1,6001,2.5,NaN]) assert.equal(teamGrade(invalid),null);
});

test('empates comparten posición y la siguiente posición salta; vacíos no compiten',()=>{
  const result=rankTeams([{team:4,count:0,points:0},{team:3,count:1,points:1000},{team:2,count:2,points:2000},{team:1,count:1,points:2000},{team:5,count:1,points:0}]);
  assert.deepEqual(result.map(t=>[t.team,t.rank]),[[1,1],[2,1],[3,3],[5,4],[4,null]]);
  assert.equal(teamGrade(result[0].points),teamGrade(result[1].points));
});

test('profesor compite en el podio pero no tiene nota ni afecta las notas de los equipos',()=>{
  const teams=rankTeams([{team:1,count:1,points:4000},{team:2,count:1,points:3000},{team:3,count:1,points:3000},{team:9,count:1,points:5000}]);
  assert.deepEqual(teams.map(t=>[t.team,t.rank]),[[9,1],[1,2],[2,3],[3,3]]);
  const data=resultsData({teams,players:teams.map(t=>({team:t.team,name:`P${t.team}`,points:t.points}))});
  assert.equal(data[0].team,'Profesor');
  assert.equal(data[0].grade,null);
  assert.equal(data[1].grade,4);
  assert.equal(data[2].grade,3);
  assert.equal(data[3].grade,3);
  const withoutTeacher=resultsData({teams:rankTeams(teams.filter(t=>t.team!==9)),players:[]});
  assert.deepEqual(data.slice(1).map(t=>t.grade),withoutTeacher.map(t=>t.grade));
});

test('sin profesor se mantienen las notas y hay una respuesta válida por pregunta',()=>{
  const teams=rankTeams([{team:1,count:1,points:4000},{team:2,count:1,points:3000}]);
  assert.deepEqual(resultsData({teams,players:[]}).map(t=>t.grade),[4,3]);
  assert.equal(questions.length,6);
  for(const q of questions){assert.equal(q.options.length,3);assert.ok(q.correct>=0&&q.correct<q.options.length);assert.equal(new Set(q.options).size,3);}
  assert.ok(new Set(questions.map(q=>q.correct)).size===3);
});

test('la posición no cambia la nota y un equipo activo con cero recibe 2,5',()=>{
  const teams=rankTeams([{team:1,count:1,points:3499},{team:2,count:1,points:3000},{team:3,count:1,points:0},{team:4,count:0,points:0}]);
  const data=resultsData({teams,players:[]});
  assert.deepEqual(data.map(t=>t.grade),[3,3,2.5,null]);
  assert.deepEqual(data.map(t=>t.position),[1,2,3,null]);
});

test('informes usan el mismo modelo para integrantes y equipos vacíos',()=>{
  const teams=rankTeams([{team:1,count:2,points:2000},{team:2,count:0,points:0}]);
  const data=resultsData({teams,players:[{team:1,name:'Ana; "Gómez"',points:2100},{team:1,name:'=1+1',points:1900}]});
  assert.equal(data[0].grade,2.5);
  assert.equal(data[0].members[1].name,'=1+1');
  assert.equal(data[1].position,null);
  assert.equal(data[1].grade,null);
  assert.equal(data[1].points,null);
});

test('Excel conserva estilos, tipos, notas y nombres como texto sin fórmulas',async()=>{
  const teams=rankTeams([{team:1,count:2,points:2000},{team:2,count:0,points:0}]);
  const game={teams,players:[{team:1,name:'Ana Gómez',points:2100},{team:1,name:'=1+1',points:1900}]};
  const workbook=await createResultsWorkbook(game);
  const bytes=await workbook.xlsx.writeBuffer();
  const ExcelJS=(await import('exceljs')).default;
  const reopened=await new ExcelJS.Workbook().xlsx.load(bytes);
  const summary=reopened.getWorksheet('Resumen'), detail=reopened.getWorksheet('Integrantes');
  assert.equal(summary.getCell('D5').value,2.5);
  assert.equal(summary.getCell('D5').numFmt,'0.0');
  assert.equal(summary.getCell('D6').value,null);
  assert.equal(detail.getCell('E6').value,'=1+1');
  assert.equal(detail.getCell('E6').type,3); // texto, no fórmula
  assert.ok(summary.autoFilter);
  assert.equal(summary.getCell('A4').fill.fgColor.argb,'FF28536A');
});

test('Excel y PDF muestran al profesor con puntos y sin nota',async()=>{
  const teams=rankTeams([{team:1,count:1,points:3000},{team:9,count:1,points:4000}]);
  const game={teams,players:[{team:1,name:'Ana',points:3000},{team:9,name:'Docente',points:4000}]};
  const book=await createResultsWorkbook(game);
  assert.equal(book.getWorksheet('Resumen').getCell('B5').value,'Profesor');
  assert.equal(book.getWorksheet('Resumen').getCell('C5').value,4000);
  assert.equal(book.getWorksheet('Resumen').getCell('D5').value,null);
  assert.equal(book.getWorksheet('Resumen').getCell('E5').value,1);
  assert.equal(book.getWorksheet('Resumen').getCell('D6').value,3);
  const pdf=(await createResultsPdf(game)).output();
  assert.ok(pdf.includes('Profesor'));
  assert.ok(pdf.includes('Docente'));
});

test('PDF se genera con varias páginas y conserva detalle de los equipos',async()=>{
  const teams=rankTeams([{team:1,count:50,points:2000},{team:2,count:0,points:0}]);
  const players=Array.from({length:50},(_,i)=>({team:1,name:`Persona ${i+1}`,points:2000}));
  const pdf=await createResultsPdf({teams,players});
  assert.ok(pdf.getNumberOfPages()>1);
  const contents=pdf.output();
  assert.ok(contents.startsWith('%PDF-'));
  assert.ok(contents.includes('Persona 50'));
  assert.ok(contents.includes('Sin participantes'));
});
