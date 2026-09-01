import { ProjectFormData } from '../types';

export const INITIAL_DEMO_DATA: ProjectFormData = {
  reportDate: '2026-09-01',
  projectName: 'Industrial Facility Modernization',
  client: 'Eastern Industrial Corporation',
  contractor: 'KAYAN CAPITAL HOLDINGS',
  poNumber: 'PO-2026-9421-R1',
  projectStartDate: '2026-07-01',
  projectEndDate: '2026-12-31',
  projectAmount: 1000000.00,
  currency: 'SAR',
  projectLeader: 'ERFAN AHMAD',
  showReconciliationNote: false,
  scopeItems: [
    {
      id: 'scope-1',
      description: 'Site Preparation & Civil Foundation',
      scopeAmount: 300000.00,
      physicalCompletion: 60.0,
    },
    {
      id: 'scope-2',
      description: 'Mechanical & Piping Installation',
      scopeAmount: 400000.00,
      physicalCompletion: 40.0,
    },
    {
      id: 'scope-3',
      description: 'Electrical & Fire Alarm Systems',
      scopeAmount: 200000.00,
      physicalCompletion: 25.0,
    },
    {
      id: 'scope-4',
      description: 'System Testing & Final Commissioning',
      scopeAmount: 100000.00,
      physicalCompletion: 10.0,
    },
  ],
};

export const GHAZLAN_EXAMPLE_DATA: ProjectFormData = {
  reportDate: '2026-08-06',
  projectName: 'GHEZLAN Project',
  client: 'AL ZAMIL',
  contractor: 'KAYAN CAPITAL HOLDINGS',
  poNumber: 'HSP-PO-46319 (Revision 0)',
  projectStartDate: '2026-06-30',
  projectEndDate: '2026-11-30',
  projectAmount: 1292000.00,
  currency: 'SAR',
  projectLeader: 'ERFAN AHMAD',
  showReconciliationNote: false,
  scopeItems: [
    {
      id: 'ghazlan-1',
      description: 'FA GENERAL',
      scopeAmount: 287524.10,
      physicalCompletion: 34.50,
    },
    {
      id: 'ghazlan-2',
      description: 'FA FM 200',
      scopeAmount: 253518.84,
      physicalCompletion: 45.18957,
    },
    {
      id: 'ghazlan-3',
      description: 'FIRE FIGHTING',
      scopeAmount: 661487.00,
      physicalCompletion: 14.15065,
    },
    {
      id: 'ghazlan-4',
      description: 'FAT',
      scopeAmount: 92000.00,
      physicalCompletion: 50.00,
    },
  ],
};

export const EMPTY_FORM_DATA: ProjectFormData = {
  reportDate: new Date().toISOString().split('T')[0],
  projectName: '',
  client: '',
  contractor: 'KAYAN CAPITAL HOLDINGS',
  poNumber: '',
  projectStartDate: '',
  projectEndDate: '',
  projectAmount: 0,
  currency: 'SAR',
  projectLeader: '',
  showReconciliationNote: false,
  scopeItems: [
    {
      id: 'empty-1',
      description: '',
      scopeAmount: 0,
      physicalCompletion: 0,
    },
  ],
};
