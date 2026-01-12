import ExcelJS from 'exceljs';
import { sdgReference } from './analysis-constants';
import type { Impact } from '@/api/impacts';

type AnalysisData = {
  summary: {
    totalEntries: number;
    sdgsCovered: number;
    activeDimensions: number;
    averageScore: number;
    positiveImpacts: number;
    negativeImpacts: number;
    neutralImpacts: number;
  };
  scoreDistribution: Array<{ score: number; count: number }>;
  sentimentDistribution: Array<{ name: string; value: number }>;
  impactDistribution: Array<{ name: string; value: number }>;
  dimensionDistribution: Array<{ name: string; value: number }>;
  sdgCounts: Array<{ sdg: number; count: number }>;
  projectTitle?: string;
};

export async function exportAnalysisToExcel(
  analysisData: AnalysisData,
  impacts?: Impact[],
  projectTitle?: string,
) {
  const {
    summary,
    scoreDistribution,
    sentimentDistribution,
    impactDistribution,
    dimensionDistribution,
    sdgCounts,
  } = analysisData;

  // Create workbook
  const workbook = new ExcelJS.Workbook();

  // === Summary Sheet ===
  const summarySheet = workbook.addWorksheet('Summary');
  summarySheet.columns = [
    { header: 'Metric', key: 'metric', width: 30 },
    { header: 'Value', key: 'value', width: 15 },
  ];

  summarySheet.addRow({ metric: 'Total Entries', value: summary.totalEntries });
  summarySheet.addRow({ metric: 'Average Score', value: summary.averageScore.toFixed(2) });
  summarySheet.addRow({ metric: 'Positive Impacts', value: summary.positiveImpacts });
  summarySheet.addRow({ metric: 'Neutral Impacts', value: summary.neutralImpacts });
  summarySheet.addRow({ metric: 'Negative Impacts', value: summary.negativeImpacts });
  summarySheet.addRow({ metric: 'SDGs Covered', value: summary.sdgsCovered });
  summarySheet.addRow({ metric: 'Active Dimensions', value: summary.activeDimensions });

  // Style summary header
  summarySheet.getRow(1).font = { bold: true };
  summarySheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  };

  // === Score Distribution Sheet ===
  const scoreSheet = workbook.addWorksheet('Score Distribution');
  scoreSheet.columns = [
    { header: 'Score', key: 'score', width: 12 },
    { header: 'Count', key: 'count', width: 12 },
    { header: 'Percentage', key: 'percentage', width: 15 },
  ];

  const totalScores = scoreDistribution.reduce((sum, item) => sum + item.count, 0);
  scoreDistribution.forEach((item) => {
    scoreSheet.addRow({
      score: item.score,
      count: item.count,
      percentage: `${((item.count / totalScores) * 100).toFixed(1)}%`,
    });
  });

  scoreSheet.getRow(1).font = { bold: true };
  scoreSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  };

  // === Impact Distribution Sheet ===
  const impactSheet = workbook.addWorksheet('Impact Distribution');
  impactSheet.columns = [
    { header: 'Impact Type', key: 'name', width: 20 },
    { header: 'Count', key: 'value', width: 12 },
    { header: 'Percentage', key: 'percentage', width: 15 },
  ];

  const totalImpacts = impactDistribution.reduce((sum, item) => sum + item.value, 0);
  impactDistribution.forEach((item) => {
    impactSheet.addRow({
      name: item.name,
      value: item.value,
      percentage: `${((item.value / totalImpacts) * 100).toFixed(1)}%`,
    });
  });

  impactSheet.getRow(1).font = { bold: true };
  impactSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  };

  // === Dimension Distribution Sheet ===
  const dimensionSheet = workbook.addWorksheet('Dimension Distribution');
  dimensionSheet.columns = [
    { header: 'Dimension', key: 'name', width: 20 },
    { header: 'Count', key: 'value', width: 12 },
    { header: 'Percentage', key: 'percentage', width: 15 },
  ];

  const totalDimensions = dimensionDistribution.reduce((sum, item) => sum + item.value, 0);
  dimensionDistribution.forEach((item) => {
    dimensionSheet.addRow({
      name: item.name,
      value: item.value,
      percentage: `${((item.value / totalDimensions) * 100).toFixed(1)}%`,
    });
  });

  dimensionSheet.getRow(1).font = { bold: true };
  dimensionSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  };

  // === Sentiment Distribution Sheet ===
  const sentimentSheet = workbook.addWorksheet('Sentiment Distribution');
  sentimentSheet.columns = [
    { header: 'Sentiment', key: 'name', width: 20 },
    { header: 'Count', key: 'value', width: 12 },
    { header: 'Percentage', key: 'percentage', width: 15 },
  ];

  const totalSentiments = sentimentDistribution.reduce((sum, item) => sum + item.value, 0);
  sentimentDistribution.forEach((item) => {
    sentimentSheet.addRow({
      name: item.name,
      value: item.value,
      percentage: `${((item.value / totalSentiments) * 100).toFixed(1)}%`,
    });
  });

  sentimentSheet.getRow(1).font = { bold: true };
  sentimentSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  };

  // === SDG Analysis Sheet ===
  const sdgSheet = workbook.addWorksheet('SDG Analysis');
  sdgSheet.columns = [
    { header: 'SDG #', key: 'sdgNumber', width: 10 },
    { header: 'SDG Name', key: 'sdgName', width: 40 },
    { header: 'Count', key: 'count', width: 12 },
    { header: 'Percentage', key: 'percentage', width: 15 },
  ];

  const totalSdgEntries = sdgCounts.reduce((sum, item) => sum + item.count, 0);

  // Add all SDGs with their counts (0 for uncovered SDGs)
  sdgReference.forEach((sdg) => {
    const countData = sdgCounts.find((item) => item.sdg === sdg.id);
    const count = countData?.count || 0;
    sdgSheet.addRow({
      sdgNumber: sdg.id,
      sdgName: sdg.fullName,
      count: count,
      percentage: totalSdgEntries > 0 ? `${((count / totalSdgEntries) * 100).toFixed(1)}%` : '0%',
    });
  });

  sdgSheet.getRow(1).font = { bold: true };
  sdgSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  };

  // === All Impacts Sheet ===
  if (impacts && impacts.length > 0) {
    const impactsSheet = workbook.addWorksheet('All Impacts');
    impactsSheet.columns = [
      { header: 'Section', key: 'section', width: 12 },
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Description', key: 'description', width: 50 },
      { header: 'Relation', key: 'relation', width: 10 },
      { header: 'Dimension', key: 'dimension', width: 15 },
      { header: 'Score', key: 'score', width: 8 },
      { header: 'SDGs', key: 'sdgs', width: 20 },
      { header: 'Created', key: 'created', width: 12 },
    ];

    impacts.forEach((impact: Impact) => {
      impactsSheet.addRow({
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

    impactsSheet.getRow(1).font = { bold: true };
    impactsSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };
  }

  // Download file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${projectTitle || 'project'}_impacts_analysis.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}
