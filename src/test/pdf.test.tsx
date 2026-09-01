// @vitest-environment node
import { describe, it, expect } from 'vitest';
import React from 'react';
import { pdf, DocumentProps } from '@react-pdf/renderer';
import { ReportDocument } from '../pdf/ReportDocument';
import { GHAZLAN_EXAMPLE_DATA, INITIAL_DEMO_DATA, LARGE_20_ROW_EXAMPLE_DATA, EMPTY_FORM_DATA } from '../utils/defaults';
import { calculateProjectMetrics } from '../utils/calculations';
import { ProjectFormData } from '../types';

async function streamToBuffer(stream: any): Promise<Buffer> {
  if (Buffer.isBuffer(stream)) return stream;
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

describe('PDF Generation, Multi-Page Support & Analytics Verification', () => {
  it('handles 0 rows gracefully in calculations and chart logic', () => {
    const calculations = calculateProjectMetrics(EMPTY_FORM_DATA);
    expect(calculations.calculatedScopes).toHaveLength(0);
    expect(calculations.canExport).toBe(false);
    expect(calculations.analytics.donutSlices).toHaveLength(0);
    expect(calculations.analytics.totalScopeAmount).toBe(0);
  });

  it('renders a valid PDF buffer for the Ghazlan example dataset (4 rows)', async () => {
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

  it('renders valid PDF buffer for 1-row dataset (single-category chart)', async () => {
    const data: ProjectFormData = {
      ...INITIAL_DEMO_DATA,
      projectAmount: 500000,
      scopeItems: [
        { id: 'row-1', description: 'Single Turnkey Phase', scopeAmount: 500000, physicalCompletion: 80 },
      ],
    };
    const calculations = calculateProjectMetrics(data);
    expect(calculations.analytics.donutSlices).toHaveLength(1);
    expect(calculations.analytics.donutSlices[0].percentage).toBe(100);

    const doc = React.createElement(ReportDocument, {
      data,
      calculations,
    }) as unknown as React.ReactElement<DocumentProps>;

    const pdfInstance = pdf(doc);
    const stream = await pdfInstance.toBuffer();
    const buffer = await streamToBuffer(stream);
    expect(buffer.subarray(0, 5).toString('utf-8')).toBe('%PDF-');
  });

  it('renders valid PDF buffer for 8-row dataset', async () => {
    const data: ProjectFormData = {
      ...INITIAL_DEMO_DATA,
      projectAmount: 800000,
      scopeItems: Array.from({ length: 8 }, (_, i) => ({
        id: `s-${i}`,
        description: `Scope Activity ${i + 1}`,
        scopeAmount: 100000,
        physicalCompletion: 50,
      })),
    };
    const calculations = calculateProjectMetrics(data);
    expect(calculations.calculatedScopes).toHaveLength(8);

    const doc = React.createElement(ReportDocument, {
      data,
      calculations,
    }) as unknown as React.ReactElement<DocumentProps>;

    const pdfInstance = pdf(doc);
    const stream = await pdfInstance.toBuffer();
    const buffer = await streamToBuffer(stream);
    expect(buffer.subarray(0, 5).toString('utf-8')).toBe('%PDF-');
  });

  it('renders valid PDF buffer for 9-row dataset (exceeding previous 8-row limit)', async () => {
    const data: ProjectFormData = {
      ...INITIAL_DEMO_DATA,
      projectAmount: 900000,
      scopeItems: Array.from({ length: 9 }, (_, i) => ({
        id: `s-${i}`,
        description: `Scope Activity ${i + 1}`,
        scopeAmount: 100000,
        physicalCompletion: 50,
      })),
    };
    const calculations = calculateProjectMetrics(data);
    expect(calculations.calculatedScopes).toHaveLength(9);

    const doc = React.createElement(ReportDocument, {
      data,
      calculations,
    }) as unknown as React.ReactElement<DocumentProps>;

    const pdfInstance = pdf(doc);
    const stream = await pdfInstance.toBuffer();
    const buffer = await streamToBuffer(stream);
    expect(buffer.subarray(0, 5).toString('utf-8')).toBe('%PDF-');
  });

  it('renders valid Multi-Page PDF buffer for 20-row Large Project dataset', async () => {
    const calculations = calculateProjectMetrics(LARGE_20_ROW_EXAMPLE_DATA);
    expect(calculations.calculatedScopes).toHaveLength(20);

    const doc = React.createElement(ReportDocument, {
      data: LARGE_20_ROW_EXAMPLE_DATA,
      calculations,
    }) as unknown as React.ReactElement<DocumentProps>;

    const pdfInstance = pdf(doc);
    const stream = await pdfInstance.toBuffer();
    const buffer = await streamToBuffer(stream);

    expect(buffer.subarray(0, 5).toString('utf-8')).toBe('%PDF-');
    expect(buffer.length).toBeGreaterThan(15000);
  });

  it('renders valid Multi-Page PDF buffer for 50+ row Mega dataset', async () => {
    const data: ProjectFormData = {
      ...INITIAL_DEMO_DATA,
      projectName: 'Mega Facility Expansion (55 Scopes)',
      projectAmount: 5500000,
      scopeItems: Array.from({ length: 55 }, (_, i) => ({
        id: `mega-${i}`,
        description: `Mega Project Scope Item ${i + 1}`,
        scopeAmount: 100000,
        physicalCompletion: (i * 2) % 100,
      })),
    };
    const calculations = calculateProjectMetrics(data);
    expect(calculations.calculatedScopes).toHaveLength(55);

    const doc = React.createElement(ReportDocument, {
      data,
      calculations,
    }) as unknown as React.ReactElement<DocumentProps>;

    const pdfInstance = pdf(doc);
    const stream = await pdfInstance.toBuffer();
    const buffer = await streamToBuffer(stream);

    expect(buffer.subarray(0, 5).toString('utf-8')).toBe('%PDF-');
    expect(buffer.length).toBeGreaterThan(25000);
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

