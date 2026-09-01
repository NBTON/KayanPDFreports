import React from 'react';
import { Page, View, Text, Image } from '@react-pdf/renderer';
import { ProjectFormData, ProjectCalculations, CalculatedScopeItem } from '../types';
import { pdfStyles } from './styles';
import { formatDateDDMMMYY, formatCurrency, formatPercent, formatNumberWithCommas } from '../utils/calculations';
import { KAYAN_LOGO_BASE64 } from '../assets/logoBase64';

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
    <Page size="LETTER" style={pdfStyles.page}>
      <View style={pdfStyles.pageWrapper}>
        {/* Header */}
        <View style={pdfStyles.headerContainer}>
          <View style={pdfStyles.headerLogoWrapper}>
            <Image src={KAYAN_LOGO_BASE64} style={pdfStyles.headerLogo} />
          </View>
          <View style={pdfStyles.headerTitleWrapper}>
            <Text style={pdfStyles.headerTitle}>Progress Report</Text>
            <Text style={pdfStyles.headerSub}>Project Scope & Progress Valuation</Text>
          </View>
          <View style={pdfStyles.headerRightBadge}>
            <Text style={pdfStyles.headerDateText}>{formattedReportDate}</Text>
          </View>
        </View>

        {/* Scope Section */}
        <View>
          <View style={pdfStyles.sectionHeader}>
            <Text style={pdfStyles.sectionTitle}>Project Scope Summary</Text>
            <Text style={pdfStyles.sectionMeta}>
              Project: {data.projectName || '—'} ({data.currency})
            </Text>
          </View>

          {/* Table */}
          <View style={pdfStyles.tableContainer}>
            {/* Table Header */}
            <View style={pdfStyles.tableHeaderRow}>
              <Text style={[pdfStyles.tableHeaderCell, { width: '36%' }]}>Description</Text>
              <Text style={[pdfStyles.tableHeaderCellRight, { width: '18%' }]}>Total Price</Text>
              <Text style={[pdfStyles.tableHeaderCellRight, { width: '14%' }]}>Weightage</Text>
              <Text style={[pdfStyles.tableHeaderCellRight, { width: '14%' }]}>Net Progress</Text>
              <Text style={[pdfStyles.tableHeaderCellRight, { width: '18%' }]}>Progress Value</Text>
            </View>

            {/* Table Rows */}
            {calculations.calculatedScopes.map((scope: CalculatedScopeItem, index: number) => {
              const rowStyle = index % 2 === 1 ? pdfStyles.tableRowEven : pdfStyles.tableRow;
              return (
                <View key={scope.id || index} style={rowStyle}>
                  <Text style={pdfStyles.tableCellDesc}>{scope.description || `Activity ${index + 1}`}</Text>
                  <Text style={pdfStyles.tableCellPrice}>
                    {formatNumberWithCommas(scope.scopeAmount)}
                  </Text>
                  <Text style={pdfStyles.tableCellWeight}>
                    {formatPercent(scope.activityWeightage, 2)}
                  </Text>
                  <Text style={pdfStyles.tableCellNet}>
                    {formatPercent(scope.netProgress, 2)}
                  </Text>
                  <Text style={pdfStyles.tableCellValue}>
                    {formatNumberWithCommas(scope.progressValue)}
                  </Text>
                </View>
              );
            })}

            {/* Total Row */}
            <View style={pdfStyles.tableTotalRow}>
              <Text style={pdfStyles.tableTotalCellDesc}>Total progress</Text>
              <Text style={pdfStyles.tableTotalCellPrice}>
                {formatNumberWithCommas(data.projectAmount)}
              </Text>
              <Text style={pdfStyles.tableTotalCellWeight}>
                {formattedTotalCalculatedWeightage}
              </Text>
              <Text style={pdfStyles.tableTotalCellNet}>
                {formattedOverallProgress}
              </Text>
              <Text style={pdfStyles.tableTotalCellValue}>
                {formatNumberWithCommas(calculations.totalProgressValue)}
              </Text>
            </View>
          </View>

          {/* Progress Valuation Metric Card */}
          <View style={pdfStyles.summaryBanner}>
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
              <Text style={{ fontSize: 7.5, color: '#718096', marginTop: 4 }}>
                Authoritative Contract Value: {formattedProjectAmount}
              </Text>
            </View>
          </View>

          {/* Optional Reconciliation Note */}
          {data.showReconciliationNote && calculations.isDiscrepancy && (
            <View style={pdfStyles.reconciliationBox}>
              <Text style={pdfStyles.reconciliationText}>
                * Reconciliation Note: The sum of itemized scope values ({formatCurrency(calculations.totalScopeAmount, data.currency)}) differs from the authoritative contractual project amount ({formattedProjectAmount}) by {formatCurrency(Math.abs(calculations.discrepancyAmount), data.currency)} (Total weightage: {formattedTotalCalculatedWeightage}). Calculations follow standard project valuation principles.
              </Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={pdfStyles.footerContainer}>
          <Text style={pdfStyles.footerText}>KAYAN CAPITAL HOLDINGS &bull; Confidential Progress Report</Text>
          <Text style={pdfStyles.footerPageNum}>Page 2 of 2</Text>
        </View>
      </View>
    </Page>
  );
};
