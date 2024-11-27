import { Storage } from './types';
import { createBrowserStorage } from './browserStorage';

class StandardStorage implements Storage {
  private browserStorage: Storage;

  constructor() {
    this.browserStorage = createBrowserStorage();
  }

  setItem(key: string, data: any): void {
    this.browserStorage.setItem(key, data);
  }

  getItem<T>(key: string): T | null {
    return this.browserStorage.getItem<T>(key);
  }

  removeItem(key: string): void {
    this.browserStorage.removeItem(key);
  }

  clear(): void {
    this.browserStorage.clear();
  }
}

export const standardStorage = new StandardStorage();