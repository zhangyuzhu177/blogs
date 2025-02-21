/**
 * 将任意的二维数组展开为一维数组
 * @param arr 待展开的二维数组
 * @returns 展开后的一维数组
 */
export function arrayExpand<T = any>(arr?: T[][]) {
  if (Array.isArray(arr))
    return arr.reduce((a, b) => a.concat(b), [])
  return []
}
