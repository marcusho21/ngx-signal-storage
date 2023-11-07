/**
 *
 * @param value
 * @returns {boolean} is value a string
 */
export const isString = (value: unknown): value is string =>
  typeof value === 'string';
