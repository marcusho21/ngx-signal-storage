import { Injectable, inject } from '@angular/core';
import { STORAGE, PREFIX } from '../storage.token';
import { Key, Value } from '../types/ngx-signal-storage.type';
import { StorageKeyValueValidator } from './storage-key-value.validator';

@Injectable()
export class StorageHelper<T> {
  #storage = inject(STORAGE);
  #prefix = inject(PREFIX);
  #keyValueValidator = new StorageKeyValueValidator<T>();

  getStorageValue(key: Key<T>, validator?: (value: any) => boolean) {
    const value = this.#storage.getItem(this.getPrefixedKey(key));

    if (value === null) return null;

    const parsedValue = JSON.parse(value);

    if (validator) {
      this.#keyValueValidator.validateValue(parsedValue, validator);
    }

    return parsedValue as Value<T>;
  }

  setStorageValue(key: Key<T>, payload: Value<T>) {
    this.#storage.setItem(this.getPrefixedKey(key), JSON.stringify(payload));
  }

  removeStorageValue(key: Key<T>) {
    this.#storage.removeItem(this.getPrefixedKey(key));
  }

  clearStorage() {
    this.#storage.clear();
  }

  hasStorageValue(key: Key<T>) {
    return this.#storage.getItem(this.getPrefixedKey(key)) !== null;
  }

  getPrefixedKey(key: Key<T>): `${string}${Key<T>}` {
    return `${this.#prefix}${key}` as const;
  }
}
