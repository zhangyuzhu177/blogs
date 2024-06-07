/**
 * 判断第一个数组是否完全包含第二个数组
 * @param arr1 数组1
 * @param arr2 数组2
 * @returns 是否完全包含
 */
export function isFullIncludes(arr1: any[], arr2: any[]) {
  return arr2.every(v => arr1.includes(v))
}
