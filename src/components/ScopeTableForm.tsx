import React from 'react';
import { UseFormRegister, FieldErrors, UseFieldArrayReturn, UseFormWatch } from 'react-hook-form';
import { Plus, Trash2, ArrowUp, ArrowDown, ListOrdered, AlertCircle } from 'lucide-react';
import { ProjectFormData, ProjectCalculations, CalculatedScopeItem } from '../types';
import { formatNumberWithCommas, formatPercent } from '../utils/calculations';
import { ReconciliationBanner } from './ReconciliationBanner';

interface ScopeTableFormProps {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
  watch: UseFormWatch<ProjectFormData>;
  fieldArray: UseFieldArrayReturn<ProjectFormData, 'scopeItems', 'id'>;
  calculations: ProjectCalculations;
  onToggleReconciliationNote: (val: boolean) => void;
}

export const ScopeTableForm: React.FC<ScopeTableFormProps> = ({
  register,
  errors,
  watch,
  fieldArray,
  calculations,
  onToggleReconciliationNote,
}) => {
  const { fields, append, remove, move } = fieldArray;
  const currency = watch('currency') || 'SAR';
  const projectAmount = watch('projectAmount') || 0;
  const showReconciliationNote = watch('showReconciliationNote') || false;

  const handleAddRow = () => {
    if (fields.length >= 8) return;
    append({
      id: `scope-${Date.now()}`,
      description: '',
      scopeAmount: 0,
      physicalCompletion: 0,
    });
  };

  return (
    <section className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-5">
      <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <ListOrdered className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">2. Project Scope & Progress Breakdown</h2>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-medium">
            {fields.length} / 8 rows (2-page limit)
          </span>
          <button
            type="button"
            onClick={handleAddRow}
            disabled={fields.length >= 8}
            className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              fields.length >= 8
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs focus:ring-2 focus:ring-blue-400'
            }`}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Scope Row
          </button>
        </div>
      </div>

      {/* Reconciliation Alert Banner */}
      <ReconciliationBanner
        isDiscrepancy={calculations.isDiscrepancy}
        discrepancyAmount={calculations.discrepancyAmount}
        projectAmount={projectAmount}
        totalScopeAmount={calculations.totalScopeAmount}
        totalCalculatedWeightage={calculations.totalCalculatedWeightage}
        currency={currency}
        showReconciliationNote={showReconciliationNote}
        onToggleReconciliationNote={onToggleReconciliationNote}
      />

      {/* Scope Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-xs">
          <thead className="bg-slate-50 text-slate-700 font-semibold">
            <tr>
              <th scope="col" className="py-2.5 px-2 text-center w-12">#</th>
              <th scope="col" className="py-2.5 px-3 text-left min-w-[180px]">
                Scope Description <span className="text-rose-500">*</span>
              </th>
              <th scope="col" className="py-2.5 px-3 text-right min-w-[120px]">
                Scope Amount ({currency}) <span className="text-rose-500">*</span>
              </th>
              <th scope="col" className="py-2.5 px-3 text-right min-w-[100px]">
                Physical % (0-100) <span className="text-rose-500">*</span>
              </th>
              <th scope="col" className="py-2.5 px-3 text-right bg-slate-100/60 min-w-[90px] text-slate-600">
                Weightage
              </th>
              <th scope="col" className="py-2.5 px-3 text-right bg-slate-100/60 min-w-[90px] text-blue-700">
                Net Progress
              </th>
              <th scope="col" className="py-2.5 px-3 text-right bg-slate-100/60 min-w-[110px] text-slate-600">
                Progress Value ({currency})
              </th>
              <th scope="col" className="py-2.5 px-2 text-center w-20">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {fields.map((field, index) => {
              const calcItem: CalculatedScopeItem | undefined = calculations.calculatedScopes[index];
              const fieldError = errors.scopeItems?.[index];

              return (
                <tr key={field.id} className="hover:bg-slate-50/75 transition-colors">
                  {/* Row index */}
                  <td className="py-2 px-2 text-center font-mono text-slate-400 font-medium">
                    {index + 1}
                  </td>

                  {/* Description input */}
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      placeholder="e.g. FA GENERAL"
                      {...register(`scopeItems.${index}.description` as const)}
                      className={`w-full text-xs py-1.5 px-2.5 rounded border transition-colors focus:outline-none focus:ring-1 ${
                        fieldError?.description
                          ? 'border-rose-400 focus:ring-rose-200'
                          : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                      }`}
                    />
                    {fieldError?.description && (
                      <p className="text-[10px] text-rose-500 mt-0.5">{fieldError.description.message}</p>
                    )}
                  </td>

                  {/* Scope Amount input */}
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      {...register(`scopeItems.${index}.scopeAmount` as const, { valueAsNumber: true })}
                      className={`w-full text-xs py-1.5 px-2.5 text-right font-mono rounded border transition-colors focus:outline-none focus:ring-1 ${
                        fieldError?.scopeAmount
                          ? 'border-rose-400 focus:ring-rose-200'
                          : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                      }`}
                    />
                    {fieldError?.scopeAmount && (
                      <p className="text-[10px] text-rose-500 mt-0.5">{fieldError.scopeAmount.message}</p>
                    )}
                  </td>

                  {/* Physical Completion % input */}
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      step="any"
                      min="0"
                      max="100"
                      placeholder="0.0"
                      {...register(`scopeItems.${index}.physicalCompletion` as const, { valueAsNumber: true })}
                      className={`w-full text-xs py-1.5 px-2.5 text-right font-mono rounded border transition-colors focus:outline-none focus:ring-1 ${
                        fieldError?.physicalCompletion
                          ? 'border-rose-400 focus:ring-rose-200'
                          : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                      }`}
                    />
                    {fieldError?.physicalCompletion && (
                      <p className="text-[10px] text-rose-500 mt-0.5">{fieldError.physicalCompletion.message}</p>
                    )}
                  </td>

                  {/* Calculated Weightage */}
                  <td className="py-2 px-3 text-right font-mono text-slate-600 bg-slate-50/60">
                    {formatPercent(calcItem?.activityWeightage, 2)}
                  </td>

                  {/* Calculated Net Progress */}
                  <td className="py-2 px-3 text-right font-mono font-semibold text-blue-600 bg-blue-50/40">
                    {formatPercent(calcItem?.netProgress, 2)}
                  </td>

                  {/* Calculated Progress Value */}
                  <td className="py-2 px-3 text-right font-mono text-slate-800 bg-slate-50/60">
                    {formatNumberWithCommas(calcItem?.progressValue)}
                  </td>

                  {/* Reorder and Delete actions */}
                  <td className="py-2 px-2 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        type="button"
                        onClick={() => index > 0 && move(index, index - 1)}
                        disabled={index === 0}
                        title="Move Up"
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => index < fields.length - 1 && move(index, index + 1)}
                        disabled={index === fields.length - 1}
                        title="Move Down"
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => fields.length > 1 && remove(index)}
                        disabled={fields.length <= 1}
                        title="Delete Row"
                        className="p-1 text-rose-400 hover:text-rose-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Table Footer / Summary Row */}
          <tfoot className="bg-blue-50/80 font-bold border-t-2 border-blue-200 text-slate-900">
            <tr>
              <td colSpan={2} className="py-3 px-3 text-left text-xs text-blue-950 font-bold uppercase tracking-wider">
                Total Progress Summary
              </td>
              <td className="py-3 px-3 text-right font-mono text-xs text-slate-900">
                {formatNumberWithCommas(calculations.totalScopeAmount)}
              </td>
              <td className="py-3 px-3 text-right text-xs text-slate-500 font-normal">
                —
              </td>
              <td className="py-3 px-3 text-right font-mono text-xs text-slate-900">
                {formatPercent(calculations.totalCalculatedWeightage, 2)}
              </td>
              <td className="py-3 px-3 text-right font-mono text-xs text-blue-800 font-extrabold">
                {formatPercent(calculations.overallProgress, 2)}
              </td>
              <td className="py-3 px-3 text-right font-mono text-xs text-blue-950 font-extrabold">
                {formatNumberWithCommas(calculations.totalProgressValue)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Overflow & Row Limit Explanation Notice */}
      {fields.length >= 8 && (
        <div className="flex items-center space-x-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            Maximum 8 scope activities reached. This ensures all content fits exactly on Page 2 without creating extra blank or overflow pages.
          </span>
        </div>
      )}
    </section>
  );
};
