import { Signal } from '@angular/core';

// Storage types
export type Key<T> = keyof T extends string ? keyof T : never;
export type Value<T> = T[Key<T>] extends {} ? T[Key<T>] : never;
export type StorageMap<T> = { [key in Key<T>]: Value<T> };

// Action Types
export type StorageAction<K, V> =
  | GetStorageAction<K>
  | SetStorageAction<K, V>
  | RemoveStorageAction<K>
  | InitStorageAction
  | ClearStorageAction;

export type GetStorageAction<Key> = { type: 'get'; key: Key };
export type SetStorageAction<Key, Value> = {
  type: 'set';
  key: Key;
  payload: Value;
};
export type RemoveStorageAction<Key> = { type: 'remove'; key: Key };
export type InitStorageAction = { type: 'init' };
export type ClearStorageAction = { type: 'clear' };

// NgxSignalStorageService abstract class
export abstract class NgxSignalStorage<
  T extends { [key in Key<T>]: Value<T> }
> {
  abstract get(key: Key<T>): Signal<Value<T> | null>;
  abstract get(
    key: Key<T>,
    validator: (value: any) => value is Value<T>
  ): Signal<Value<T> | null>;

  abstract watch(key: Key<T>): Signal<Value<T> | null>;
  abstract watch(
    key: Key<T>,
    validator: (value: any) => value is Value<T>
  ): Signal<Value<T> | null>;

  abstract set(key: Key<T>, payload: Value<T>): void;
  abstract remove(key: Key<T>): void;
  abstract clear(): void;
  abstract has(key: Key<T>): Signal<boolean>;
}
