import { encrypt, decrypt } from '../crypto/encryption';
import { STORAGE_KEY_PREFIX } from '../crypto/constants';
import { Storage } from './types';
import { createBrowserStorage } from './browserStorage';

class SecureStorage implements Storage {
  private browserStorage: Storage;

  constructor() {
    this.browserStorage = createBrowserStorage();
  }

  setItem(key: string, data: any): void {
    const encrypted = encrypt(data);
    if (encrypted) {
      this.browserStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, encrypted);
    }
  }

  getItem<T>(key: string): T | null {
    const encrypted = this.browserStorage.getItem<string>(`${STORAGE_KEY_PREFIX}${key}`);
    if (!encrypted) return null;
    return decrypt(encrypted);
  }

  removeItem(key: string): void {
    this.browserStorage.removeItem(`${STORAGE_KEY_PREFIX}${key}`);
  }

  clear(): void {
    Object.keys(window.localStorage)
      .filter(key => key.startsWith(STORAGE_KEY_PREFIX))
      .forEach(key => this.browserStorage.removeItem(key));
  }
}

export const secureStorage = new SecureStorage();