import { AES, enc } from 'crypto-js';

const STORAGE_KEY_PREFIX = 'aiCoach_';
const ENCRYPTION_KEY = 'EMC_AI_COACH_SECURE_STORAGE_KEY_2024';

export const secureStorage = {
  encrypt(data: any) {
    try {
      const jsonStr = JSON.stringify(data);
      return AES.encrypt(jsonStr, ENCRYPTION_KEY).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      return null;
    }
  },

  decrypt(encryptedData: string) {
    try {
      const bytes = AES.decrypt(encryptedData, ENCRYPTION_KEY);
      const decryptedStr = bytes.toString(enc.Utf8);
      return JSON.parse(decryptedStr);
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  },

  setItem(key: string, data: any) {
    const encrypted = this.encrypt(data);
    if (encrypted) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, encrypted);
    }
  },

  getItem(key: string) {
    const encrypted = localStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);
    if (!encrypted) return null;
    return this.decrypt(encrypted);
  },

  removeItem(key: string) {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${key}`);
  }
};