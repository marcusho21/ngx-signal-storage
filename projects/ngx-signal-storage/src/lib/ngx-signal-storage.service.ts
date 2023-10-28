import {
  Injectable,
  computed,
  effect,
  inject,
  makeEnvironmentProviders,
  signal,
} from '@angular/core';
import { StorageKeyValueValidator } from '../_internal/helpers/storage-key-value.validator';
import { StorageHelper } from '../_internal/helpers/storage.helper';
import { PREFIX } from '../_internal/storage.token';
import {
  Key,
  NgxSignalStorage,
  StorageAction,
  StorageMap,
  Value,
} from '../_internal/types/ngx-signal-storage.type';

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

export const provideNgxSignalStorage = (prefix = '') => {
  return makeEnvironmentProviders([
    { provide: PREFIX, useValue: prefix },
    NgxSignalStorageService,
    StorageHelper,
  ]);
};
