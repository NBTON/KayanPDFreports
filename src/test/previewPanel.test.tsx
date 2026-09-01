import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { PdfPreviewPanel } from '../components/PdfPreviewPanel';
import { GHAZLAN_EXAMPLE_DATA, EMPTY_FORM_DATA } from '../utils/defaults';
import { calculateProjectMetrics } from '../utils/calculations';

// Mock URL.createObjectURL and URL.revokeObjectURL
beforeEach(() => {
  global.URL.createObjectURL = vi.fn(() => 'blob:http://localhost/test-preview-pdf-url');
  global.URL.revokeObjectURL = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('PdfPreviewPanel Component', () => {
  it('renders preview container and download button with Ghazlan dataset', async () => {
    const calculations = calculateProjectMetrics(GHAZLAN_EXAMPLE_DATA);

    await act(async () => {
      render(<PdfPreviewPanel data={GHAZLAN_EXAMPLE_DATA} calculations={calculations} />);
    });

    expect(screen.getByText('3. PDF Live Preview & Export')).toBeInTheDocument();
    expect(screen.getByText('Download PDF')).toBeInTheDocument();
    expect(screen.getByTitle('Force refresh preview')).toBeInTheDocument();
  });

  it('displays validation alert and disables download when data is invalid', async () => {
    const calculations = calculateProjectMetrics(EMPTY_FORM_DATA);

    await act(async () => {
      render(<PdfPreviewPanel data={EMPTY_FORM_DATA} calculations={calculations} />);
    });

    expect(screen.getByText('PDF Export Blocked by Validation Errors:')).toBeInTheDocument();
    const downloadButton = screen.getByText('Download PDF').closest('button');
    expect(downloadButton).toBeDisabled();
  });

  it('shows footnote with sanitized filename', async () => {
    const calculations = calculateProjectMetrics(GHAZLAN_EXAMPLE_DATA);

    await act(async () => {
      render(<PdfPreviewPanel data={GHAZLAN_EXAMPLE_DATA} calculations={calculations} />);
    });

    expect(screen.getByText(/Dynamic pagination with repeated headers/)).toBeInTheDocument();
    expect(screen.getByText(/Progress_Report_GHEZLAN_Project/)).toBeInTheDocument();
  });
});
