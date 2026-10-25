

type StorageValue<T> = {
  data: T;
  timestamp?: number; 
};

const isBrowser = typeof window !== 'undefined';

export const saveToStorage = <T>(key: string, value: T, withTimestamp = false): void => {
  if (!isBrowser) return;

  const payload: StorageValue<T> = {
    data: value,
    ...(withTimestamp && { timestamp: Date.now() }),
  };

  try {
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (error) {
    console.error(`Error al guardar en localStorage [${key}]:`, error);
  }
};


export const getFromStorage = <T>(key: string): T | null => {
  if (!isBrowser) return null;

  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const parsed: StorageValue<T> = JSON.parse(item);
    return parsed.data;
  } catch (error) {
    console.error(`Error al leer desde localStorage [${key}]:`, error);
    return null;
  }
};


export const removeFromStorage = (key: string): void => {
  if (!isBrowser) return;

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error al eliminar desde localStorage [${key}]:`, error);
  }
};


export const clearStorage = (): void => {
  if (!isBrowser) return;

  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error al limpiar localStorage:', error);
  }
};


export const hasStorageKey = (key: string): boolean => {
  if (!isBrowser) return false;
  return localStorage.getItem(key) !== null;
};


export const getStorageTimestamp = (key: string): number | null => {
  if (!isBrowser) return null;

  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const parsed: StorageValue<unknown> = JSON.parse(item);
    return parsed.timestamp ?? null;
  } catch (error) {
    console.error(`Error al obtener timestamp desde localStorage [${key}]:`, error);
    return null;
  }
};
