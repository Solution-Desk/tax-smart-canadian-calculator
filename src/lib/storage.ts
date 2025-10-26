/**
 * Local storage utilities with type safety and error handling
 */

type StorageKey = 'province' | 'darkMode' | 'consent' | 'preferences';

export const save = <T>(key: StorageKey, value: T): void => {
  try {
    localStorage.setItem(`taxsmart_${key}`, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage: ${error}`);
  }
};

export const load = <T>(key: StorageKey, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(`taxsmart_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading from localStorage: ${error}`);
    return defaultValue;
  }
};

export const remove = (key: StorageKey): void => {
  try {
    localStorage.removeItem(`taxsmart_${key}`);
  } catch (error) {
    console.error(`Error removing from localStorage: ${error}`);
  }
};

// Type-safe wrappers for specific data types
export const storage = {
  // Province
  saveProvince: (province: string) => save('province', province),
  loadProvince: (defaultProvince: string) => load('province', defaultProvince),
  
  // Theme
  saveDarkMode: (isDark: boolean) => save('darkMode', isDark),
  loadDarkMode: (defaultValue = false) => load('darkMode', defaultValue),
  
  // Consent
  saveConsent: (consent: boolean) => save('consent', consent),
  hasConsent: () => load('consent', false),
  
  // Clear all app-specific storage
  clearAll: () => {
    Object.keys(localStorage)
      .filter(key => key.startsWith('taxsmart_'))
      .forEach(key => localStorage.removeItem(key));
  }
};
