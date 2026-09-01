import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProjectFormData, ProjectFormSchema } from './types';
import {
  INITIAL_DEMO_DATA,
  GHAZLAN_EXAMPLE_DATA,
  LARGE_20_ROW_EXAMPLE_DATA,
  EMPTY_FORM_DATA,
} from './utils/defaults';
import { calculateProjectMetrics } from './utils/calculations';
import { loadDraftFromStorage, saveDraftToStorage, clearDraftFromStorage } from './utils/storage';
import { Header } from './components/Header';
import { ProjectInfoForm } from './components/ProjectInfoForm';
import { ScopeTableForm } from './components/ScopeTableForm';
import { AnalyticsSection } from './components/AnalyticsSection';
import { PdfPreviewPanel } from './components/PdfPreviewPanel';
import { Check, Info } from 'lucide-react';

export const App: React.FC = () => {
  const [saveStatus, setSaveStatus] = useState<string>('Draft Saved Locally');

  const initialValues = useMemo(() => {
    return loadDraftFromStorage();
  }, []);

  const prevSavedDataRef = useRef<string>(JSON.stringify(initialValues));

  const {
    register,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: initialValues,
    mode: 'onChange',
  });

  const fieldArray = useFieldArray({
    control,
    name: 'scopeItems',
  });

  const watchedData = useWatch({ control });
  const formData: ProjectFormData = (watchedData as ProjectFormData) || initialValues;

  // Compute live calculations memoized from semantic form data
  const calculations = useMemo(() => {
    return calculateProjectMetrics(formData);
  }, [formData]);

  // Auto-save draft to local storage only when semantic form values change
  useEffect(() => {
    const currentSerialized = JSON.stringify(formData);
    if (currentSerialized === prevSavedDataRef.current) {
      return;
    }
    prevSavedDataRef.current = currentSerialized;
    setSaveStatus('Saving...');
    const timer = setTimeout(() => {
      saveDraftToStorage(formData);
      setSaveStatus('Draft Saved Locally');
    }, 400);
    return () => clearTimeout(timer);
  }, [formData]);

  const handleLoadExample = () => {
    prevSavedDataRef.current = JSON.stringify(GHAZLAN_EXAMPLE_DATA);
    reset(GHAZLAN_EXAMPLE_DATA);
    saveDraftToStorage(GHAZLAN_EXAMPLE_DATA);
    setSaveStatus('Draft Saved Locally');
  };

  const handleLoadLargeExample = () => {
    prevSavedDataRef.current = JSON.stringify(LARGE_20_ROW_EXAMPLE_DATA);
    reset(LARGE_20_ROW_EXAMPLE_DATA);
    saveDraftToStorage(LARGE_20_ROW_EXAMPLE_DATA);
    setSaveStatus('Draft Saved Locally');
  };

  const handleResetDefault = () => {
    prevSavedDataRef.current = JSON.stringify(INITIAL_DEMO_DATA);
    reset(INITIAL_DEMO_DATA);
    saveDraftToStorage(INITIAL_DEMO_DATA);
    setSaveStatus('Draft Saved Locally');
  };

  const handleClearAll = () => {
    prevSavedDataRef.current = JSON.stringify(EMPTY_FORM_DATA);
    reset(EMPTY_FORM_DATA);
    clearDraftFromStorage();
    setSaveStatus('Draft Saved Locally');
  };

  const handleToggleReconciliationNote = (val: boolean) => {
    setValue('showReconciliationNote', val, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="min-h-screen bg-slate-100/90 flex flex-col font-sans text-slate-900">
      {/* Top Header */}
      <Header
        onLoadExample={handleLoadExample}
        onLoadLargeExample={handleLoadLargeExample}
        onResetDefault={handleResetDefault}
        onClearAll={handleClearAll}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Status indicator bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium text-slate-700">{saveStatus}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-400">
            <Info className="w-3.5 h-3.5" />
            <span>All entries remain strictly on your local browser. No server storage or network transmission.</span>
          </div>
        </div>

        {/* Responsive Grid: Side-by-Side on XL, Stacked on Mobile/Tablet */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Left / Top: Data Entry & Analytics Forms (7 cols on XL) */}
          <div className="xl:col-span-7 space-y-6">
            {/* 1. Project Info */}
            <ProjectInfoForm
              register={register}
              errors={errors}
              watch={watch}
              calculations={calculations}
            />

            {/* 2. Analytics & Valuation Insights */}
            <AnalyticsSection
              calculations={calculations}
              currency={formData.currency || 'SAR'}
              projectName={formData.projectName || ''}
            />

            {/* 3. Scope Table */}
            <ScopeTableForm
              register={register}
              errors={errors}
              watch={watch}
              fieldArray={fieldArray}
              calculations={calculations}
              onToggleReconciliationNote={handleToggleReconciliationNote}
            />
          </div>

          {/* Right / Bottom: PDF Preview & Download (5 cols on XL) */}
          <div className="xl:col-span-5 xl:sticky xl:top-4 xl:max-h-[calc(100vh-2rem)] flex flex-col">
            <PdfPreviewPanel
              data={formData}
              calculations={calculations}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <p>
          &copy; 2026 KAYAN CAPITAL HOLDINGS &bull; Progress Report PDF Generator &bull; Multi-Page & Analytics
        </p>
      </footer>
    </div>
  );
};

export default App;
