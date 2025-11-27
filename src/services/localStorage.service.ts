const STORAGE_KEYS = {
  USERS: 'ucsm-users',
  CURRENT_USER: 'current-user',
  CURRENT_USER_ID: 'current-user-id',
  ARCHIVE_ITEMS: 'archive-items',
  THEME: 'theme',
  LANGUAGE: 'language'
} as const;

export const localStorageService = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error);
    }
  },

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  },

  getString(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading string from localStorage: ${key}`, error);
      return null;
    }
  },

  setString(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error writing string to localStorage: ${key}`, error);
    }
  }
};

export { STORAGE_KEYS };
