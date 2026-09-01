import { describe, it, expect } from 'vitest';
import {
  calculateProjectMetrics,
  formatDateDDMMMYY,
  formatCurrency,
  formatPercent,
  sanitizeFilename,
} from '../utils/calculations';
import { GHAZLAN_EXAMPLE_DATA, INITIAL_DEMO_DATA } from '../utils/defaults';
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

  describe('Scope Row Calculations: Activity Weightage, Net Progress, Progress Value', () => {
    it('calculates Ghazlan reference workbook formulas without intermediate rounding', () => {
      const metrics = calculateProjectMetrics(GHAZLAN_EXAMPLE_DATA);

      expect(metrics.calculatedScopes).toHaveLength(4);

      // Row 1: FA GENERAL
      const row1 = metrics.calculatedScopes[0];
      expect(row1.description).toBe('FA GENERAL');
      expect(row1.scopeAmount).toBe(287524.10);
      // Weightage = 287524.10 / 1292000 = ~0.22254187306501548
      expect(row1.activityWeightage).toBeCloseTo(0.222541873, 6);
      // Net progress = 0.222541873 * 0.345 = ~0.0767769
      expect(row1.netProgress).toBeCloseTo(0.0767769, 5);
      // Progress value = 287524.10 * 0.345 = 99195.8145
      expect(row1.progressValue).toBeCloseTo(99195.81, 1);

      // Row 4: FAT
      const row4 = metrics.calculatedScopes[3];
      expect(row4.description).toBe('FAT');
      expect(row4.scopeAmount).toBe(92000.00);
      expect(row4.physicalCompletion).toBe(50.0);
      // Weightage = 92000 / 1292000 = ~0.07120743
      expect(row4.activityWeightage).toBeCloseTo(0.07120743, 6);
      // Progress value = 92000 * 0.5 = 46000
      expect(row4.progressValue).toBe(46000.00);
    });

    it('calculates total scope amounts, total weightage, overall progress, and total progress value', () => {
      const metrics = calculateProjectMetrics(GHAZLAN_EXAMPLE_DATA);

      // Scope Total = 287524.10 + 253518.84 + 661487.00 + 92000.00 = 1294529.94
      expect(metrics.totalScopeAmount).toBeCloseTo(1294529.94, 2);

      // Total Weightage = 1294529.94 / 1292000 = 1.0019581578947368
      expect(metrics.totalCalculatedWeightage).toBeCloseTo(1.001958, 5);

      // Total weightage percentage ~ 100.1958%
      expect(metrics.weightageDiscrepancyPercent).toBeCloseTo(100.1958, 3);

      // Discrepancy flag
      expect(metrics.isDiscrepancy).toBe(true);
      expect(metrics.discrepancyAmount).toBeCloseTo(2529.94, 2);
    });

    it('flags non-blocking reconciliation discrepancy when scope total != project amount', () => {
      const metrics = calculateProjectMetrics(GHAZLAN_EXAMPLE_DATA);
      expect(metrics.isDiscrepancy).toBe(true);
      expect(metrics.discrepancyAmount).toBeCloseTo(2529.94, 2);
      // Should still allow export if no hard errors
      expect(metrics.canExport).toBe(true);
    });

    it('reconciles cleanly when scope total == project amount', () => {
      const metrics = calculateProjectMetrics(INITIAL_DEMO_DATA);
      expect(metrics.isDiscrepancy).toBe(false);
      expect(metrics.discrepancyAmount).toBe(0);
      expect(metrics.totalCalculatedWeightage).toBeCloseTo(1.0, 5);
    });
  });

  describe('Edge Cases and Validation Limits', () => {
    it('blocks export when project amount is zero or negative', () => {
      const data: ProjectFormData = {
        ...INITIAL_DEMO_DATA,
        projectAmount: 0,
      };
      const metrics = calculateProjectMetrics(data);
      expect(metrics.canExport).toBe(false);
      expect(metrics.validationErrors).toContain('Project amount must be greater than zero.');
    });

    it('ignores empty scope rows in calculations', () => {
      const data: ProjectFormData = {
        ...INITIAL_DEMO_DATA,
        scopeItems: [
          ...INITIAL_DEMO_DATA.scopeItems,
          { id: 'empty-1', description: '   ', scopeAmount: 0, physicalCompletion: 0 },
        ],
      };
      const metrics = calculateProjectMetrics(data);
      // Empty row filtered out
      expect(metrics.calculatedScopes).toHaveLength(4);
    });

    it('blocks export if overall progress exceeds 100%', () => {
      const data: ProjectFormData = {
        ...INITIAL_DEMO_DATA,
        projectAmount: 100000,
        scopeItems: [
          { id: 's-1', description: 'Over Complete Scope', scopeAmount: 150000, physicalCompletion: 100 },
        ],
      };
      const metrics = calculateProjectMetrics(data);
      expect(metrics.canExport).toBe(false);
      expect(metrics.validationErrors.some((e) => e.includes('cannot exceed 100%'))).toBe(true);
    });

    it('blocks export if more than 8 scope items are provided (2-page guarantee)', () => {
      const data: ProjectFormData = {
        ...INITIAL_DEMO_DATA,
        scopeItems: Array.from({ length: 9 }, (_, i) => ({
          id: `s-${i}`,
          description: `Activity ${i + 1}`,
          scopeAmount: 10000,
          physicalCompletion: 50,
        })),
      };
      const metrics = calculateProjectMetrics(data);
      expect(metrics.canExport).toBe(false);
      expect(metrics.validationErrors).toContain('Maximum 8 scope items allowed to ensure an exact 2-page PDF.');
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
