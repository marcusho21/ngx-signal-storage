import { Key, Value } from '../types/ngx-signal-storage.type';
import { useValidator } from './validation.helper';

export class StorageHelper<T> {
  #storage: Storage;

  constructor(storage: Storage) {
    this.#storage = storage;
  }

  getStorageValue(key: Key<T>, validator?: (value: any) => boolean) {
    const value = this.#storage.getItem(key);

    if (value === null) return null;

    const parsedValue = JSON.parse(value);

    validator && useValidator(parsedValue, validator);

    return parsedValue as Value<T>;
  }

  setStorageValue(key: Key<T>, payload: Value<T>) {
    this.#storage.setItem(key, JSON.stringify(payload));
  }

  removeStorageValue(key: Key<T>) {
    this.#storage.removeItem(key);
  }

  clearStorage() {
    this.#storage.clear();
  }

  hasStorageValue(key: Key<T>) {
    return this.#storage.getItem(key) !== null;
  }
}

export function prefixKey() {
  return function (
    _target: any,
    _propertyName: string,
    descriptor: PropertyDescriptor & { prefix?: string }
  ) {
    const originalMethod: Function & ((key: any) => any) = descriptor.value;

    descriptor.value = function () {
      const prefix = this.prefix ?? '';
      const key = arguments[0];

      arguments[0] = [prefix, key].join('');

      return originalMethod.apply(this, arguments);
    };

    return descriptor;
  };
}
