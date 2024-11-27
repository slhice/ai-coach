import { AES, enc } from 'crypto-js';

const STORAGE_KEY_PREFIX = 'aiCoach_';
const ENCRYPTION_KEY = 'EMC_AI_COACH_SECURE_STORAGE_KEY_2024';

export const secureStorage = {
  setItem(key: string, data: any) {
    try {
      const jsonStr = JSON.stringify(data);
      const encrypted = AES.encrypt(jsonStr, ENCRYPTION_KEY).toString();
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, encrypted);
    } catch (error) {
      console.error('Encryption error:', error);
    }
  },

  getItem(key: string) {
    try {
      const encrypted = localStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);
      if (!encrypted) return null;
      
      const bytes = AES.decrypt(encrypted, ENCRYPTION_KEY);
      const decrypted = bytes.toString(enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  },

  removeItem(key: string) {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${key}`);
  }
};