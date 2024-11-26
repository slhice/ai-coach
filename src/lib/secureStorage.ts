import { AES, enc } from 'crypto-js';

const STORAGE_KEY_PREFIX = 'aiCoach_';
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-key';

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
  },

  saveKnowledgeSource(source: any) {
    const sources = this.getItem('knowledgeSources') || [];
    sources.push({
      ...source,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    });
    this.setItem('knowledgeSources', sources);
  },

  getKnowledgeSources() {
    return this.getItem('knowledgeSources') || [];
  },

  saveConversation(conversation: any) {
    const conversations = this.getItem('conversations') || [];
    conversations.push({
      ...conversation,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    });
    this.setItem('conversations', conversations);
  },

  getConversations() {
    return this.getItem('conversations') || [];
  },

  clearConversations() {
    this.removeItem('conversations');
  },

  clearKnowledgeSources() {
    this.removeItem('knowledgeSources');
  }
};