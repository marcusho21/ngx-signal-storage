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
