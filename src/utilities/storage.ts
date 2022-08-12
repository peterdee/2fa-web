interface StoreItem<T> {
  value: T;
}

export enum StoreKeys {
  login = 'login',
  token = 'token',
  userId = 'userId',
}

export function deleteAllValues(): void {
  return localStorage.clear();
}

export function deleteValue(key: StoreKeys): void {
  return localStorage.removeItem(key);
}

export function getValue<T>(key: StoreKeys): null | T {
  const storeItem: null | string = localStorage.getItem(key);
  if (!storeItem) {
    return null;
  }
  const value: StoreItem<T> = JSON.parse(storeItem);
  return value.value;
}

export function storeValue<T>(key: StoreKeys, value: T): void {
  return localStorage.setItem(key, JSON.stringify({ value }));
}
