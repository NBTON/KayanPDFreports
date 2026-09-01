// @vitest-environment node
import { it, expect } from 'vitest';
import React from 'react';
import fs from 'fs';
import path from 'path';
import { pdf, DocumentProps } from '@react-pdf/renderer';
import { ReportDocument } from '../pdf/ReportDocument';
import { GHAZLAN_EXAMPLE_DATA } from '../utils/defaults';
import { calculateProjectMetrics, sanitizeFilename } from '../utils/calculations';

it('generates sample Ghazlan PDF to root', async () => {
  const calculations = calculateProjectMetrics(GHAZLAN_EXAMPLE_DATA);
  const doc = React.createElement(ReportDocument, {
    data: GHAZLAN_EXAMPLE_DATA,
    calculations,
  }) as unknown as React.ReactElement<DocumentProps>;

  const pdfInstance = pdf(doc);
  const stream = await pdfInstance.toBuffer();
  
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const buffer = Buffer.concat(chunks);

  const filename = sanitizeFilename(GHAZLAN_EXAMPLE_DATA.projectName, GHAZLAN_EXAMPLE_DATA.reportDate);
  const outPath = path.resolve(__dirname, '../../', filename);
  fs.writeFileSync(outPath, buffer);
  
  expect(fs.existsSync(outPath)).toBe(true);
  expect(buffer.length).toBeGreaterThan(10000);
  console.log(`Generated verified sample PDF at: ${outPath} (${buffer.length} bytes)`);
});
