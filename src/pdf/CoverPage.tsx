import React from 'react';
import { Page, View, Text, Image } from '@react-pdf/renderer';
import { ProjectFormData, ProjectCalculations } from '../types';
import { pdfStyles } from './styles';
import { formatDateDDMMMYY, formatCurrency, formatPercent } from '../utils/calculations';
import { KAYAN_LOGO_BASE64 } from '../assets/logoBase64';
import { PdfKpiGrid } from './PdfCharts';

interface CoverPageProps {
  data: ProjectFormData;
  calculations: ProjectCalculations;
}

export const CoverPage: React.FC<CoverPageProps> = ({ data, calculations }) => {
  const formattedReportDate = formatDateDDMMMYY(data.reportDate);
  const formattedStartDate = formatDateDDMMMYY(data.projectStartDate);
  const formattedEndDate = formatDateDDMMMYY(data.projectEndDate);
  const formattedAmount = formatCurrency(data.projectAmount, data.currency);
  const formattedProgress = formatPercent(calculations.overallProgress, 2);

  return (
    <Page size="LETTER" style={pdfStyles.page}>
      {/* Header */}
      <View style={pdfStyles.headerContainer}>
        <View style={pdfStyles.headerLeft}>
          <View style={pdfStyles.headerLogoWrapper}>
            <Image src={KAYAN_LOGO_BASE64} style={pdfStyles.headerLogo} />
          </View>
        </View>
        <View style={pdfStyles.headerTitleWrapper}>
          <Text style={pdfStyles.headerTitle}>Progress Report</Text>
          <Text style={pdfStyles.headerSub}>Executive Overview & Valuation Summary</Text>
        </View>
        <View style={pdfStyles.headerRightBadge}>
          <Text style={pdfStyles.headerDateText}>{formattedReportDate}</Text>
        </View>
      </View>

      {/* KPI Cards Grid */}
      <PdfKpiGrid
        projectAmount={data.projectAmount}
        totalProgressValue={calculations.totalProgressValue}
        remainingValue={calculations.analytics.remainingValue}
        overallProgress={calculations.overallProgress}
        currency={data.currency}
        dayNumberDisplay={calculations.dayNumberDisplay}
        projectDuration={calculations.projectDuration}
      />

      {/* Project Information Card */}
      <View style={pdfStyles.coverCard}>
        <View style={pdfStyles.coverCardHeader}>
          <Text style={pdfStyles.coverCardTitle}>Project Information</Text>
          <Text style={pdfStyles.coverCardSubtitle}>Status as of {formattedReportDate}</Text>
        </View>

        {/* Key-Value Rows */}
        <View style={pdfStyles.infoRow}>
          <Text style={pdfStyles.infoLabel}>Project Name:</Text>
          <Text style={pdfStyles.infoValueBold}>{data.projectName || '—'}</Text>
        </View>

        <View style={pdfStyles.infoRow}>
          <Text style={pdfStyles.infoLabel}>Client:</Text>
          <Text style={pdfStyles.infoValueBold}>{data.client || '—'}</Text>
        </View>

        <View style={pdfStyles.infoRow}>
          <Text style={pdfStyles.infoLabel}>Contractor:</Text>
          <Text style={pdfStyles.infoValueBold}>{data.contractor || '—'}</Text>
        </View>

        <View style={pdfStyles.infoRow}>
          <Text style={pdfStyles.infoLabel}>PO Number:</Text>
          <Text style={pdfStyles.infoValueBold}>{data.poNumber || '—'}</Text>
        </View>

        <View style={pdfStyles.infoRow}>
          <Text style={pdfStyles.infoLabel}>Project Start Date:</Text>
          <Text style={pdfStyles.infoValue}>{formattedStartDate}</Text>
        </View>

        <View style={pdfStyles.infoRow}>
          <Text style={pdfStyles.infoLabel}>Project End Date:</Text>
          <Text style={pdfStyles.infoValue}>{formattedEndDate}</Text>
        </View>

        <View style={pdfStyles.infoRowHighlight}>
          <Text style={pdfStyles.infoLabel}>Contract Project Amount:</Text>
          <Text style={pdfStyles.infoValueBold}>{formattedAmount}</Text>
        </View>

        <View style={pdfStyles.infoRowHighlight}>
          <Text style={pdfStyles.infoLabel}>Net Physical Progress:</Text>
          <Text style={pdfStyles.infoValueProgress}>{formattedProgress}</Text>
        </View>

        <View style={pdfStyles.infoRow}>
          <Text style={pdfStyles.infoLabel}>Project Leader:</Text>
          <Text style={pdfStyles.infoValueBold}>{data.projectLeader || '—'}</Text>
        </View>

        <View style={pdfStyles.infoRow}>
          <Text style={pdfStyles.infoLabel}>Project Duration:</Text>
          <Text style={pdfStyles.infoValue}>
            {calculations.projectDuration ? `${calculations.projectDuration} Calendar Days (Inclusive)` : '—'}
          </Text>
        </View>

        <View style={pdfStyles.infoRow}>
          <Text style={pdfStyles.infoLabel}>Timeline Day Number:</Text>
          <Text style={pdfStyles.infoValueBold}>{calculations.dayNumberDisplay}</Text>
        </View>
      </View>

      {/* Footer */}
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
