import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { Building2, Calendar, FileText, User, DollarSign, Clock, Shield } from 'lucide-react';
import { ProjectFormData, ProjectCalculations } from '../types';
import { formatCurrency, formatPercent } from '../utils/calculations';

interface ProjectInfoFormProps {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
  watch: UseFormWatch<ProjectFormData>;
  calculations: ProjectCalculations;
}

export const ProjectInfoForm: React.FC<ProjectInfoFormProps> = ({
  register,
  errors,
  watch,
  calculations,
}) => {
  const currency = watch('currency') || 'SAR';

  return (
    <section className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-5">
      {/* Section Header */}
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          <div>
            <h2 className="text-base font-bold text-slate-900">1. Project Information</h2>
            <p className="text-xs text-slate-500">Executive baseline details & timeline parameters</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          Executive Header
        </span>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Report Date */}
        <div>
          <label htmlFor="reportDate" className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Report Date <span className="text-rose-500">*</span></span>
          </label>
          <input
            id="reportDate"
            type="date"
            {...register('reportDate')}
            className={`w-full rounded-lg text-xs py-2 px-3 border transition-colors focus:outline-none focus:ring-2 ${
              errors.reportDate
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />
          {errors.reportDate && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.reportDate.message}</p>
          )}
        </div>

        {/* Project Name */}
        <div className="sm:col-span-2">
          <label htmlFor="projectName" className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Project Name <span className="text-rose-500">*</span></span>
          </label>
          <input
            id="projectName"
            type="text"
            placeholder="e.g. GHEZLAN Project"
            {...register('projectName')}
            className={`w-full rounded-lg text-xs py-2 px-3 border transition-colors focus:outline-none focus:ring-2 ${
              errors.projectName
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />
          {errors.projectName && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.projectName.message}</p>
          )}
        </div>

        {/* Client */}
        <div>
          <label htmlFor="client" className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>Client <span className="text-rose-500">*</span></span>
          </label>
          <input
            id="client"
            type="text"
            placeholder="e.g. AL ZAMIL"
            {...register('client')}
            className={`w-full rounded-lg text-xs py-2 px-3 border transition-colors focus:outline-none focus:ring-2 ${
              errors.client
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />
          {errors.client && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.client.message}</p>
          )}
        </div>

        {/* Contractor */}
        <div>
          <label htmlFor="contractor" className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
            <Shield className="w-3.5 h-3.5 text-slate-500" />
            <span>Contractor <span className="text-rose-500">*</span></span>
          </label>
          <input
            id="contractor"
            type="text"
            placeholder="e.g. KAYAN CAPITAL HOLDINGS"
            {...register('contractor')}
            className={`w-full rounded-lg text-xs py-2 px-3 border transition-colors focus:outline-none focus:ring-2 ${
              errors.contractor
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />
          {errors.contractor && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.contractor.message}</p>
          )}
        </div>

        {/* PO Number */}
        <div>
          <label htmlFor="poNumber" className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>PO Number <span className="text-rose-500">*</span></span>
          </label>
          <input
            id="poNumber"
            type="text"
            placeholder="e.g. HSP-PO-46319 (Revision 0)"
            {...register('poNumber')}
            className={`w-full rounded-lg text-xs py-2 px-3 border transition-colors focus:outline-none focus:ring-2 ${
              errors.poNumber
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />
          {errors.poNumber && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.poNumber.message}</p>
          )}
        </div>

        {/* Project Start Date */}
        <div>
          <label htmlFor="projectStartDate" className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Project Start Date <span className="text-rose-500">*</span></span>
          </label>
          <input
            id="projectStartDate"
            type="date"
            {...register('projectStartDate')}
            className={`w-full rounded-lg text-xs py-2 px-3 border transition-colors focus:outline-none focus:ring-2 ${
              errors.projectStartDate
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />
          {errors.projectStartDate && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.projectStartDate.message}</p>
          )}
        </div>

        {/* Project End Date */}
        <div>
          <label htmlFor="projectEndDate" className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Project End Date <span className="text-rose-500">*</span></span>
          </label>
          <input
            id="projectEndDate"
            type="date"
            {...register('projectEndDate')}
            className={`w-full rounded-lg text-xs py-2 px-3 border transition-colors focus:outline-none focus:ring-2 ${
              errors.projectEndDate
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />
          {errors.projectEndDate && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.projectEndDate.message}</p>
          )}
        </div>

        {/* Project Leader */}
        <div>
          <label htmlFor="projectLeader" className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>Project Leader <span className="text-rose-500">*</span></span>
          </label>
          <input
            id="projectLeader"
            type="text"
            placeholder="e.g. ERFAN AHMAD"
            {...register('projectLeader')}
            className={`w-full rounded-lg text-xs py-2 px-3 border transition-colors focus:outline-none focus:ring-2 ${
              errors.projectLeader
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />
          {errors.projectLeader && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.projectLeader.message}</p>
          )}
        </div>

        {/* Project Contract Amount */}
        <div className="sm:col-span-2">
          <label htmlFor="projectAmount" className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
            <DollarSign className="w-3.5 h-3.5 text-blue-600" />
            <span>Project Amount (Authoritative Contract Value) <span className="text-rose-500">*</span></span>
          </label>
          <div className="relative flex rounded-lg shadow-2xs">
            <input
              id="projectAmount"
              type="number"
              step="any"
              placeholder="1292000.00"
              {...register('projectAmount', { valueAsNumber: true })}
              className={`w-full rounded-l-lg text-xs py-2 px-3 border transition-colors focus:outline-none focus:ring-2 font-mono ${
                errors.projectAmount
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
            <span className="inline-flex items-center px-3.5 rounded-r-lg border border-l-0 border-slate-300 bg-slate-50 text-slate-700 text-xs font-bold font-mono">
              {currency}
            </span>
          </div>
          {errors.projectAmount && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.projectAmount.message}</p>
          )}
        </div>

        {/* Currency Selector */}
        <div>
          <label htmlFor="currency" className="block text-xs font-semibold text-slate-700 mb-1">
            Currency
          </label>
          <select
            id="currency"
            {...register('currency')}
            className="w-full rounded-lg text-xs py-2 px-3 border border-slate-300 bg-white font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
          >
            <option value="SAR">SAR (Saudi Riyal)</option>
            <option value="USD">USD (US Dollar)</option>
            <option value="EUR">EUR (Euro)</option>
            <option value="AED">AED (UAE Dirham)</option>
            <option value="QAR">QAR (Qatari Riyal)</option>
            <option value="KWD">KWD (Kuwaiti Dinar)</option>
            <option value="BHD">BHD (Bahraini Dinar)</option>
            <option value="OMR">OMR (Omani Rial)</option>
          </select>
        </div>
      </div>

      {/* Timeline & Valuation Metrics Preview Cards */}
      <div className="pt-3 border-t border-slate-100">
        <div className="text-xs font-semibold text-slate-500 mb-2.5 flex items-center space-x-1.5">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>Timeline & Valuation Status</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Project Duration */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-[11px] text-slate-500 font-medium">Project Duration</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {calculations.projectDuration ? `${calculations.projectDuration} Days` : '—'}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Inclusive (End - Start + 1)</div>
          </div>

          {/* Day Number */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-[11px] text-slate-500 font-medium">Timeline Day</div>
            <div
              className={`text-sm font-bold mt-0.5 ${
                calculations.dayNumberStatus === 'past_due'
                  ? 'text-amber-600'
                  : calculations.dayNumberStatus === 'before'
                  ? 'text-slate-400'
                  : 'text-slate-900'
              }`}
            >
              {calculations.dayNumberDisplay}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">As of Selected Report Date</div>
          </div>

          {/* Overall Progress */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3">
            <div className="text-[11px] text-blue-700 font-medium">Net Progress</div>
            <div className="text-sm font-bold text-blue-900 mt-0.5 font-mono">
              {formatPercent(calculations.overallProgress, 2)}
            </div>
            <div className="text-[10px] text-blue-600 mt-1">Sum of Scope Net %</div>
          </div>

          {/* Total Progress Value */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3">
            <div className="text-[11px] text-blue-700 font-medium">Earned Valuation</div>
            <div
              className="text-sm font-bold text-blue-900 mt-0.5 font-mono truncate"
              title={formatCurrency(calculations.totalProgressValue, currency)}
            >
              {formatCurrency(calculations.totalProgressValue, currency)}
            </div>
            <div className="text-[10px] text-blue-600 mt-1">Sum of Progress Values</div>
          </div>
        </div>
      </div>
    </section>
  );
};
