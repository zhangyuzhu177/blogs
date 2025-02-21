/**
 * Object.entries 的类型安全版本
 * @param obj 原始对象
 * @returns Object.entries(obj) 的结果
 */
export function objectEntries<T extends object>(obj: T) {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>
}
