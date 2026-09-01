import React, { useState, useEffect, useRef, useCallback } from 'react';
import { pdf } from '@react-pdf/renderer';
import { Download, FileText, CheckCircle2, AlertOctagon, RefreshCw, ExternalLink } from 'lucide-react';
import { ProjectFormData, ProjectCalculations } from '../types';
import { ReportDocument } from '../pdf/ReportDocument';
import { sanitizeFilename } from '../utils/calculations';

interface PdfPreviewPanelProps {
  data: ProjectFormData;
  calculations: ProjectCalculations;
}

export const PdfPreviewPanel: React.FC<PdfPreviewPanelProps> = ({ data, calculations }) => {
  const filename = sanitizeFilename(data.projectName, data.reportDate);
  
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState<boolean>(true);
  const [renderError, setRenderError] = useState<string | null>(null);
  
  const currentUrlRef = useRef<string | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const isInitialMountRef = useRef<boolean>(true);
  const renderSeqRef = useRef<number>(0);
  const lastRenderedDataRef = useRef<string>('');
  const revocationTimersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const generatePdfBlob = useCallback(async (formData: ProjectFormData, formCalcs: ProjectCalculations) => {
    if (!formCalcs.canExport) {
      setIsRendering(false);
      return;
    }

    const seq = ++renderSeqRef.current;
    setIsRendering(true);
    setRenderError(null);

    try {
      const doc = <ReportDocument data={formData} calculations={formCalcs} />;
      const pdfInstance = pdf(doc);
      const blob = await pdfInstance.toBlob();

      // Discard if component unmounted or a newer render sequence was started
      if (!isMountedRef.current || seq !== renderSeqRef.current) {
        return;
      }

      const newUrl = URL.createObjectURL(blob);
      const oldUrl = currentUrlRef.current;

      currentUrlRef.current = newUrl;
      lastRenderedDataRef.current = JSON.stringify(formData);
      isInitialMountRef.current = false;
      setPdfUrl(newUrl);
      setIsRendering(false);

      // Safely revoke the old URL with a 3-second delay to allow the browser PDF viewer to transition smoothly
      if (oldUrl && oldUrl !== newUrl) {
        const timerId = setTimeout(() => {
          revocationTimersRef.current.delete(timerId);
          try {
            URL.revokeObjectURL(oldUrl);
          } catch {
            // Ignore revocation errors
          }
        }, 3000);
        revocationTimersRef.current.add(timerId);
      }
    } catch (err: any) {
      if (!isMountedRef.current || seq !== renderSeqRef.current) return;
      console.error('Error generating PDF preview:', err);
      setRenderError(err?.message || 'Failed to render PDF document');
      setIsRendering(false);
      isInitialMountRef.current = false;
    }
  }, []);

  // Debounced PDF generation effect driven by semantic form changes
  useEffect(() => {
    if (!calculations.canExport) {
      setIsRendering(false);
      return;
    }

    const serializedData = JSON.stringify(data);
    // If form data has not semantically changed and preview URL exists, avoid redundant generation
    if (serializedData === lastRenderedDataRef.current && pdfUrl !== null) {
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Invalidate any in-flight async render immediately when a new update is scheduled
    renderSeqRef.current++;

    // Fast 50ms for initial render, 350ms debounce for subsequent user edits
    const delay = isInitialMountRef.current ? 50 : 350;

    debounceTimerRef.current = setTimeout(() => {
      generatePdfBlob(data, calculations);
    }, delay);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [data, calculations, generatePdfBlob, pdfUrl]);

  // Clean up timers and blob URLs upon unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      revocationTimersRef.current.forEach((id) => clearTimeout(id));
      revocationTimersRef.current.clear();
      if (currentUrlRef.current) {
        try {
          URL.revokeObjectURL(currentUrlRef.current);
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  const handleDownload = async () => {
    if (!calculations.canExport) return;

    // Use current URL if ready, otherwise generate immediately
    let targetUrl = pdfUrl;
    if (!targetUrl) {
      try {
        setIsRendering(true);
        const doc = <ReportDocument data={data} calculations={calculations} />;
        const blob = await pdf(doc).toBlob();
        targetUrl = URL.createObjectURL(blob);
      } catch (err) {
        console.error('Failed to generate PDF for download:', err);
        return;
      } finally {
        setIsRendering(false);
      }
    }

    const link = document.createElement('a');
    link.href = targetUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  const handleForceRefresh = () => {
    lastRenderedDataRef.current = '';
    generatePdfBlob(data, calculations);
  };

  const isInitialLoading = isRendering && !pdfUrl;

  return (
    <section className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 flex flex-col h-full xl:max-h-[calc(100vh-2rem)] space-y-4">
      {/* Header & Download Controls */}
      <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <div>
            <h2 className="text-base font-bold text-slate-900">3. PDF Live Preview & Export</h2>
            <p className="text-xs text-slate-500">Executive Multi-Page Document & Analytics</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {pdfUrl && (
            <button
              type="button"
              onClick={handleOpenInNewTab}
              title="Open in new window / full view"
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleForceRefresh}
            title="Force refresh preview"
            disabled={isRendering || !calculations.canExport}
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-4 h-4 ${isRendering ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={!calculations.canExport}
            className={`inline-flex items-center px-4 py-2 text-xs font-bold rounded-lg shadow-sm transition-all ${
              calculations.canExport
                ? 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white focus:ring-2 focus:ring-blue-400'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Validation / Blocking Errors Alert */}
      {!calculations.canExport && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs space-y-1 shrink-0">
          <div className="flex items-center space-x-2 font-bold text-rose-900">
            <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
            <span>PDF Export Blocked by Validation Errors:</span>
          </div>
          <ul className="list-disc list-inside text-rose-700 pl-1 space-y-0.5">
            {calculations.validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
            {data.projectAmount <= 0 && <li>Project amount must be greater than zero.</li>}
            {calculations.calculatedScopes.length === 0 && <li>At least one valid scope activity is required.</li>}
          </ul>
        </div>
      )}

      {/* Preview Viewer Container with Persistent Iframe (No key={pdfUrl} to avoid unmounting) */}
      <div className="flex-1 w-full bg-slate-100/80 rounded-lg border border-slate-200 overflow-hidden flex flex-col items-center justify-center relative min-h-[360px] xl:min-h-0">
        {/* Subtle non-intrusive update indicator overlay */}
        {isRendering && pdfUrl && (
          <div className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-xs border border-blue-200 px-3 py-1.5 rounded-full shadow-md text-xs font-semibold text-blue-700 flex items-center space-x-2 animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
            <span>Updating preview...</span>
          </div>
        )}

        {/* Initial Loading State */}
        {isInitialLoading ? (
          <div className="flex flex-col items-center space-y-3 py-16 text-slate-500">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-xs font-semibold">Generating live executive report preview...</p>
          </div>
        ) : renderError ? (
          <div className="p-6 text-center text-rose-600 text-xs">
            <AlertOctagon className="w-8 h-8 mx-auto mb-2 text-rose-500" />
            <p className="font-bold">Failed to render PDF preview</p>
            <p className="text-slate-500 mt-1">{renderError}</p>
            <button
              type="button"
              onClick={handleForceRefresh}
              className="mt-3 px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded text-xs font-semibold transition-colors"
            >
              Retry Rendering
            </button>
          </div>
        ) : pdfUrl ? (
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0`}
            title="PDF Report Preview"
            className="w-full flex-1 h-full min-h-[360px] xl:min-h-0 border-0 rounded-lg shadow-inner"
          />
        ) : (
          <div className="text-xs text-slate-400 py-12 text-center p-4">
            <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-medium">Complete required project information to preview the PDF.</p>
          </div>
        )}
      </div>

      {/* Quality Footnote */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 shrink-0">
        <span className="flex items-center space-x-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
          <span>Dynamic pagination with repeated headers & vector analytics</span>
        </span>
        <span className="font-mono text-slate-400 truncate max-w-[200px]" title={filename}>
          {filename}
        </span>
      </div>
    </section>
  );
};
