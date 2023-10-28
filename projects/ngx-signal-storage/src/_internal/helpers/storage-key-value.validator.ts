import { Key } from '../types/ngx-signal-storage.type';
import { isString } from './type.helper';

export class StorageKeyValueValidator<T> {
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
