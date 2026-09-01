import React from 'react';
import { Page, View, Text, Image } from '@react-pdf/renderer';
import { ProjectFormData, ProjectCalculations } from '../types';
import { pdfStyles } from './styles';
import { formatDateDDMMMYY, formatCurrency, formatPercent } from '../utils/calculations';
import { KAYAN_LOGO_BASE64 } from '../assets/logoBase64';

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
      <View style={pdfStyles.pageWrapper}>
        {/* Header */}
        <View style={pdfStyles.headerContainer}>
          <View style={pdfStyles.headerLogoWrapper}>
            <Image src={KAYAN_LOGO_BASE64} style={pdfStyles.headerLogo} />
          </View>
          <View style={pdfStyles.headerTitleWrapper}>
            <Text style={pdfStyles.headerTitle}>Progress Report</Text>
            <Text style={pdfStyles.headerSub}>Project Overview & Executive Summary</Text>
          </View>
          <View style={pdfStyles.headerRightBadge}>
            <Text style={pdfStyles.headerDateText}>{formattedReportDate}</Text>
          </View>
        </View>

        {/* Project Information Card */}
        <View style={pdfStyles.coverCard}>
          <View style={pdfStyles.coverCardHeader}>
            <Text style={pdfStyles.coverCardTitle}>Project Information</Text>
            <Text style={pdfStyles.coverCardSubtitle}>As of {formattedReportDate}</Text>
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
            <Text style={pdfStyles.infoLabel}>Project Start:</Text>
            <Text style={pdfStyles.infoValueBold}>{formattedStartDate}</Text>
          </View>

          <View style={pdfStyles.infoRow}>
            <Text style={pdfStyles.infoLabel}>Project End:</Text>
            <Text style={pdfStyles.infoValueBold}>{formattedEndDate}</Text>
          </View>

          <View style={pdfStyles.infoRowHighlight}>
            <Text style={pdfStyles.infoLabel}>Project Amount:</Text>
            <Text style={pdfStyles.infoValueBold}>{formattedAmount}</Text>
          </View>

          <View style={pdfStyles.infoRowHighlight}>
            <Text style={pdfStyles.infoLabel}>Net Progress:</Text>
            <Text style={pdfStyles.infoValueProgress}>{formattedProgress}</Text>
          </View>

          <View style={pdfStyles.infoRow}>
            <Text style={pdfStyles.infoLabel}>Project Leader:</Text>
            <Text style={pdfStyles.infoValueBold}>{data.projectLeader || '—'}</Text>
          </View>

          <View style={pdfStyles.infoRow}>
            <Text style={pdfStyles.infoLabel}>Project Days:</Text>
            <Text style={pdfStyles.infoValueBold}>{calculations.projectDuration ? `${calculations.projectDuration} Days` : '—'}</Text>
          </View>

          <View style={pdfStyles.infoRow}>
            <Text style={pdfStyles.infoLabel}>Day Number:</Text>
            <Text style={pdfStyles.infoValueBold}>{calculations.dayNumberDisplay}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={pdfStyles.footerContainer}>
          <Text style={pdfStyles.footerText}>KAYAN CAPITAL HOLDINGS &bull; Confidential Progress Report</Text>
          <Text style={pdfStyles.footerPageNum}>Page 1 of 2</Text>
        </View>
      </View>
    </Page>
  );
};
