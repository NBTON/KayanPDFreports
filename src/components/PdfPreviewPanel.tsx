import React, { useEffect } from 'react';
import { usePDF } from '@react-pdf/renderer';
import { Download, FileText, CheckCircle2, AlertOctagon, RefreshCw } from 'lucide-react';
import { ProjectFormData, ProjectCalculations } from '../types';
import { ReportDocument } from '../pdf/ReportDocument';
import { sanitizeFilename } from '../utils/calculations';

interface PdfPreviewPanelProps {
  data: ProjectFormData;
  calculations: ProjectCalculations;
}

export const PdfPreviewPanel: React.FC<PdfPreviewPanelProps> = ({ data, calculations }) => {
  const filename = sanitizeFilename(data.projectName, data.reportDate);
  const [instance, updateInstance] = usePDF({
    document: <ReportDocument data={data} calculations={calculations} />,
  });

  // Re-generate PDF when data or calculations change
  useEffect(() => {
    updateInstance(<ReportDocument data={data} calculations={calculations} />);
  }, [data, calculations, updateInstance]);

  const handleDownload = () => {
    if (!instance.url || !calculations.canExport) return;
    const link = document.createElement('a');
    link.href = instance.url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 flex flex-col h-full min-h-[600px] space-y-4">
      {/* Header & Download Controls */}
      <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <div>
            <h2 className="text-base font-bold text-slate-900">3. PDF Preview & Export</h2>
            <p className="text-xs text-slate-500">Exact 2-Page Executive Document</p>
          </div>
        </div>

        {/* Download Action Button */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={!calculations.canExport || instance.loading}
          className={`inline-flex items-center px-4 py-2 text-xs font-bold rounded-lg shadow-sm transition-all ${
            calculations.canExport && !instance.loading
              ? 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white focus:ring-2 focus:ring-blue-400'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {instance.loading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download PDF ({filename})
            </>
          )}
        </button>
      </div>

      {/* Validation / Blocking Errors Alert */}
      {!calculations.canExport && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs space-y-1">
          <div className="flex items-center space-x-2 font-bold text-rose-900">
            <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
            <span>PDF Export Blocked by Validation Errors:</span>
          </div>
          <ul className="list-disc list-inside text-rose-700 pl-1 space-y-0.5">
            {calculations.validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
            {data.projectAmount <= 0 && <li>Project amount must be positive.</li>}
            {calculations.calculatedScopes.length === 0 && <li>At least one valid scope item is required.</li>}
          </ul>
        </div>
      )}

      {/* Preview Viewer Container */}
      <div className="flex-1 w-full bg-slate-100/80 rounded-lg border border-slate-200 overflow-hidden flex flex-col items-center justify-center relative min-h-[500px]">
        {instance.loading ? (
          <div className="flex flex-col items-center space-y-3 py-16 text-slate-500">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-xs font-semibold">Rendering live 2-page report...</p>
          </div>
        ) : instance.error ? (
          <div className="p-6 text-center text-rose-600 text-xs">
            <AlertOctagon className="w-8 h-8 mx-auto mb-2 text-rose-500" />
            <p className="font-bold">Failed to render PDF preview</p>
            <p className="text-slate-500 mt-1">{String(instance.error)}</p>
          </div>
        ) : instance.url ? (
          <iframe
            src={`${instance.url}#view=FitH&toolbar=0`}
            title="PDF Report Preview"
            className="w-full h-full min-h-[560px] border-0 rounded-lg shadow-inner"
          />
        ) : (
          <div className="text-xs text-slate-400 py-12">No preview available</div>
        )}
      </div>

      {/* Quality Footnote */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
        <span className="flex items-center space-x-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
          <span>Guaranteed exactly 2 Letter portrait pages (Cover + Scope Summary)</span>
        </span>
        <span className="font-mono text-slate-400">{filename}</span>
      </div>
    </section>
  );
};
