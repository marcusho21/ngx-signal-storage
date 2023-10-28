import {
  Injectable,
  computed,
  effect,
  inject,
  makeEnvironmentProviders,
  signal,
} from '@angular/core';
import {
  Key,
  NgxSignalStorage,
  StorageAction,
  StorageMap,
  Value,
} from '../_internal/ngx-signal-storage.type';
import { PREFIX, STORAGE } from '../_internal/storage.token';
import { isString } from '../_internal/type.helper';

@Injectable({
  providedIn: 'root',
})
export class NgxSignalStorageService<T extends StorageMap<T>>
  implements NgxSignalStorage<T>
{
  // injectables
  #storageHelper = inject(StorageHelper<T>);
  #keyValueValidator = new StorageKeyValueValidator<T>();

  // properties
  #action = signal<StorageAction<Key<T>, Value<T>>>({ type: 'init' });

  constructor() {
    this.#reducer();
  }

  #reducer() {
    return effect(() => {
      const action = this.#action();

      switch (action.type) {
        case 'set':
          this.#storageHelper.setStorageValue(action.key, action.payload);
          break;
        case 'remove':
          this.#storageHelper.removeStorageValue(action.key);
          break;
        case 'clear':
          this.#storageHelper.clearStorage();
          break;
      }
    });
  }

  get change() {
    return computed(() => this.#action());
  }

  get(key: Key<T>, validator?: (value: any) => value is Value<T>) {
    this.#keyValueValidator.validateKey(key);
    return computed(() => this.#storageHelper.getStorageValue(key, validator));
  }

  watch(key: Key<T>, validator?: (value: any) => value is Value<T>) {
    this.#keyValueValidator.validateKey(key);

    return computed(() => {
      this.#action(); // trigger computed to watch for changes by reacting to the #action signal
      return this.#storageHelper.getStorageValue(key, validator);
    });
  }

  set(key: Key<T>, payload: Value<T>) {
    this.#keyValueValidator.validateKey(key);
    return this.#action.set({ type: 'set', key, payload });
  }

  remove(key: Key<T>) {
    this.#keyValueValidator.validateKey(key);
    return this.#action.set({ type: 'remove', key });
  }

  clear() {
    this.#action.set({ type: 'clear' });
  }

  has(key: Key<T>) {
    return computed(() => {
      this.change();
      return this.#storageHelper.getStorageValue(key) !== null;
    });
  }
}

class StorageKeyValueValidator<T> {
  validateKey(key: Key<T>) {
    if (!isString(key)) {
      throw new Error(`key must be a string and not ${typeof key}`);
    }
  }

  validateValue(value: Key<T>, validator: (value: any) => boolean) {
    const isValid = validator(value);
    if (!isValid) {
      throw new Error(
        'value is not valid, please check your validator or type'
      );
    }
  }
}

@Injectable()
class StorageHelper<T> {
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

export const provideNgxSignalStorage = (prefix = '') => {
  return makeEnvironmentProviders([
    { provide: PREFIX, useValue: prefix },
    NgxSignalStorageService,
    StorageHelper,
  ]);
};
