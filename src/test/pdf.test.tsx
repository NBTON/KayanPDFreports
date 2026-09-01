// @vitest-environment node
import { describe, it, expect } from 'vitest';
import React from 'react';
import { pdf, DocumentProps } from '@react-pdf/renderer';
import { ReportDocument } from '../pdf/ReportDocument';
import { CoverPage } from '../pdf/CoverPage';
import { SummaryPage } from '../pdf/SummaryPage';
import { GHAZLAN_EXAMPLE_DATA, INITIAL_DEMO_DATA } from '../utils/defaults';
import { calculateProjectMetrics } from '../utils/calculations';

async function streamToBuffer(stream: any): Promise<Buffer> {
  if (Buffer.isBuffer(stream)) return stream;
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

describe('PDF Generation & Structure Verification', () => {
  it('renders a valid PDF buffer for the Ghazlan example dataset', async () => {
    const calculations = calculateProjectMetrics(GHAZLAN_EXAMPLE_DATA);
    const doc = React.createElement(ReportDocument, {
      data: GHAZLAN_EXAMPLE_DATA,
      calculations,
    }) as unknown as React.ReactElement<DocumentProps>;
    
    const pdfInstance = pdf(doc);
    const stream = await pdfInstance.toBuffer();
    const buffer = await streamToBuffer(stream);
    
    expect(buffer).toBeDefined();
    const header = buffer.subarray(0, 5).toString('utf-8');
    expect(header).toBe('%PDF-');
    expect(buffer.length).toBeGreaterThan(5000);
  });

  it('contains exactly two Page components in the ReportDocument tree', () => {
    const calculations = calculateProjectMetrics(GHAZLAN_EXAMPLE_DATA);
    const element = ReportDocument({
      data: GHAZLAN_EXAMPLE_DATA,
      calculations,
    }) as React.ReactElement<any>;
    
    expect(element).toBeDefined();
    const children = React.Children.toArray(element.props.children);
    expect(children).toHaveLength(2);
    expect((children[0] as React.ReactElement).type).toBe(CoverPage);
    expect((children[1] as React.ReactElement).type).toBe(SummaryPage);
  });

  it('renders valid PDF buffer for default demonstration data', async () => {
    const calculations = calculateProjectMetrics(INITIAL_DEMO_DATA);
    const doc = React.createElement(ReportDocument, {
      data: INITIAL_DEMO_DATA,
      calculations,
    }) as unknown as React.ReactElement<DocumentProps>;
    
    const pdfInstance = pdf(doc);
    const stream = await pdfInstance.toBuffer();
    const buffer = await streamToBuffer(stream);
    expect(buffer).toBeDefined();
    expect(buffer.subarray(0, 5).toString('utf-8')).toBe('%PDF-');
  });

  it('renders with optional reconciliation note when requested', async () => {
    const dataWithNote = {
      ...GHAZLAN_EXAMPLE_DATA,
      showReconciliationNote: true,
    };
    const calculations = calculateProjectMetrics(dataWithNote);
    const doc = React.createElement(ReportDocument, {
      data: dataWithNote,
      calculations,
    }) as unknown as React.ReactElement<DocumentProps>;
    
    const pdfInstance = pdf(doc);
    const stream = await pdfInstance.toBuffer();
    const buffer = await streamToBuffer(stream);
    expect(buffer.length).toBeGreaterThan(5000);
  });
});
