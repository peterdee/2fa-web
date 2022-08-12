interface StoreItem<T> {
  value: T;
}

export interface StoreKeys {
  login: string;
  token: string;
  userId: string;
}

export function deleteAllValues(): void {
  return localStorage.clear();
}

export function deleteValue(key: keyof StoreKeys): void {
  return localStorage.removeItem(key);
}

export function getValue<T>(key: keyof StoreKeys): null | T {
  const storeItem: null | string = localStorage.getItem(key);
  if (!storeItem) {
    return null;
  }
  const value: StoreItem<T> = JSON.parse(storeItem);
  return value.value;
}

export function storeValue<T>(key: keyof StoreKeys, value: T): void {
  return localStorage.setItem(key, JSON.stringify({ value }));
}
