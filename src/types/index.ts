import { z } from 'zod';

export interface ScopeItem {
  id: string;
  description: string;
  scopeAmount: number;
  physicalCompletion: number; // 0 - 100 percentage
}

export interface CalculatedScopeItem extends ScopeItem {
  activityWeightage: number; // decimal e.g. 0.2225
  netProgress: number; // decimal e.g. 0.0768
  progressValue: number; // currency amount
}

export interface ProjectFormData {
  reportDate: string; // YYYY-MM-DD
  projectName: string;
  client: string;
  contractor: string;
  poNumber: string;
  projectStartDate: string; // YYYY-MM-DD
  projectEndDate: string; // YYYY-MM-DD
  projectAmount: number;
  currency: string;
  projectLeader: string;
  scopeItems: ScopeItem[];
  showReconciliationNote?: boolean;
}

export interface ProjectCalculations {
  projectDuration: number;
  dayNumberDisplay: string;
  dayNumber: number | null;
  dayNumberStatus: 'before' | 'during' | 'past_due' | 'invalid';
  calculatedScopes: CalculatedScopeItem[];
  totalScopeAmount: number;
  totalCalculatedWeightage: number; // decimal e.g. 1.002
  overallProgress: number; // decimal e.g. 0.2726
  totalProgressValue: number;
  isDiscrepancy: boolean;
  discrepancyAmount: number;
  weightageDiscrepancyPercent: number;
  validationErrors: string[];
  canExport: boolean;
}

export const ScopeItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Description is required'),
  scopeAmount: z.number({ invalid_type_error: 'Amount must be a number' }).min(0, 'Amount must be 0 or greater'),
  physicalCompletion: z.number({ invalid_type_error: 'Completion must be a number' })
    .min(0, 'Completion must be at least 0%')
    .max(100, 'Completion cannot exceed 100%'),
});

export const ProjectFormSchema = z.object({
  reportDate: z.string().min(1, 'Report date is required'),
  projectName: z.string().min(1, 'Project name is required'),
  client: z.string().min(1, 'Client is required'),
  contractor: z.string().min(1, 'Contractor is required'),
  poNumber: z.string().min(1, 'PO number is required'),
  projectStartDate: z.string().min(1, 'Start date is required'),
  projectEndDate: z.string().min(1, 'End date is required'),
  projectAmount: z.number({ invalid_type_error: 'Project amount must be a number' })
    .positive('Project amount must be greater than zero'),
  currency: z.string().min(1, 'Currency is required').default('SAR'),
  projectLeader: z.string().min(1, 'Project leader is required'),
  scopeItems: z.array(ScopeItemSchema)
    .min(1, 'At least one scope row is required')
    .max(8, 'Maximum 8 scope rows supported for 2-page layout'),
  showReconciliationNote: z.boolean().optional(),
}).refine((data) => {
  if (data.projectStartDate && data.projectEndDate) {
    return new Date(data.projectEndDate) >= new Date(data.projectStartDate);
  }
  return true;
}, {
  message: 'Project end date cannot be earlier than start date',
  path: ['projectEndDate'],
});
