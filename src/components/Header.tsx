import React from 'react';
import { RefreshCw, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { KAYAN_LOGO_BASE64 } from '../assets/logoBase64';

interface HeaderProps {
  onLoadExample: () => void;
  onResetDefault: () => void;
  onClearAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onLoadExample,
  onResetDefault,
  onClearAll,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs">
            <img
              src={KAYAN_LOGO_BASE64}
              alt="Kayan Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                Progress Report PDF Generator
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              KAYAN CAPITAL HOLDINGS &bull; Two-Page Contractual Progress Valuation
            </p>
          </div>
        </div>

        {/* Action Controls & Privacy Badge */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Privacy badge */}
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Client-Side &bull; Local Only</span>
          </div>

          <button
            type="button"
            onClick={onLoadExample}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 transition-colors focus:ring-2 focus:ring-blue-400 focus:outline-none"
            title="Load reference data from Ghazlan Project example"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
            Load Example
          </button>

          <button
            type="button"
            onClick={onResetDefault}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors focus:ring-2 focus:ring-slate-400 focus:outline-none"
            title="Reset form to default demonstration values"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
            Reset
          </button>

          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors focus:ring-2 focus:ring-rose-400 focus:outline-none"
            title="Clear all form inputs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-rose-600" />
            Clear All
          </button>
        </div>
      </div>
    </header>
  );
};
