import { StyleSheet } from '@react-pdf/renderer';

export const pdfStyles = StyleSheet.create({
  // Single-page (Cover Page)
  page: {
    size: 'LETTER',
    orientation: 'portrait',
    paddingTop: 24,
    paddingBottom: 36,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#1E293B',
  },

  // Multi-page (Summary & Table Pages)
  multiPage: {
    size: 'LETTER',
    orientation: 'portrait',
    paddingTop: 70, // Ample space for fixed top header at y=18
    paddingBottom: 38, // Ample space for fixed bottom footer at y=bottom-14
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#1E293B',
  },

  // Header Banner for Cover Page (in-flow)
  headerContainer: {
    backgroundColor: '#1E3A8A', // Executive Deep Blue
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  // Fixed Repeating Header Banner for Multi-page Summary
  headerContainerFixed: {
    position: 'absolute',
    top: 18,
    left: 24,
    right: 24,
    backgroundColor: '#1E3A8A',
    borderRadius: 5,
    paddingVertical: 7,
    paddingHorizontal: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogoWrapper: {
    width: 38,
    height: 38,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    padding: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  headerTitleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 8,
    color: '#BFDBFE',
    textAlign: 'center',
    marginTop: 1.5,
  },
  headerRightBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    paddingVertical: 3.5,
    paddingHorizontal: 7,
  },
  headerDateText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
  },

  // Cover Page Specific Styles
  coverCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 10,
  },
  coverCardHeader: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#2563EB',
    paddingBottom: 5,
    marginBottom: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  coverCardTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#1E3A8A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  coverCardSubtitle: {
    fontSize: 8,
    color: '#64748B',
  },

  // Info Rows
  infoRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E2E8F0',
    borderBottomStyle: 'dotted',
  },
  infoRowHighlight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5.5,
    paddingHorizontal: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#CBD5E1',
    borderBottomStyle: 'dotted',
    marginVertical: 1,
  },
  infoLabel: {
    width: '36%',
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#334155',
  },
  infoValue: {
    width: '64%',
    fontSize: 8.5,
    fontFamily: 'Helvetica',
    color: '#0F172A',
  },
  infoValueBold: {
    width: '64%',
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#1E3A8A',
  },
  infoValueProgress: {
    width: '64%',
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#2563EB',
  },

  // KPI Grid
  kpiGrid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  kpiCard: {
    width: '23.5%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 5,
    padding: 6.5,
  },
  kpiCardHighlight: {
    width: '23.5%',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 5,
    padding: 6.5,
  },
  kpiLabel: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  kpiLabelHighlight: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: '#1D4ED8',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  kpiValueMain: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
  },
  kpiValueHighlight: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#1E40AF',
  },
  kpiSub: {
    fontSize: 6,
    color: '#64748B',
    marginTop: 2,
  },
  kpiSubHighlight: {
    fontSize: 6,
    fontFamily: 'Helvetica-Bold',
    color: '#2563EB',
    marginTop: 2,
  },

  // Charts Layout
  analyticsContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 5,
    padding: 8,
    marginBottom: 8,
  },
  analyticsHeader: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#1E3A8A',
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 3,
  },
  chartRowContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chartSvgWrapper: {
    width: '36%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartLegendWrapper: {
    width: '62%',
    paddingLeft: 6,
  },
  chartLegendHeader: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#475569',
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  legendItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 1.5,
  },
  legendColorDot: {
    width: 5.5,
    height: 5.5,
    borderRadius: 2.75,
    marginRight: 4,
  },
  legendLabel: {
    flex: 1,
    fontSize: 7,
    color: '#334155',
  },
  legendPercent: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
    width: 32,
    textAlign: 'right',
  },
  legendValue: {
    fontSize: 6.5,
    color: '#64748B',
    width: 60,
    textAlign: 'right',
  },
  legendMoreText: {
    fontSize: 6,
    fontFamily: 'Helvetica-Oblique',
    color: '#64748B',
    marginTop: 2,
  },
  chartEmptyContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartEmptyText: {
    fontSize: 7.5,
    color: '#94A3B8',
  },

  // Scope Summary Page Section
  sectionHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#1E3A8A',
    letterSpacing: 0.3,
  },
  sectionMeta: {
    fontSize: 7.5,
    color: '#64748B',
  },

  // Scope Table
  tableContainer: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    overflow: 'hidden',
    marginBottom: 8,
  },
  tableHeaderRow: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#1E3A8A',
    paddingVertical: 5,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  tableHeaderCell: {
    color: '#FFFFFF',
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
    textTransform: 'uppercase',
  },
  tableHeaderCellRight: {
    color: '#FFFFFF',
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
    textAlign: 'right',
    textTransform: 'uppercase',
  },

  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 4.5,
    paddingHorizontal: 5,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  tableRowEven: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 4.5,
    paddingHorizontal: 5,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },

  // Column Width Proportions: 33% + 17% + 12% + 11% + 11% + 16% = 100%
  colDesc: {
    width: '33%',
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#1E293B',
    paddingRight: 4,
  },
  colPrice: {
    width: '17%',
    fontSize: 7,
    textAlign: 'right',
    color: '#1E293B',
  },
  colWeight: {
    width: '12%',
    fontSize: 7,
    textAlign: 'right',
    color: '#475569',
  },
  colPhysical: {
    width: '11%',
    fontSize: 7,
    textAlign: 'right',
    color: '#475569',
  },
  colNet: {
    width: '11%',
    fontSize: 7,
    textAlign: 'right',
    fontFamily: 'Helvetica-Bold',
    color: '#2563EB',
  },
  colValue: {
    width: '16%',
    fontSize: 7,
    textAlign: 'right',
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
  },

  // Table Total Row
  tableTotalRow: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 5.5,
    paddingHorizontal: 5,
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderTopWidth: 1.25,
    borderTopColor: '#3B82F6',
  },
  tableTotalCellDesc: {
    width: '33%',
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#1E3A8A',
  },
  tableTotalCellPrice: {
    width: '17%',
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
    color: '#1E3A8A',
  },
  tableTotalCellWeight: {
    width: '12%',
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
    color: '#1E3A8A',
  },
  tableTotalCellPhysical: {
    width: '11%',
    fontSize: 7.5,
    textAlign: 'right',
    color: '#64748B',
  },
  tableTotalCellNet: {
    width: '11%',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
    color: '#2563EB',
  },
  tableTotalCellValue: {
    width: '16%',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
    color: '#1E3A8A',
  },

  // Valuation Metric Card
  summaryBanner: {
    backgroundColor: '#F8FAFC',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  summaryMetricBlock: {
    width: '48%',
  },
  summaryMetricLabel: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  summaryMetricValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#1E3A8A',
  },
  progressBarBg: {
    height: 4.5,
    backgroundColor: '#E2E8F0',
    borderRadius: 2.25,
    marginTop: 2.5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 2.25,
  },

  // Reconciliation Box
  reconciliationBox: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: 4,
    padding: 6,
    marginBottom: 6,
  },
  reconciliationText: {
    fontSize: 6.5,
    color: '#92400E',
    lineHeight: 1.3,
  },

  // Fixed Footer
  footerContainer: {
    position: 'absolute',
    bottom: 14,
    left: 24,
    right: 24,
    borderTopWidth: 0.75,
    borderTopColor: '#E2E8F0',
    paddingTop: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 6.5,
    color: '#94A3B8',
  },
  footerPageNum: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#64748B',
  },
});
