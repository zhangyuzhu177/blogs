/**
 * Object.keys 的类型安全版本
 * @param obj 原始对象
 * @returns Object.keys(obj) 的结果
 */
export function objectKeys<T extends object>(obj: T) {
  return Object.keys(obj) as Array<keyof T>
}
