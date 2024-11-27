export interface Storage {
  setItem(key: string, data: any): void;
  getItem<T>(key: string): T | null;
  removeItem(key: string): void;
  clear(): void;
}