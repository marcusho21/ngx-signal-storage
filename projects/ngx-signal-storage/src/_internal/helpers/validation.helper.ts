import { StorageMap } from '../types/ngx-signal-storage.type';
import { isString } from './type.helper';

export function useValidator(value: any, validator: (value: any) => boolean) {
  const isValid = validator(value);
  if (!isValid) {
    throw new Error(
      `${value} is not valid based on the validator provided, please check the provided validator or value`
    );
  }
}

export function validateKey<T extends StorageMap<T>>(errorMsg?: string) {
  return function (
    _target: any,
    _propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod: Function & ((key: any) => any) = descriptor.value;

    descriptor.value = function () {
      const key = arguments[0];
      const defaultErrorMsg = `key must be a string and not ${typeof key}`;

      if (!isString(key)) {
        throw new Error(errorMsg || defaultErrorMsg);
      }

      return originalMethod.apply(this, arguments);
    };

    return descriptor;
  };
}
