import { ProjectFormData, ProjectCalculations, CalculatedScopeItem, ScopeItem } from '../types';

export function parseDateToUTC(dateStr: string): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const parts = dateStr.trim().split('-');
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  return new Date(Date.UTC(year, month, day));
}

export function formatDateDDMMMYY(dateStr: string): string {
  const d = parseDateToUTC(dateStr);
  if (!d || isNaN(d.getTime())) return dateStr || '—';
  const day = String(d.getUTCDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[d.getUTCMonth()];
  const year = String(d.getUTCFullYear()).slice(-2);
  return `${day}-${month}-${year}`;
}

export function formatCurrency(amount: number | null | undefined, currency: string = 'SAR'): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${currency} 0.00`;
  }
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${currency} ${formatted}`;
}

export function formatNumberWithCommas(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return '0.00';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercent(decimalValue: number | null | undefined, decimals: number = 2): string {
  if (decimalValue === null || decimalValue === undefined || isNaN(decimalValue)) {
    return '0.00%';
  }
  const percent = decimalValue * 100;
  return `${percent.toFixed(decimals)}%`;
}

export function sanitizeFilename(projectName: string, reportDate: string): string {
  const cleanName = (projectName || 'Project')
    .trim()
    .replace(/[/\\?%*:|"<>]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_');
  const cleanDate = (reportDate || 'Report_Date')
    .trim()
    .replace(/[/\\?%*:|"<>]/g, '-');
  return `Progress_Report_${cleanName}_${cleanDate}.pdf`;
}

export function calculateProjectMetrics(data: ProjectFormData): ProjectCalculations {
  const validationErrors: string[] = [];

  // 1. Calculate project duration (inclusive: end - start + 1)
  let projectDuration = 0;
  const startDate = parseDateToUTC(data.projectStartDate);
  const endDate = parseDateToUTC(data.projectEndDate);
  const reportDate = parseDateToUTC(data.reportDate);

  if (startDate && endDate) {
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      validationErrors.push('Project end date cannot be earlier than project start date.');
    } else {
      projectDuration = diffDays + 1;
    }
  }

  // 2. Calculate Day number as of selected reportDate
  let dayNumber: number | null = null;
  let dayNumberDisplay = '—';
  let dayNumberStatus: 'before' | 'during' | 'past_due' | 'invalid' = 'invalid';

  if (startDate && endDate && reportDate) {
    if (reportDate.getTime() < startDate.getTime()) {
      dayNumberStatus = 'before';
      dayNumberDisplay = '—';
    } else if (reportDate.getTime() > endDate.getTime()) {
      dayNumberStatus = 'past_due';
      dayNumberDisplay = 'Past due';
    } else {
      const diffTime = reportDate.getTime() - startDate.getTime();
      const currentDay = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
      dayNumber = currentDay;
      dayNumberStatus = 'during';
      dayNumberDisplay = `${currentDay} Days`;
    }
  }

  // 3. Project amount validation
  const projectAmount = Number(data.projectAmount) || 0;
  if (projectAmount <= 0) {
    validationErrors.push('Project amount must be greater than zero.');
  }

  // 4. Calculate scope rows
  const scopeItems = (data.scopeItems || []).filter((item) => (item.description || '').trim() !== '' || Number(item.scopeAmount) > 0);
  
  let totalScopeAmount = 0;
  let totalCalculatedWeightage = 0;
  let overallProgress = 0;
  let totalProgressValue = 0;

  const calculatedScopes: CalculatedScopeItem[] = scopeItems.map((item: ScopeItem) => {
    const scopeAmount = Number(item.scopeAmount) || 0;
    const physicalCompletionPercent = Number(item.physicalCompletion) || 0;
    const physicalCompletionDecimal = physicalCompletionPercent / 100;

    // Weightage = scope amount / project amount (unrounded)
    const activityWeightage = projectAmount > 0 ? scopeAmount / projectAmount : 0;
    // Net progress = weightage * physical completion (unrounded)
    const netProgress = activityWeightage * physicalCompletionDecimal;
    // Progress value = scope amount * physical completion (unrounded)
    const progressValue = scopeAmount * physicalCompletionDecimal;

    totalScopeAmount += scopeAmount;
    totalCalculatedWeightage += activityWeightage;
    overallProgress += netProgress;
    totalProgressValue += progressValue;

    return {
      ...item,
      scopeAmount,
      physicalCompletion: physicalCompletionPercent,
      activityWeightage,
      netProgress,
      progressValue,
    };
  });

  // Discrepancy checks
  const discrepancyAmount = totalScopeAmount - projectAmount;
  const isDiscrepancy = projectAmount > 0 && Math.abs(discrepancyAmount) > 0.009;
  const weightageDiscrepancyPercent = totalCalculatedWeightage * 100;

  // Percentage & overall bounds validation
  if (overallProgress > 1.000001) {
    validationErrors.push(`Overall project progress (${(overallProgress * 100).toFixed(2)}%) cannot exceed 100%.`);
  }

  if (scopeItems.length > 8) {
    validationErrors.push('Maximum 8 scope items allowed to ensure an exact 2-page PDF.');
  }

  const canExport = validationErrors.length === 0 && projectAmount > 0 && calculatedScopes.length > 0;

  return {
    projectDuration,
    dayNumberDisplay,
    dayNumber,
    dayNumberStatus,
    calculatedScopes,
    totalScopeAmount,
    totalCalculatedWeightage,
    overallProgress,
    totalProgressValue,
    isDiscrepancy,
    discrepancyAmount,
    weightageDiscrepancyPercent,
    validationErrors,
    canExport,
  };
}
