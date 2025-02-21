/**
 * Object.values 的类型安全版本
 * @param obj 原始对象
 * @returns Object.values(obj) 的结果
 */
export function objectValues<T extends object>(obj: T) {
  return Object.values(obj) as Array<T[keyof T]>
}
