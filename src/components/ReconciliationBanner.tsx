import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/calculations';

interface ReconciliationBannerProps {
  isDiscrepancy: boolean;
  discrepancyAmount: number;
  projectAmount: number;
  totalScopeAmount: number;
  totalCalculatedWeightage: number;
  currency: string;
  showReconciliationNote: boolean;
  onToggleReconciliationNote: (val: boolean) => void;
}

export const ReconciliationBanner: React.FC<ReconciliationBannerProps> = ({
  isDiscrepancy,
  discrepancyAmount,
  projectAmount,
  totalScopeAmount,
  totalCalculatedWeightage,
  currency,
  showReconciliationNote,
  onToggleReconciliationNote,
}) => {
  if (!isDiscrepancy) {
    return (
      <div className="rounded-lg p-3 bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Scope Reconciled:</strong> Scope sum perfectly matches project contract amount ({formatCurrency(projectAmount, currency)} &bull; {formatPercent(totalCalculatedWeightage, 2)} weightage).
          </span>
        </div>
      </div>
    );
  }

  const diffAbs = Math.abs(discrepancyAmount);
  const isOver = discrepancyAmount > 0;

  return (
    <div className="rounded-lg p-3.5 bg-amber-50 border border-amber-300 text-amber-900 shadow-xs space-y-2.5">
      <div className="flex items-start space-x-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed space-y-1">
          <div className="font-bold text-amber-950 flex items-center space-x-2">
            <span>Reconciliation Warning: Scope Total Differs from Contract Project Amount</span>
          </div>
          <p className="text-amber-800">
            Contract Project Amount: <strong className="text-slate-900">{formatCurrency(projectAmount, currency)}</strong> vs Sum of Scopes: <strong className="text-slate-900">{formatCurrency(totalScopeAmount, currency)}</strong>
            {' '}&bull; Difference: <span className="font-bold text-amber-950">{isOver ? '+' : '-'}{formatCurrency(diffAbs, currency)}</span>
            {' '}&bull; Total Weightage: <span className="font-bold text-amber-950">{formatPercent(totalCalculatedWeightage, 4)}</span>
          </p>
          <p className="text-[11px] text-amber-700">
            <em>Per specification, the contract Project Amount remains authoritative for weightage denominators without modifying your individual scope inputs.</em>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-amber-200 text-xs">
        <label className="flex items-center space-x-2 cursor-pointer select-none text-amber-900 font-medium">
          <input
            type="checkbox"
            checked={showReconciliationNote}
            onChange={(e) => onToggleReconciliationNote(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-amber-300 focus:ring-blue-500"
          />
          <span>Include reconciliation footnote on Page 2 of generated PDF</span>
        </label>
        <span className="text-[11px] text-amber-700 font-semibold">
          Non-blocking warning
        </span>
      </div>
    </div>
  );
};
