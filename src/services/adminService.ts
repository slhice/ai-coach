import { AdminSettings } from '../types/admin';

const STORAGE_KEY = 'admin_settings';

export const adminService = {
  getSettings: (): AdminSettings | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error loading admin settings:', error);
      return null;
    }
  },

  saveSettings: (settings: AdminSettings): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving admin settings:', error);
    }
  }
};