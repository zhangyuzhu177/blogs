/**
 * 判断两个数组是否有交集
 * @param arr1 数组1
 * @param arr2 数组2
 * @returns 两个数组是否有交集
 */
export function hasIntersection(arr1: any[], arr2: any[]) {
  const set1 = new Set(arr1)
  const set2 = new Set(arr2)

  for (const item of set1) {
    if (set2.has(item))
      return true
  }

  return false
}
