import React from 'react';
import { Document } from '@react-pdf/renderer';
import { ProjectFormData, ProjectCalculations } from '../types';
import { CoverPage } from './CoverPage';
import { SummaryPage } from './SummaryPage';

interface ReportDocumentProps {
  data: ProjectFormData;
  calculations: ProjectCalculations;
}

export const ReportDocument: React.FC<ReportDocumentProps> = ({ data, calculations }) => {
  return (
    <Document
      title={`Progress Report - ${data.projectName || 'Project'}`}
      author="KAYAN CAPITAL HOLDINGS"
      subject="Project Progress Valuation Report"
      creator="Progress Report PDF Generator"
    >
      <CoverPage data={data} calculations={calculations} />
      <SummaryPage data={data} calculations={calculations} />
    </Document>
  );
};
