export interface Storage {
  setItem(key: string, data: any): void;
  getItem<T>(key: string): T | null;
  removeItem(key: string): void;
  clear(): void;
}

export const createBaseStorage = (): Storage => ({
  setItem(key: string, data: any): void {
    try {
      window.localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  getItem<T>(key: string): T | null {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  },

  removeItem(key: string): void {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  clear(): void {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Storage error:', error);
    }
  }
});