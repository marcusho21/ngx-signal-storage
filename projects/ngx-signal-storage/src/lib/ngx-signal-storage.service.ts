import { Injectable, computed, effect, inject, signal } from '@angular/core';
import {
  Key,
  NgxSignalStorage,
  StorageAction,
  StorageMap,
  Value,
} from '../_internal/ngx-signal-storage.class';
import { STORAGE } from '../_internal/storage.token';
import { isString } from '../_internal/type.helper';

@Injectable({
  providedIn: 'root',
})
export class NgxSignalStorageService<T extends StorageMap<T>>
  implements NgxSignalStorage<T>
{
  #storage = inject(STORAGE);
  #action = signal<StorageAction<Key<T>, Value<T>>>({ type: 'init' });

  constructor() {
    effect(() => {
      const action = this.#action();

      switch (action.type) {
        case 'set':
          this.#storage.setItem(action.key, JSON.stringify(action.payload));
          break;
        case 'remove':
          this.#storage.removeItem(action.key);
          break;
        case 'clear':
          this.#storage.clear();
          break;
      }
    });
  }

  get change() {
    return computed(() => this.#action());
  }

  get(key: Key<T>, validator?: (value: any) => value is Value<T>) {
    this.validateKey(key);
    return computed(() => this.getStorageValue(key, validator));
  }

  watch(key: Key<T>, validator?: (value: any) => value is Value<T>) {
    this.validateKey(key);

    return computed(() => {
      this.#action(); // trigger computed to watch for changes by reacting to the #action signal
      return this.getStorageValue(key, validator);
    });
  }

  set(key: Key<T>, payload: Value<T>) {
    if (!isString(key))
      throw new Error('key must be a string and not ${typeof key}');
    return this.#action.set({ type: 'set', key, payload });
  }

  remove(key: Key<T>) {
    if (!isString(key))
      throw new Error(`key must be a string and not ${typeof key}`);
    return this.#action.set({ type: 'remove', key });
  }

  clear() {
    this.#action.set({ type: 'clear' });
  }

  has(key: Key<T>) {
    return computed(() => {
      this.change();
      return this.#storage.getItem(key) !== null;
    });
  }

  private getStorageValue(key: Key<T>, validator?: (value: any) => boolean) {
    const value = this.#storage.getItem(key);

    if (value === null) return null;

    const parsedValue = JSON.parse(value);

    if (validator) {
      this.validateValue(parsedValue, validator);
    }

    return parsedValue as Value<T>;
  }

  private validateKey(key: Key<T>) {
    if (!isString(key))
      throw new Error(`key must be a string and not ${typeof key}`);
  }

  private validateValue(value: any, validator: (value: any) => boolean) {
    const isValid = validator(value);
    if (!isValid) {
      throw new Error(
        'value is not valid, please check your validator or type'
      );
    }
  }
}
