import { ProjectFormData } from '../types';
import { INITIAL_DEMO_DATA } from './defaults';

const STORAGE_KEY = 'kayan_progress_report_draft_v1';

export function saveDraftToStorage(data: ProjectFormData): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  } catch (error) {
    console.warn('LocalStorage save failed:', error);
  }
}

export function loadDraftFromStorage(): ProjectFormData {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object' && parsed.projectName !== undefined) {
          return parsed;
        }
      }
    }
  } catch (error) {
    console.warn('LocalStorage load failed:', error);
  }
  return INITIAL_DEMO_DATA;
}

export function clearDraftFromStorage(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.warn('LocalStorage clear failed:', error);
  }
}
