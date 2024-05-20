/**
 * 数组去重
 * @param arr 待去重的数组
 * @returns 去重之后的数组
 */
export function arrayDistinct<T = any>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}
