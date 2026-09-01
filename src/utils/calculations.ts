import {
  ProjectFormData,
  ProjectCalculations,
  CalculatedScopeItem,
  ScopeItem,
  AnalyticsData,
  DonutSlice,
  BarMetric,
} from '../types';

export const CHART_COLORS: string[] = [
  '#2563EB', // Royal Blue
  '#0D9488', // Teal
  '#D97706', // Amber
  '#7C3AED', // Purple
  '#E11D48', // Rose
  '#059669', // Emerald
  '#4F46E5', // Indigo
  '#EA580C', // Orange
  '#0891B2', // Cyan
  '#9333EA', // Violet
  '#64748B', // Slate
];

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

export function calculateDonutSlices(
  items: CalculatedScopeItem[],
  totalAmount: number,
  cx: number = 100,
  cy: number = 100,
  outerRadius: number = 80,
  innerRadius: number = 50
): DonutSlice[] {
  if (!items || items.length === 0 || totalAmount <= 0) {
    return [];
  }

  let currentAngle = 0;
  const slices: DonutSlice[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const amount = Math.max(item.scopeAmount, 0);
    const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
    const sliceAngle = totalAmount > 0 ? (amount / totalAmount) * 2 * Math.PI : 0;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    const color = CHART_COLORS[i % CHART_COLORS.length];

    let pathD = '';
    if (percentage >= 99.999 || items.length === 1) {
      // Full circle ring path
      pathD = `M ${cx - outerRadius} ${cy} A ${outerRadius} ${outerRadius} 0 1 0 ${cx + outerRadius} ${cy} A ${outerRadius} ${outerRadius} 0 1 0 ${cx - outerRadius} ${cy} M ${cx - innerRadius} ${cy} A ${innerRadius} ${innerRadius} 0 1 1 ${cx + innerRadius} ${cy} A ${innerRadius} ${innerRadius} 0 1 1 ${cx - innerRadius} ${cy} Z`;
    } else if (sliceAngle > 0.001) {
      const x1_out = cx + outerRadius * Math.sin(startAngle);
      const y1_out = cy - outerRadius * Math.cos(startAngle);
      const x2_out = cx + outerRadius * Math.sin(endAngle);
      const y2_out = cy - outerRadius * Math.cos(endAngle);

      const x2_in = cx + innerRadius * Math.sin(endAngle);
      const y2_in = cy - innerRadius * Math.cos(endAngle);
      const x1_in = cx + innerRadius * Math.sin(startAngle);
      const y1_in = cy - innerRadius * Math.cos(startAngle);

      const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

      pathD = `M ${x1_out.toFixed(2)} ${y1_out.toFixed(2)} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2_out.toFixed(2)} ${y2_out.toFixed(2)} L ${x2_in.toFixed(2)} ${y2_in.toFixed(2)} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1_in.toFixed(2)} ${y1_in.toFixed(2)} Z`;
    }

    slices.push({
      label: item.description || `Activity ${i + 1}`,
      value: amount,
      percentage,
      color,
      startAngle,
      endAngle,
      pathD,
    });

    currentAngle = endAngle;
  }

  return slices;
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
  const scopeItems = (data.scopeItems || []).filter(
    (item) => (item.description || '').trim() !== '' || Number(item.scopeAmount) > 0
  );

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

  const canExport = validationErrors.length === 0 && projectAmount > 0 && calculatedScopes.length > 0;

  // 5. Calculate Analytics & Chart Metrics
  const donutSlices = calculateDonutSlices(calculatedScopes, totalScopeAmount);
  const barMetrics: BarMetric[] = calculatedScopes.map((scope, idx) => ({
    label: scope.description || `Activity ${idx + 1}`,
    scopeAmount: scope.scopeAmount,
    progressValue: scope.progressValue,
    physicalCompletion: scope.physicalCompletion,
    activityWeightage: scope.activityWeightage,
    color: CHART_COLORS[idx % CHART_COLORS.length],
  }));

  const remainingValue = Math.max(projectAmount - totalProgressValue, 0);

  let elapsedDays = 0;
  if (dayNumberStatus === 'during' && dayNumber !== null) {
    elapsedDays = dayNumber;
  } else if (dayNumberStatus === 'past_due' && projectDuration > 0) {
    elapsedDays = projectDuration;
  }

  const totalDays = projectDuration || 1;
  const elapsedPercentage = projectDuration > 0 ? Math.min(Math.max((elapsedDays / projectDuration) * 100, 0), 100) : 0;
  const schedulePerformanceIndex = elapsedPercentage > 0 ? (overallProgress * 100) / elapsedPercentage : null;

  const topActivities = [...calculatedScopes].sort((a, b) => b.scopeAmount - a.scopeAmount).slice(0, 5);

  const analytics: AnalyticsData = {
    donutSlices,
    barMetrics,
    totalScopeAmount,
    totalProgressValue,
    remainingValue,
    overallProgress,
    elapsedDays,
    totalDays,
    elapsedPercentage,
    schedulePerformanceIndex,
    topActivities,
  };

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
    analytics,
  };
}

