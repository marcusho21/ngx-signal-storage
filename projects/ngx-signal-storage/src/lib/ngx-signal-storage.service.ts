import {
  computed,
  effect,
  makeEnvironmentProviders,
  signal,
} from '@angular/core';
import { StorageHelper, prefixKey } from '../_internal/helpers/storage.helper';
import { validateKey } from '../_internal/helpers/validation.helper';
import { STORAGE } from '../_internal/storage.token';
import {
  Key,
  NgxSignalStorage,
  StorageAction,
  StorageMap,
  Value,
} from '../_internal/types/ngx-signal-storage.type';

export class NgxSignalStorageService<T extends StorageMap<T>>
  implements NgxSignalStorage<T>
{
  // constructor arguments
  #storageHelper: StorageHelper<T>;
  #prefix = '';

  // properties
  #action = signal<StorageAction<Key<T>, Value<T>>>({ type: 'init' });

  constructor(prefix: string, storage: Storage) {
    this.#prefix = prefix;
    this.#storageHelper = new StorageHelper<T>(storage);

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

  get prefix() {
    return this.#prefix;
  }

  get change() {
    return this.#action.asReadonly();
  }

  @validateKey()
  @prefixKey()
  get(key: Key<T>, validator?: (value: any) => value is Value<T>) {
    return computed(() => this.#storageHelper.getStorageValue(key, validator));
  }

  @validateKey()
  @prefixKey()
  watch(key: Key<T>, validator?: (value: any) => value is Value<T>) {
    return computed(() => {
      this.change();
      return this.#storageHelper.getStorageValue(key, validator);
    });
  }

  @validateKey()
  @prefixKey()
  set(key: Key<T>, payload: Value<T>) {
    return this.#action.set({ type: 'set', key, payload });
  }

  @validateKey()
  @prefixKey()
  remove(key: Key<T>) {
    return this.#action.set({ type: 'remove', key });
  }

  @validateKey()
  @prefixKey()
  has(key: Key<T>) {
    return computed(() => {
      this.change();
      return this.#storageHelper.getStorageValue(key) !== null;
    });
  }

  clear() {
    this.#action.set({ type: 'clear' });
  }
}

export const provideNgxSignalStorage = (prefix = '') => {
  return makeEnvironmentProviders([
    {
      provide: NgxSignalStorageService,
      useFactory: (storage: Storage) =>
        new NgxSignalStorageService(prefix, storage),
      deps: [STORAGE],
    },
  ]);
};
