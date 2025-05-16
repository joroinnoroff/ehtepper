// utils/caseConverter.ts

/**
 * Converts a camelCase string to snake_case.
 * @param str The camelCase string.
 * @returns The snake_case string.
 */
export function camelToSnake(str: string): string {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}

/**
 * Recursively converts all keys in an object from camelCase to snake_case.
 * @param obj The object to convert.
 * @returns A new object with snake_case keys.
 */
export function convertKeysToSnake(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => convertKeysToSnake(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result: any, key: string) => {
      const newKey = camelToSnake(key);
      result[newKey] = convertKeysToSnake(obj[key]);
      return result;
    }, {});
  }
  return obj;
}
