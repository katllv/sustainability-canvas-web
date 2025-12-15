import ExcelJS from 'exceljs';
import type { Impact } from '@/api/impacts';

export async function exportCanvasToExcel(impacts: Impact[], projectTitle?: string) {
  if (!impacts || impacts.length === 0) {
    alert('No impacts to export');
    return;
  }

  // Create workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Canvas Impacts');

  // Define columns
  worksheet.columns = [
    { header: 'Section', key: 'section', width: 12 },
    { header: 'Title', key: 'title', width: 30 },
    { header: 'Description', key: 'description', width: 50 },
    { header: 'Relation', key: 'relation', width: 10 },
    { header: 'Dimension', key: 'dimension', width: 15 },
    { header: 'Score', key: 'score', width: 8 },
    { header: 'SDGs', key: 'sdgs', width: 20 },
    { header: 'Created', key: 'created', width: 12 },
  ];

  // Add rows
  impacts.forEach((impact: Impact) => {
    worksheet.addRow({
      section: impact.type,
      title: impact.title,
      description: impact.description || '',
      relation: impact.relation,
      dimension: impact.dimension,
      score: impact.score,
      sdgs: impact.impactSdgs?.map((sdg) => sdg.sdgId || sdg.id).join(', ') || '',
      created: impact.createdAt ? new Date(impact.createdAt).toLocaleDateString() : '',
    });
  });

  // Style header row
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  };

  // Download file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${projectTitle || 'canvas'}_impacts.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}
