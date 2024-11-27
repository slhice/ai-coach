import { AES, enc } from 'crypto-js';
import { ENCRYPTION_KEY } from './constants';

export const encrypt = (data: any): string | null => {
  try {
    const jsonStr = JSON.stringify(data);
    return AES.encrypt(jsonStr, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

export const decrypt = (encryptedData: string): any | null => {
  try {
    const bytes = AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decryptedStr = bytes.toString(enc.Utf8);
    return JSON.parse(decryptedStr);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};