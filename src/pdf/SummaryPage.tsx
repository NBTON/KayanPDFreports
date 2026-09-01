import React from 'react';
import { Page, View, Text, Image } from '@react-pdf/renderer';
import { ProjectFormData, ProjectCalculations, CalculatedScopeItem } from '../types';
import { pdfStyles } from './styles';
import { formatDateDDMMMYY, formatCurrency, formatPercent, formatNumberWithCommas } from '../utils/calculations';
import { KAYAN_LOGO_BASE64 } from '../assets/logoBase64';
import { PdfDonutChart } from './PdfCharts';

interface SummaryPageProps {
  data: ProjectFormData;
  calculations: ProjectCalculations;
}

export const SummaryPage: React.FC<SummaryPageProps> = ({ data, calculations }) => {
  const formattedReportDate = formatDateDDMMMYY(data.reportDate);
  const formattedProjectAmount = formatCurrency(data.projectAmount, data.currency);
  const formattedTotalCalculatedWeightage = formatPercent(calculations.totalCalculatedWeightage, 2);
  const formattedOverallProgress = formatPercent(calculations.overallProgress, 2);
  const formattedTotalProgressValue = formatCurrency(calculations.totalProgressValue, data.currency);
  const progressPercentageNumber = Math.min(Math.max(calculations.overallProgress * 100, 0), 100);

  return (
    <Page size="LETTER" style={pdfStyles.multiPage} wrap>
      {/* Fixed Repeating Header on All Summary/Table Pages */}
      <View style={pdfStyles.headerContainerFixed} fixed>
        <View style={pdfStyles.headerLeft}>
          <View style={pdfStyles.headerLogoWrapper}>
            <Image src={KAYAN_LOGO_BASE64} style={pdfStyles.headerLogo} />
          </View>
        </View>
        <View style={pdfStyles.headerTitleWrapper}>
          <Text style={pdfStyles.headerTitle}>Progress Report</Text>
          <Text style={pdfStyles.headerSub}>Project Scope & Progress Valuation</Text>
        </View>
        <View style={pdfStyles.headerRightBadge}>
          <Text style={pdfStyles.headerDateText}>{formattedReportDate}</Text>
        </View>
      </View>

      {/* Analytics Section - Vector Donut Chart & Legend */}
      <View style={pdfStyles.analyticsContainer} wrap={false}>
        <Text style={pdfStyles.analyticsHeader}>Scope Analytics & Distribution</Text>
        <PdfDonutChart
          slices={calculations.analytics.donutSlices}
          totalScopeAmount={calculations.totalScopeAmount}
          currency={data.currency}
        />
      </View>

      {/* Scope Section Header */}
      <View style={pdfStyles.sectionHeader} wrap={false}>
        <Text style={pdfStyles.sectionTitle}>Project Scope Breakdown</Text>
        <Text style={pdfStyles.sectionMeta}>
          Project: {data.projectName || '—'} ({data.currency}) &bull; {calculations.calculatedScopes.length} Activities
        </Text>
      </View>

      {/* Scope Table */}
      <View style={pdfStyles.tableContainer}>
        {/* Table Header Row (Repeats across pages if table breaks) */}
        <View style={pdfStyles.tableHeaderRow} fixed>
          <Text style={[pdfStyles.tableHeaderCell, pdfStyles.colDesc]}>Description</Text>
          <Text style={[pdfStyles.tableHeaderCellRight, pdfStyles.colPrice]}>Total Price</Text>
          <Text style={[pdfStyles.tableHeaderCellRight, pdfStyles.colWeight]}>Weightage</Text>
          <Text style={[pdfStyles.tableHeaderCellRight, pdfStyles.colPhysical]}>Physical %</Text>
          <Text style={[pdfStyles.tableHeaderCellRight, pdfStyles.colNet]}>Net %</Text>
          <Text style={[pdfStyles.tableHeaderCellRight, pdfStyles.colValue]}>Progress Value</Text>
        </View>

        {/* Table Rows (wrap={false} ensures rows never cut in half) */}
        {calculations.calculatedScopes.map((scope: CalculatedScopeItem, index: number) => {
          const rowStyle = index % 2 === 1 ? pdfStyles.tableRowEven : pdfStyles.tableRow;
          return (
            <View key={scope.id || index} style={rowStyle} wrap={false}>
              <Text style={pdfStyles.colDesc}>{scope.description || `Activity ${index + 1}`}</Text>
              <Text style={pdfStyles.colPrice}>{formatNumberWithCommas(scope.scopeAmount)}</Text>
              <Text style={pdfStyles.colWeight}>{formatPercent(scope.activityWeightage, 2)}</Text>
              <Text style={pdfStyles.colPhysical}>{formatPercent(scope.physicalCompletion / 100, 1)}</Text>
              <Text style={pdfStyles.colNet}>{formatPercent(scope.netProgress, 2)}</Text>
              <Text style={pdfStyles.colValue}>{formatNumberWithCommas(scope.progressValue)}</Text>
            </View>
          );
        })}

        {/* Total Summary Row */}
        <View style={pdfStyles.tableTotalRow} wrap={false}>
          <Text style={pdfStyles.tableTotalCellDesc}>Total Progress</Text>
          <Text style={pdfStyles.tableTotalCellPrice}>{formatNumberWithCommas(data.projectAmount)}</Text>
          <Text style={pdfStyles.tableTotalCellWeight}>{formattedTotalCalculatedWeightage}</Text>
          <Text style={pdfStyles.tableTotalCellPhysical}>—</Text>
          <Text style={pdfStyles.tableTotalCellNet}>{formattedOverallProgress}</Text>
          <Text style={pdfStyles.tableTotalCellValue}>
            {formatNumberWithCommas(calculations.totalProgressValue)}
          </Text>
        </View>
      </View>

      {/* Progress Valuation Metric Card */}
      <View style={pdfStyles.summaryBanner} wrap={false}>
        <View style={pdfStyles.summaryMetricBlock}>
          <Text style={pdfStyles.summaryMetricLabel}>Overall Physical Completion</Text>
          <Text style={pdfStyles.summaryMetricValue}>{formattedOverallProgress}</Text>
          <View style={pdfStyles.progressBarBg}>
            <View style={[pdfStyles.progressBarFill, { width: `${progressPercentageNumber}%` }]} />
          </View>
        </View>
        <View style={pdfStyles.summaryMetricBlock}>
          <Text style={pdfStyles.summaryMetricLabel}>Total Earned Valuation</Text>
          <Text style={pdfStyles.summaryMetricValue}>{formattedTotalProgressValue}</Text>
          <Text style={{ fontSize: 6.5, color: '#64748B', marginTop: 2 }}>
            Authoritative Contract Value: {formattedProjectAmount}
          </Text>
        </View>
      </View>

      {/* Optional Reconciliation Note */}
      {data.showReconciliationNote && calculations.isDiscrepancy && (
        <View style={pdfStyles.reconciliationBox} wrap={false}>
          <Text style={pdfStyles.reconciliationText}>
            * Reconciliation Note: The sum of itemized scope values ({formatCurrency(calculations.totalScopeAmount, data.currency)}) differs from the authoritative contractual project amount ({formattedProjectAmount}) by {formatCurrency(Math.abs(calculations.discrepancyAmount), data.currency)} (Total weightage: {formattedTotalCalculatedWeightage}). Calculations follow standard project valuation principles.
          </Text>
        </View>
      )}

      {/* Fixed Footer */}
      <View style={pdfStyles.footerContainer} fixed>
        <Text style={pdfStyles.footerText}>KAYAN CAPITAL HOLDINGS &bull; Confidential Progress Report</Text>
        <Text
          style={pdfStyles.footerPageNum}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        />
      </View>
    </Page>
  );
};
