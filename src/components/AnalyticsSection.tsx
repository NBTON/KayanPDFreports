import React, { useState } from 'react';
import { PieChart, BarChart3, TrendingUp, DollarSign, Clock, Percent, Layers } from 'lucide-react';
import { ProjectCalculations } from '../types';
import { formatCurrency, formatPercent, formatNumberWithCommas } from '../utils/calculations';

interface AnalyticsSectionProps {
  calculations: ProjectCalculations;
  currency: string;
  projectName: string;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  calculations,
  currency,
  projectName: _projectName,
}) => {
  const [activeTab, setActiveTab] = useState<'donut' | 'bars'>('donut');
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  const { analytics, totalScopeAmount, overallProgress, totalProgressValue } = calculations;
  const { donutSlices, barMetrics, remainingValue, elapsedDays, totalDays, elapsedPercentage } = analytics;

  const hasData = donutSlices.length > 0 && totalScopeAmount > 0;

  return (
    <section className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-5">
      {/* Section Header */}
      <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <div>
            <h2 className="text-base font-bold text-slate-900">Project Analytics & Valuation Insights</h2>
            <p className="text-xs text-slate-500">Executive financial & physical progress distribution</p>
          </div>
        </div>

        {/* Chart View Toggle */}
        {hasData && (
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('donut')}
              className={`inline-flex items-center px-2.5 py-1 rounded-md font-medium transition-all ${
                activeTab === 'donut'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PieChart className="w-3.5 h-3.5 mr-1" />
              Weightage Donut
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('bars')}
              className={`inline-flex items-center px-2.5 py-1 rounded-md font-medium transition-all ${
                activeTab === 'bars'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 mr-1" />
              Progress Value Bars
            </button>
          </div>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Progress Value (Earned Value) */}
        <div className="bg-gradient-to-br from-blue-50/90 to-indigo-50/50 border border-blue-200/80 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-700">
            <span className="text-xs font-bold uppercase tracking-wider">Earned Valuation</span>
            <div className="p-1.5 bg-blue-100/80 rounded-lg">
              <DollarSign className="w-4 h-4 text-blue-700" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-base sm:text-lg font-extrabold text-blue-950 font-mono">
              {formatCurrency(totalProgressValue, currency)}
            </div>
            <div className="text-[11px] text-blue-700 font-medium mt-0.5">
              {formatPercent(overallProgress, 2)} of contract value
            </div>
          </div>
        </div>

        {/* Remaining Contract Balance */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100/60 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-xs font-bold uppercase tracking-wider">Remaining Balance</span>
            <div className="p-1.5 bg-slate-200/70 rounded-lg">
              <DollarSign className="w-4 h-4 text-slate-600" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-base sm:text-lg font-extrabold text-slate-800 font-mono">
              {formatCurrency(remainingValue, currency)}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">
              {formatPercent(Math.max(1 - overallProgress, 0), 2)} unearned balance
            </div>
          </div>
        </div>

        {/* Overall Completion Rate */}
        <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/40 border border-emerald-200/80 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-xs font-bold uppercase tracking-wider">Net Progress</span>
            <div className="p-1.5 bg-emerald-100 rounded-lg">
              <Percent className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-base sm:text-lg font-extrabold text-emerald-950 font-mono">
              {formatPercent(overallProgress, 2)}
            </div>
            <div className="w-full bg-emerald-200/60 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(overallProgress * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Schedule Timeline Status */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100/60 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-xs font-bold uppercase tracking-wider">Timeline Elapsed</span>
            <div className="p-1.5 bg-slate-200/70 rounded-lg">
              <Clock className="w-4 h-4 text-slate-600" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-base sm:text-lg font-extrabold text-slate-800 font-mono">
              {elapsedDays} / {totalDays} <span className="text-xs font-normal text-slate-500">Days</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">
              {elapsedPercentage.toFixed(1)}% duration elapsed
            </div>
          </div>
        </div>
      </div>

      {/* Chart Visualization Area */}
      {!hasData ? (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-600">No Scope Data Available for Visualization</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Add scope activities with contract amounts to view the interactive breakdown charts.
          </p>
        </div>
      ) : activeTab === 'donut' ? (
        /* Donut Chart View */
        <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 sm:p-6 flex flex-col md:flex-row items-center justify-around gap-6">
          {/* SVG Donut Chart */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg
              viewBox="0 0 200 200"
              className="w-48 h-48 sm:w-56 sm:h-56 transform -rotate-90 filter drop-shadow-xs"
            >
              {donutSlices.map((slice, idx) => (
                <path
                  key={idx}
                  d={slice.pathD}
                  fill={slice.color}
                  className="transition-all duration-200 cursor-pointer hover:opacity-90"
                  style={{
                    transformOrigin: '100px 100px',
                    transform: hoveredSlice === idx ? 'scale(1.04)' : 'scale(1)',
                  }}
                  onMouseEnter={() => setHoveredSlice(idx)}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              ))}
            </svg>

            {/* Donut Center Information */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {hoveredSlice !== null ? 'Selected Activity' : 'Total Scope'}
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 font-mono">
                {hoveredSlice !== null
                  ? formatCurrency(donutSlices[hoveredSlice]?.value, currency)
                  : formatCurrency(totalScopeAmount, currency)}
              </span>
              <span className="text-[10px] font-semibold text-blue-600">
                {hoveredSlice !== null
                  ? `${donutSlices[hoveredSlice]?.percentage.toFixed(1)}% weight`
                  : `${donutSlices.length} ${donutSlices.length === 1 ? 'Activity' : 'Activities'}`}
              </span>
            </div>
          </div>

          {/* Interactive Legend */}
          <div className="flex-1 w-full max-w-md space-y-2">
            <div className="text-xs font-bold text-slate-700 pb-1 border-b border-slate-200 flex items-center justify-between">
              <span>Scope Activity Breakdown</span>
              <span>Weightage Share</span>
            </div>
            <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
              {donutSlices.map((slice, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredSlice(idx)}
                  onMouseLeave={() => setHoveredSlice(null)}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                    hoveredSlice === idx ? 'bg-blue-100/70' : 'bg-white hover:bg-slate-100/80'
                  } border border-slate-200/80`}
                >
                  <div className="flex items-center space-x-2 truncate pr-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: slice.color }}
                    />
                    <span className="font-semibold text-slate-800 truncate" title={slice.label}>
                      {slice.label}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-slate-900">
                      {slice.percentage.toFixed(2)}%
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {formatNumberWithCommas(slice.value)} {currency}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Progress Value Bars View */
        <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3">
          <div className="text-xs font-bold text-slate-700 pb-1 border-b border-slate-200 flex items-center justify-between">
            <span>Activity Execution & Earned Valuation</span>
            <span>Completion & Value</span>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {barMetrics.map((item, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 font-semibold text-slate-800 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate" title={item.label}>
                      {item.label}
                    </span>
                  </div>
                  <div className="text-right font-mono font-bold text-blue-700">
                    {item.physicalCompletion.toFixed(1)}%
                  </div>
                </div>

                {/* Dual Visual Bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(item.physicalCompletion, 100)}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-0.5">
                  <span>Earned: {formatCurrency(item.progressValue, currency)}</span>
                  <span>Scope: {formatCurrency(item.scopeAmount, currency)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
