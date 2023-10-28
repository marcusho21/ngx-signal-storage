import {
  ClearStorageAction,
  GetStorageAction,
  InitStorageAction,
  RemoveStorageAction,
  SetStorageAction,
  StorageAction,
} from './ngx-signal-storage.type';

/**
 *
 * @param value
 * @returns {boolean} is value a string
 */
export const isString = (value: unknown): value is string =>
  typeof value === 'string';

/**
 * @param action
 * @returns {boolean} is action a GetStorageAction
 */
export const isGetStorageAction = <K, V>(
  action: StorageAction<K, V>
): action is GetStorageAction<K> => {
  return action.type === 'get' && 'key' in action;
};

/**
 * @param action
 * @returns {boolean} is action a SetStorageAction
 */
export const isSetStorageAction = <K, V>(
  action: StorageAction<K, V>
): action is SetStorageAction<K, V> => {
  return action.type === 'set' && 'key' in action && 'payload' in action;
};

/**
 * @param action
 * @returns {boolean} is action a RemoveStorageAction
 */
export const isRemoveStorageAction = <K, V>(
  action: StorageAction<K, V>
): action is RemoveStorageAction<K> => {
  return action.type === 'remove' && 'key' in action;
};

/**
 * @param action
 * @returns {boolean} is action a ClearStorageAction
 */
export const isClearStorageAction = <K, V>(
  action: StorageAction<K, V>
): action is ClearStorageAction => {
  return action.type === 'clear';
};

/**
 * @param action
 * @returns {boolean} is action a InitStorageAction
 */
export const isInitStorageAction = <K, V>(
  action: StorageAction<K, V>
): action is InitStorageAction => {
  return action.type === 'init';
};
