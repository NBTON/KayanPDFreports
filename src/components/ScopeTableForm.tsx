import React, { useState, useMemo } from 'react';
import { UseFormRegister, FieldErrors, UseFieldArrayReturn, UseFormWatch } from 'react-hook-form';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ListOrdered,
  Copy,
  Search,
} from 'lucide-react';
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
  const { fields, append, remove, move, insert } = fieldArray;
  const currency = watch('currency') || 'SAR';
  const projectAmount = watch('projectAmount') || 0;
  const showReconciliationNote = watch('showReconciliationNote') || false;

  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleAddRow = () => {
    append({
      id: `scope-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      description: '',
      scopeAmount: 0,
      physicalCompletion: 0,
    });
  };

  const handleAddMultipleRows = (count: number = 5) => {
    for (let i = 0; i < count; i++) {
      append({
        id: `scope-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
        description: '',
        scopeAmount: 0,
        physicalCompletion: 0,
      });
    }
  };

  const handleDuplicateRow = (index: number) => {
    const current = fields[index];
    if (!current) return;
    const currentScope = watch(`scopeItems.${index}`);
    insert(index + 1, {
      id: `scope-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      description: currentScope?.description ? `${currentScope.description} (Copy)` : '',
      scopeAmount: currentScope?.scopeAmount || 0,
      physicalCompletion: currentScope?.physicalCompletion || 0,
    });
  };

  // Filter indices based on search term
  const visibleIndices = useMemo(() => {
    if (!searchTerm.trim()) {
      return fields.map((_, i) => i);
    }
    const lower = searchTerm.toLowerCase();
    return fields
      .map((_, i) => i)
      .filter((i) => {
        const item = watch(`scopeItems.${i}`);
        return (item?.description || '').toLowerCase().includes(lower);
      });
  }, [fields, searchTerm, watch]);

  return (
    <section className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-5">
      {/* Section Header & Controls */}
      <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <ListOrdered className="w-5 h-5 text-blue-600" />
          <div>
            <h2 className="text-base font-bold text-slate-900">2. Project Scope & Progress Breakdown</h2>
            <p className="text-xs text-slate-500">
              Itemized scope activities, contract values, weightages, and progress valuation
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {fields.length} {fields.length === 1 ? 'Activity' : 'Activities'}
          </span>

          <button
            type="button"
            onClick={handleAddRow}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-xs transition-colors focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Activity
          </button>

          <button
            type="button"
            onClick={() => handleAddMultipleRows(5)}
            className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors focus:outline-none"
            title="Add 5 empty scope rows at once"
          >
            <Plus className="w-3 h-3 mr-1" />
            +5 Rows
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

      {/* Search & Filter Bar (when 5+ rows exist) */}
      {fields.length >= 5 && (
        <div className="flex items-center justify-between gap-3 text-xs bg-slate-50 p-2 rounded-lg border border-slate-200">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter activities by description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs py-1.5 pl-8 pr-3 rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          {searchTerm && (
            <div className="text-slate-500">
              Showing {visibleIndices.length} of {fields.length} rows
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="ml-2 text-blue-600 hover:underline"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>
      )}

      {/* Scope Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 max-h-[600px] overflow-y-auto relative shadow-2xs">
        <table className="min-w-full divide-y divide-slate-200 text-xs">
          <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0 z-10 shadow-2xs">
            <tr>
              <th scope="col" className="py-2.5 px-2 text-center w-12 bg-slate-100">#</th>
              <th scope="col" className="py-2.5 px-3 text-left min-w-[200px] bg-slate-100">
                Scope Description <span className="text-rose-500">*</span>
              </th>
              <th scope="col" className="py-2.5 px-3 text-right min-w-[130px] bg-slate-100">
                Scope Amount ({currency}) <span className="text-rose-500">*</span>
              </th>
              <th scope="col" className="py-2.5 px-3 text-right min-w-[110px] bg-slate-100">
                Physical % (0-100) <span className="text-rose-500">*</span>
              </th>
              <th scope="col" className="py-2.5 px-3 text-right bg-slate-200/70 min-w-[90px] text-slate-700">
                Weightage
              </th>
              <th scope="col" className="py-2.5 px-3 text-right bg-blue-100/70 min-w-[95px] text-blue-800 font-bold">
                Net Progress
              </th>
              <th scope="col" className="py-2.5 px-3 text-right bg-slate-200/70 min-w-[120px] text-slate-800">
                Progress Value ({currency})
              </th>
              <th scope="col" className="py-2.5 px-2 text-center w-24 bg-slate-100">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {visibleIndices.map((index) => {
              const field = fields[index];
              if (!field) return null;

              const calcItem: CalculatedScopeItem | undefined = calculations.calculatedScopes[index];
              const fieldError = errors.scopeItems?.[index];

              return (
                <tr key={field.id} className="hover:bg-blue-50/40 transition-colors">
                  {/* Row index */}
                  <td className="py-2 px-2 text-center font-mono text-slate-400 font-medium">
                    {index + 1}
                  </td>

                  {/* Description input */}
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      placeholder="e.g. Site Civil Foundation"
                      {...register(`scopeItems.${index}.description` as const)}
                      className={`w-full text-xs py-1.5 px-2.5 rounded border transition-colors focus:outline-none focus:ring-2 ${
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
                      className={`w-full text-xs py-1.5 px-2.5 text-right font-mono rounded border transition-colors focus:outline-none focus:ring-2 ${
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
                      className={`w-full text-xs py-1.5 px-2.5 text-right font-mono rounded border transition-colors focus:outline-none focus:ring-2 ${
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
                  <td className="py-2 px-3 text-right font-mono text-slate-700 bg-slate-50/60">
                    {formatPercent(calcItem?.activityWeightage, 2)}
                  </td>

                  {/* Calculated Net Progress */}
                  <td className="py-2 px-3 text-right font-mono font-bold text-blue-700 bg-blue-50/50">
                    {formatPercent(calcItem?.netProgress, 2)}
                  </td>

                  {/* Calculated Progress Value */}
                  <td className="py-2 px-3 text-right font-mono font-medium text-slate-800 bg-slate-50/60">
                    {formatNumberWithCommas(calcItem?.progressValue)}
                  </td>

                  {/* Actions: Move Up, Move Down, Duplicate, Delete */}
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
                        onClick={() => handleDuplicateRow(index)}
                        title="Duplicate Row"
                        className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
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

          {/* Table Summary Row */}
          <tfoot className="bg-blue-50/90 font-bold border-t-2 border-blue-200 text-slate-900 sticky bottom-0 z-10 shadow-2xs">
            <tr>
              <td colSpan={2} className="py-3 px-3 text-left text-xs text-blue-950 font-extrabold uppercase tracking-wider">
                Total Summary ({fields.length} {fields.length === 1 ? 'Activity' : 'Activities'})
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
    </section>
  );
};
