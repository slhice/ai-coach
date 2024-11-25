import { AES, enc } from 'crypto-js';

const STORAGE_KEY = 'aiCoachConversations';
const ENCRYPTION_KEY = 'your-secure-key'; // In production, this should come from environment variables

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

  saveConversations(conversations: any[]) {
    const encrypted = this.encrypt(conversations);
    if (encrypted) {
      localStorage.setItem(STORAGE_KEY, encrypted);
    }
  },

  getConversations() {
    const encrypted = localStorage.getItem(STORAGE_KEY);
    if (!encrypted) return [];
    
    const decrypted = this.decrypt(encrypted);
    return decrypted || [];
  }
};