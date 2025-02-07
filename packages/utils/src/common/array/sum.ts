/**
 * number数组求和
 * @param arr number数组
 * @returns 所有元素之和
 */
export function arrayNumberSum(arr?: number[]) {
  return arr?.reduce((accumulator, currentValue) => accumulator + currentValue, 0) ?? 0
}
