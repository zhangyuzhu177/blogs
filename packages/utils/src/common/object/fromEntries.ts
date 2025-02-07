/**
 * Object.fromEntries 的类型安全版本
 * @param arr 待转换的键值对列表
 * @returns Object.fromEntries(arr) 的结果
 */
export function objectFromEntries<K extends PropertyKey, V = any>(arr: [K, V][] | Map<K, V>) {
  return Object.fromEntries(arr) as Record<K, V>
}
