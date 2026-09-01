import { describe, it, expect } from 'vitest';
import {
  calculateProjectMetrics,
  calculateDonutSlices,
  formatDateDDMMMYY,
  formatCurrency,
  formatPercent,
  sanitizeFilename,
} from '../utils/calculations';
import { GHAZLAN_EXAMPLE_DATA, INITIAL_DEMO_DATA, LARGE_20_ROW_EXAMPLE_DATA, EMPTY_FORM_DATA } from '../utils/defaults';
import { ProjectFormData } from '../types';

describe('Project Calculations & Valuation Logic', () => {
  describe('Inclusive Project Duration & Day Number', () => {
    it('calculates inclusive project duration correctly (end - start + 1)', () => {
      // 2026-06-30 to 2026-11-30 is 154 days inclusive
      const metrics = calculateProjectMetrics(GHAZLAN_EXAMPLE_DATA);
      expect(metrics.projectDuration).toBe(154);
    });

    it('handles same day start and end as 1 day', () => {
      const data: ProjectFormData = {
        ...INITIAL_DEMO_DATA,
        projectStartDate: '2026-08-01',
        projectEndDate: '2026-08-01',
      };
      const metrics = calculateProjectMetrics(data);
      expect(metrics.projectDuration).toBe(1);
    });

    it('returns "—" when report date is before project start date', () => {
      const data: ProjectFormData = {
        ...GHAZLAN_EXAMPLE_DATA,
        reportDate: '2026-06-01', // Before 2026-06-30
      };
      const metrics = calculateProjectMetrics(data);
      expect(metrics.dayNumberStatus).toBe('before');
      expect(metrics.dayNumberDisplay).toBe('—');
    });

    it('calculates day number correctly when report date is within project duration', () => {
      const data: ProjectFormData = {
        ...GHAZLAN_EXAMPLE_DATA,
        reportDate: '2026-08-06',
      };
      const metrics = calculateProjectMetrics(data);
      expect(metrics.dayNumberStatus).toBe('during');
      expect(metrics.dayNumber).toBe(38);
      expect(metrics.dayNumberDisplay).toBe('38 Days');
    });

    it('returns "Past due" when report date is after project end date', () => {
      const data: ProjectFormData = {
        ...GHAZLAN_EXAMPLE_DATA,
        reportDate: '2026-12-15', // After 2026-11-30
      };
      const metrics = calculateProjectMetrics(data);
      expect(metrics.dayNumberStatus).toBe('past_due');
      expect(metrics.dayNumberDisplay).toBe('Past due');
    });

    it('flags validation error if end date is earlier than start date', () => {
      const data: ProjectFormData = {
        ...INITIAL_DEMO_DATA,
        projectStartDate: '2026-12-31',
        projectEndDate: '2026-01-01',
      };
      const metrics = calculateProjectMetrics(data);
      expect(metrics.validationErrors).toContain('Project end date cannot be earlier than project start date.');
      expect(metrics.canExport).toBe(false);
    });
  });

  describe('Scope Row Calculations & Analytics', () => {
    it('calculates Ghazlan reference workbook formulas without intermediate rounding', () => {
      const metrics = calculateProjectMetrics(GHAZLAN_EXAMPLE_DATA);

      expect(metrics.calculatedScopes).toHaveLength(4);

      // Row 1: FA GENERAL
      const row1 = metrics.calculatedScopes[0];
      expect(row1.description).toBe('FA GENERAL');
      expect(row1.scopeAmount).toBe(287524.10);
      expect(row1.activityWeightage).toBeCloseTo(0.222541873, 6);
      expect(row1.netProgress).toBeCloseTo(0.0767769, 5);
      expect(row1.progressValue).toBeCloseTo(99195.81, 1);

      // Row 4: FAT
      const row4 = metrics.calculatedScopes[3];
      expect(row4.description).toBe('FAT');
      expect(row4.scopeAmount).toBe(92000.00);
      expect(row4.physicalCompletion).toBe(50.0);
      expect(row4.activityWeightage).toBeCloseTo(0.07120743, 6);
      expect(row4.progressValue).toBe(46000.00);
    });

    it('calculates total scope amounts, total weightage, overall progress, and total progress value', () => {
      const metrics = calculateProjectMetrics(GHAZLAN_EXAMPLE_DATA);

      expect(metrics.totalScopeAmount).toBeCloseTo(1294529.94, 2);
      expect(metrics.totalCalculatedWeightage).toBeCloseTo(1.001958, 5);
      expect(metrics.weightageDiscrepancyPercent).toBeCloseTo(100.1958, 3);
      expect(metrics.isDiscrepancy).toBe(true);
      expect(metrics.discrepancyAmount).toBeCloseTo(2529.94, 2);
    });

    it('generates rich analytics metrics for Ghazlan dataset', () => {
      const metrics = calculateProjectMetrics(GHAZLAN_EXAMPLE_DATA);

      expect(metrics.analytics.donutSlices).toHaveLength(4);
      expect(metrics.analytics.barMetrics).toHaveLength(4);
      expect(metrics.analytics.remainingValue).toBeCloseTo(1292000 - metrics.totalProgressValue, 2);
      expect(metrics.analytics.elapsedDays).toBe(38);
      expect(metrics.analytics.totalDays).toBe(154);
      expect(metrics.analytics.elapsedPercentage).toBeCloseTo((38 / 154) * 100, 2);
    });
  });

  describe('Row Limits Removed & Multi-Row Scalability Verification', () => {
    it('handles 0 rows gracefully without errors', () => {
      const data: ProjectFormData = {
        ...EMPTY_FORM_DATA,
        scopeItems: [],
      };
      const metrics = calculateProjectMetrics(data);
      expect(metrics.calculatedScopes).toHaveLength(0);
      expect(metrics.totalScopeAmount).toBe(0);
      expect(metrics.canExport).toBe(false);
      expect(metrics.analytics.donutSlices).toHaveLength(0);
    });

    it('handles 1 row correctly (100% slice rendering)', () => {
      const data: ProjectFormData = {
        ...INITIAL_DEMO_DATA,
        projectAmount: 500000,
        scopeItems: [
          { id: 'single-1', description: 'Turnkey Construction', scopeAmount: 500000, physicalCompletion: 75 },
        ],
      };
      const metrics = calculateProjectMetrics(data);
      expect(metrics.calculatedScopes).toHaveLength(1);
      expect(metrics.canExport).toBe(true);
      expect(metrics.overallProgress).toBeCloseTo(0.75, 4);
      expect(metrics.analytics.donutSlices).toHaveLength(1);
      expect(metrics.analytics.donutSlices[0].percentage).toBe(100);
      expect(metrics.analytics.donutSlices[0].pathD).toContain('A 80 80');
    });

    it('allows 8 rows without error', () => {
      const data: ProjectFormData = {
        ...INITIAL_DEMO_DATA,
        projectAmount: 800000,
        scopeItems: Array.from({ length: 8 }, (_, i) => ({
          id: `s-${i}`,
          description: `Activity ${i + 1}`,
          scopeAmount: 100000,
          physicalCompletion: 50,
        })),
      };
      const metrics = calculateProjectMetrics(data);
      expect(metrics.calculatedScopes).toHaveLength(8);
      expect(metrics.canExport).toBe(true);
      expect(metrics.validationErrors).toHaveLength(0);
    });

    it('allows 9 rows without 8-row rejection or truncation', () => {
      const data: ProjectFormData = {
        ...INITIAL_DEMO_DATA,
        projectAmount: 900000,
        scopeItems: Array.from({ length: 9 }, (_, i) => ({
          id: `s-${i}`,
          description: `Activity ${i + 1}`,
          scopeAmount: 100000,
          physicalCompletion: 50,
        })),
      };
      const metrics = calculateProjectMetrics(data);
      expect(metrics.calculatedScopes).toHaveLength(9);
      expect(metrics.canExport).toBe(true);
      expect(metrics.validationErrors).toHaveLength(0);
    });

    it('allows 20 rows (Large Project)', () => {
      const metrics = calculateProjectMetrics(LARGE_20_ROW_EXAMPLE_DATA);
      expect(metrics.calculatedScopes).toHaveLength(20);
      expect(metrics.canExport).toBe(true);
      expect(metrics.totalScopeAmount).toBe(5100000);
      expect(metrics.analytics.donutSlices).toHaveLength(20);
    });

    it('allows 50+ rows without performance degradation or error', () => {
      const count = 55;
      const data: ProjectFormData = {
        ...INITIAL_DEMO_DATA,
        projectAmount: 5500000,
        scopeItems: Array.from({ length: count }, (_, i) => ({
          id: `mega-${i}`,
          description: `Scope Item Breakdown ${i + 1}`,
          scopeAmount: 100000,
          physicalCompletion: (i * 2) % 100,
        })),
      };
      const metrics = calculateProjectMetrics(data);
      expect(metrics.calculatedScopes).toHaveLength(55);
      expect(metrics.canExport).toBe(true);
      expect(metrics.totalScopeAmount).toBe(5500000);
      expect(metrics.analytics.donutSlices).toHaveLength(55);
    });
  });

  describe('Donut Slice Calculations', () => {
    it('handles empty slices array safely', () => {
      const slices = calculateDonutSlices([], 0);
      expect(slices).toEqual([]);
    });

    it('handles multiple categories with proper angles and arc flags', () => {
      const calculatedScopes = GHAZLAN_EXAMPLE_DATA.scopeItems.map((item) => ({
        ...item,
        activityWeightage: 0.25,
        netProgress: 0.1,
        progressValue: 50000,
      }));
      const totalAmount = 1294529.94;
      const slices = calculateDonutSlices(calculatedScopes, totalAmount);
      expect(slices).toHaveLength(4);
      expect(slices[0].startAngle).toBe(0);
      expect(slices[3].endAngle).toBeCloseTo(2 * Math.PI, 4);
    });
  });

  describe('Formatting & Sanitization Utilities', () => {
    it('formats dates into dd-MMM-yy format', () => {
      expect(formatDateDDMMMYY('2026-06-30')).toBe('30-Jun-26');
      expect(formatDateDDMMMYY('2026-08-06')).toBe('06-Aug-26');
      expect(formatDateDDMMMYY('2026-11-30')).toBe('30-Nov-26');
      expect(formatDateDDMMMYY('')).toBe('—');
    });

    it('formats currencies with comma separators and 2 decimal places', () => {
      expect(formatCurrency(1292000, 'SAR')).toBe('SAR 1,292,000.00');
      expect(formatCurrency(287524.1, 'SAR')).toBe('SAR 287,524.10');
      expect(formatCurrency(0, 'USD')).toBe('USD 0.00');
    });

    it('formats percentages accurately', () => {
      expect(formatPercent(0.272622, 2)).toBe('27.26%');
      expect(formatPercent(1.001958, 2)).toBe('100.20%');
      expect(formatPercent(0.0768, 1)).toBe('7.7%');
    });

    it('sanitizes filenames for Windows, macOS, and Linux compatibility', () => {
      expect(sanitizeFilename('GHEZLAN Project', '2026-08-06')).toBe('Progress_Report_GHEZLAN_Project_2026-08-06.pdf');
      expect(sanitizeFilename('Site / Building: A * Special', '2026-09-01')).toBe('Progress_Report_Site_Building_A_Special_2026-09-01.pdf');
      expect(sanitizeFilename('', '')).toBe('Progress_Report_Project_Report_Date.pdf');
    });
  });
});
