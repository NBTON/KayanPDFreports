import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { PdfPreviewPanel } from '../components/PdfPreviewPanel';
import { App } from '../App';
import { GHAZLAN_EXAMPLE_DATA, EMPTY_FORM_DATA } from '../utils/defaults';
import { calculateProjectMetrics } from '../utils/calculations';

let urlCounter = 0;
const createdUrls: string[] = [];
const revokedUrls: string[] = [];

let mockToBlobImpl: () => Promise<Blob> = async () => new Blob(['mock-pdf-content'], { type: 'application/pdf' });

vi.mock('@react-pdf/renderer', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@react-pdf/renderer')>();
  return {
    ...actual,
    pdf: vi.fn((_element: any) => ({
      toBlob: () => mockToBlobImpl(),
      toBuffer: vi.fn(async () => Buffer.from('mock-pdf-content')),
      toString: vi.fn(async () => 'mock-pdf-string'),
      on: vi.fn(),
      removeListener: vi.fn(),
      updateContainer: vi.fn(),
    })),
  };
});

beforeEach(() => {
  urlCounter = 0;
  createdUrls.length = 0;
  revokedUrls.length = 0;
  mockToBlobImpl = async () => new Blob(['mock-pdf-content'], { type: 'application/pdf' });

  global.URL.createObjectURL = vi.fn((_blob: any) => {
    const url = `blob:http://localhost/mock-pdf-blob-${++urlCounter}`;
    createdUrls.push(url);
    return url;
  });

  global.URL.revokeObjectURL = vi.fn((url: string) => {
    revokedUrls.push(url);
  });
});

afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
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

  it('does not continuously regenerate PDF when idle (idle stability)', async () => {
    vi.useFakeTimers();
    const calculations = calculateProjectMetrics(GHAZLAN_EXAMPLE_DATA);

    render(<PdfPreviewPanel data={GHAZLAN_EXAMPLE_DATA} calculations={calculations} />);

    // Initial 50ms trigger
    await act(async () => {
      vi.advanceTimersByTime(60);
    });

    const initialUrlCount = createdUrls.length;
    expect(initialUrlCount).toBe(1);

    // Advance time by 10 idle seconds
    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    // URL must NOT change while idle
    expect(createdUrls.length).toBe(initialUrlCount);
  });

  it('debounces single form edit and produces at most one new preview URL', async () => {
    vi.useFakeTimers();
    const calculations1 = calculateProjectMetrics(GHAZLAN_EXAMPLE_DATA);

    const { rerender } = render(<PdfPreviewPanel data={GHAZLAN_EXAMPLE_DATA} calculations={calculations1} />);

    await act(async () => {
      vi.advanceTimersByTime(60);
    });
    expect(createdUrls.length).toBe(1);

    // Edit form data
    const modifiedData = {
      ...GHAZLAN_EXAMPLE_DATA,
      projectName: 'Ghezlan Phase 2 Updated',
    };
    const calculations2 = calculateProjectMetrics(modifiedData);

    rerender(<PdfPreviewPanel data={modifiedData} calculations={calculations2} />);

    // Before 350ms debounce, no new URL created
    await act(async () => {
      vi.advanceTimersByTime(200);
    });
    expect(createdUrls.length).toBe(1);

    // Complete debounce
    await act(async () => {
      vi.advanceTimersByTime(200);
    });
    expect(createdUrls.length).toBe(2);

    // Advance further without changes: remains stable
    await act(async () => {
      vi.advanceTimersByTime(5000);
    });
    expect(createdUrls.length).toBe(2);
  });

  it('triggers exactly one additional generation on explicit Force refresh', async () => {
    vi.useFakeTimers();
    const calculations = calculateProjectMetrics(GHAZLAN_EXAMPLE_DATA);

    render(<PdfPreviewPanel data={GHAZLAN_EXAMPLE_DATA} calculations={calculations} />);

    await act(async () => {
      vi.advanceTimersByTime(60);
    });
    expect(createdUrls.length).toBe(1);

    const refreshButton = screen.getByTitle('Force refresh preview');
    await act(async () => {
      fireEvent.click(refreshButton);
    });

    expect(createdUrls.length).toBe(2);
  });

  it('prevents stale async render completion from replacing a newer result', async () => {
    vi.useFakeTimers();

    let resolveFirstRender: (blob: Blob) => void = () => {};
    let resolveSecondRender: (blob: Blob) => void = () => {};

    let renderCallCount = 0;
    mockToBlobImpl = () => {
      renderCallCount++;
      const currentCall = renderCallCount;
      return new Promise<Blob>((resolve) => {
        if (currentCall === 1) {
          resolveFirstRender = resolve;
        } else {
          resolveSecondRender = resolve;
        }
      });
    };

    const data1 = { ...GHAZLAN_EXAMPLE_DATA, projectName: 'Render 1' };
    const calcs1 = calculateProjectMetrics(data1);

    const { rerender } = render(<PdfPreviewPanel data={data1} calculations={calcs1} />);

    await act(async () => {
      vi.advanceTimersByTime(60);
    });

    // Render 2 scheduled before Render 1 resolves
    const data2 = { ...GHAZLAN_EXAMPLE_DATA, projectName: 'Render 2' };
    const calcs2 = calculateProjectMetrics(data2);
    rerender(<PdfPreviewPanel data={data2} calculations={calcs2} />);

    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    // Resolve Render 2 first (newer)
    await act(async () => {
      resolveSecondRender(new Blob(['blob-2']));
    });
    expect(createdUrls.length).toBe(1);
    const newestUrl = createdUrls[0];

    // Now resolve stale Render 1 (older)
    await act(async () => {
      resolveFirstRender(new Blob(['blob-1']));
    });

    // Stale render should be discarded and not create another URL or overwrite
    expect(createdUrls.length).toBe(1);
    const iframe = screen.getByTitle('PDF Report Preview') as HTMLIFrameElement;
    expect(iframe.src).toContain(newestUrl);
  });

  it('revokes replaced URLs and unmounted URLs cleanly', async () => {
    vi.useFakeTimers();
    const calculations = calculateProjectMetrics(GHAZLAN_EXAMPLE_DATA);

    const { unmount, rerender } = render(<PdfPreviewPanel data={GHAZLAN_EXAMPLE_DATA} calculations={calculations} />);

    await act(async () => {
      vi.advanceTimersByTime(60);
    });
    const firstUrl = createdUrls[0];

    // Update data to trigger second URL
    const data2 = { ...GHAZLAN_EXAMPLE_DATA, projectName: 'Updated Project' };
    const calcs2 = calculateProjectMetrics(data2);
    rerender(<PdfPreviewPanel data={data2} calculations={calcs2} />);

    await act(async () => {
      vi.advanceTimersByTime(400);
    });
    const secondUrl = createdUrls[1];

    // First URL revoked after 3000ms safe transition delay
    await act(async () => {
      vi.advanceTimersByTime(3100);
    });
    expect(revokedUrls).toContain(firstUrl);

    // Unmounting revokes current active URL
    unmount();
    expect(revokedUrls).toContain(secondUrl);
  });
});

describe('App Integration & Autosave Stability', () => {
  it('settles on Draft Saved Locally and does not loop autosave when idle', async () => {
    vi.useFakeTimers();

    render(<App />);

    // Initial render status
    expect(screen.getByText('Draft Saved Locally')).toBeInTheDocument();

    // Advance timers by 10 idle seconds
    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    // Must remain on "Draft Saved Locally" without oscillating to "Saving..."
    expect(screen.getByText('Draft Saved Locally')).toBeInTheDocument();
  });

  it('has responsive sticky classes scoped to xl screens only (inactive below xl)', () => {
    const { container } = render(<App />);
    const previewWrapper = container.querySelector('.xl\\:col-span-5');
    expect(previewWrapper).toBeInTheDocument();
    // Must contain xl:sticky and xl:top-4, and must NOT have un-prefixed sticky
    const classList = previewWrapper?.className || '';
    expect(classList).toContain('xl:sticky');
    expect(classList).toContain('xl:top-4');
    expect(classList).not.toMatch(/(^|\s)sticky(\s|$)/);
  });
});
