import { encrypt, decrypt } from '../crypto/encryption';
import { STORAGE_KEY_PREFIX } from '../crypto/constants';

export const secureStorage = {
  setItem(key: string, data: any): void {
    const encrypted = encrypt(data);
    if (encrypted) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, encrypted);
    }
  },

  getItem<T>(key: string): T | null {
    const encrypted = localStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);
    if (!encrypted) return null;
    return decrypt(encrypted);
  },

  removeItem(key: string): void {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${key}`);
  },

  clear(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_KEY_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  }
};