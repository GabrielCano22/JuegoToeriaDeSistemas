import {teamGrade, teamName, rankForGrades, PROFESSOR_TEAM} from '../scores.js';

// Modelo compartido por ambos informes. Un equipo vacío no recibe nota ni puntos.
export function resultsData(game) {
  const gradeRanks=rankForGrades(game.teams);
  return game.teams.map(team=>({
    position:team.rank ?? null,
    team:teamName(team.team),
    points:team.count ? team.points : null,
    gradePosition:team.count && team.team!==PROFESSOR_TEAM ? gradeRanks.get(team.team) : null,
    grade:team.count && team.team!==PROFESSOR_TEAM ? teamGrade(gradeRanks.get(team.team),team.points) : null,
    members:game.players.filter(player=>player.team===team.team).map(player=>({name:player.name,points:player.points}))
  }));
}

function styleSheet(sheet, columns, title, subtitle) {
  sheet.columns=columns.map(([header,width])=>({header,width}));
  sheet.insertRow(1,[]);
  sheet.insertRow(2,[]);
  sheet.insertRow(3,[]);
  const end=String.fromCharCode(64+columns.length);
  sheet.mergeCells(`A1:${end}1`); sheet.getCell('A1').value=title;
  sheet.mergeCells(`A2:${end}2`); sheet.getCell('A2').value=subtitle;
  sheet.getRow(1).height=32; sheet.getCell('A1').font={name:'Arial',size:17,bold:true,color:{argb:'FFFFFFFF'}};
  sheet.getCell('A1').alignment={vertical:'middle',indent:1};
  for(let i=1;i<=columns.length;i++) sheet.getRow(1).getCell(i).fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF173344'}};
  sheet.getRow(2).height=26; sheet.getCell('A2').font={name:'Arial',size:10,color:{argb:'FF315B5B'}};
  sheet.getCell('A2').alignment={vertical:'middle',indent:1};
  for(let i=1;i<=columns.length;i++) sheet.getRow(2).getCell(i).fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFDDF5E9'}};
  const header=sheet.getRow(4); header.height=28;
  header.eachCell(cell=>{cell.font={name:'Arial',bold:true,color:{argb:'FFFFFFFF'},size:10};cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF28536A'}};cell.alignment={vertical:'middle',wrapText:true};});
  sheet.views=[{state:'frozen',ySplit:4}];
  sheet.autoFilter={from:{row:4,column:1},to:{row:4,column:columns.length}};
}
function styleRows(sheet,gradeColumn) {
  sheet.eachRow((row,index)=>{
    if(index<5)return;
    row.height=23;
    row.eachCell({includeEmpty:true},(cell,column)=>{
      cell.font={name:'Arial',size:10,color:{argb:'FF173344'},bold:column===gradeColumn};
      cell.alignment={vertical:'middle',wrapText:true};
      cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:index%2?'FFF3F9F7':'FFFFFFFF'}};
      cell.border={bottom:{style:'hair',color:{argb:'FFD7E6E3'}}};
      if(column===gradeColumn && typeof cell.value==='number') cell.numFmt='0.0';
    });
  });
}

export async function createResultsWorkbook(game) {
  const module=await import('exceljs');
  const ExcelJS=module.default || module;
  const workbook=new ExcelJS.Workbook();
  workbook.creator='Misión Decisiones';
  workbook.created=new Date();
  const data=resultsData(game);
  const summary=workbook.addWorksheet('Resumen');
  styleSheet(summary,[['Puesto general',17],['Equipo',20],['Puntos promedio',22],['Puesto para nota',20],['Nota del equipo',20],['Integrantes',15]],'MISIÓN DECISIONES · RESULTADOS','El puesto para nota excluye al profesor; el puesto general incluye a todos.');
  for(const team of data) summary.addRow([team.position,team.team,team.points,team.gradePosition,team.grade,team.members.length]);
  styleRows(summary,5);
  const detail=workbook.addWorksheet('Integrantes');
  styleSheet(detail,[['Puesto general',17],['Equipo',20],['Puntos promedio',22],['Puesto para nota',20],['Nota del equipo',20],['Integrante',30],['Puntos individuales',22]],'MISIÓN DECISIONES · INTEGRANTES','El profesor participa sin nota; su puesto no modifica la nota de los equipos.');
  for(const team of data) {
    const common=[team.position,team.team,team.points,team.gradePosition,team.grade];
    if(!team.members.length) detail.addRow([...common,'Sin participantes',null]);
    else for(const member of team.members) detail.addRow([...common,member.name,member.points]);
  }
  styleRows(detail,5);
  return workbook;
}

export async function createResultsPdf(game) {
  const [{jsPDF},{autoTable}]=await Promise.all([import('jspdf'),import('jspdf-autotable')]);
  const doc=new jsPDF({unit:'mm',format:'a4'}), data=resultsData(game);
  const format=value=>value===null ? '-' : String(value);
  const grade=value=>value===null ? '-' : value.toFixed(1).replace('.',',');
  doc.setFillColor(23,51,68);doc.rect(0,0,210,35,'F');
  doc.setFont('helvetica','bold');doc.setTextColor(255,255,255);doc.setFontSize(19);doc.text('MISIÓN DECISIONES',14,15);
  doc.setFont('helvetica','normal');doc.setFontSize(10);doc.setTextColor(190,242,218);doc.text('Informe de resultados y notas por equipo',14,23);
  doc.setTextColor(38,61,70);doc.setFontSize(9);doc.text('Puesto general: incluye al profesor. Puesto para nota: solo equipos.',14,43);
  doc.text('Los equipos empatados comparten posición y nota.',14,48);
  const options={theme:'grid',margin:{left:14,right:14},styles:{font:'helvetica',fontSize:9,cellPadding:2.5,textColor:[28,52,60],lineColor:[213,229,224],lineWidth:.15,overflow:'linebreak'},headStyles:{fillColor:[40,83,106],textColor:255,fontStyle:'bold'},alternateRowStyles:{fillColor:[242,249,246]},rowPageBreak:'avoid'};
  autoTable(doc,{...options,startY:52,head:[['Puesto general','Equipo','Puntos promedio','Puesto para nota','Nota','Integrantes']],body:data.map(t=>[format(t.position),t.team,format(t.points),format(t.gradePosition),grade(t.grade),String(t.members.length)])});
  let y=doc.lastAutoTable.finalY+12;
  if(y>250){doc.addPage();y=20}
  doc.setFont('helvetica','bold');doc.setFontSize(14);doc.setTextColor(23,51,68);doc.text('Detalle de integrantes',14,y);
  const details=data.flatMap(t=>t.members.length ? t.members.map(m=>[format(t.position),t.team,format(t.points),format(t.gradePosition),grade(t.grade),m.name,format(m.points)]) : [[format(t.position),t.team,format(t.points),format(t.gradePosition),grade(t.grade),'Sin participantes','-']]);
  autoTable(doc,{...options,startY:y+5,head:[['Puesto','Equipo','Promedio','Puesto nota','Nota','Integrante','Puntos']],body:details,columnStyles:{0:{cellWidth:15},1:{cellWidth:24},2:{cellWidth:22},3:{cellWidth:22},4:{cellWidth:14},5:{cellWidth:64},6:{cellWidth:21}}});
  const total=doc.getNumberOfPages();
  for(let page=1;page<=total;page++){doc.setPage(page);doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(110,130,135);doc.text(`Misión Decisiones · Página ${page} de ${total}`,14,288);}
  return doc;
}

export async function downloadExcel(game) {
  const workbook=await createResultsWorkbook(game);
  const buffer=await workbook.xlsx.writeBuffer();
  const url=URL.createObjectURL(new Blob([buffer],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
  const link=document.createElement('a');link.href=url;link.download='resultados-mision-decisiones.xlsx';link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export async function downloadPdf(game) {
  const doc=await createResultsPdf(game);
  doc.save('resultados-mision-decisiones.pdf');
}
