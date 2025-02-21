/**
 * 判断传入的数值是否存在，即不为 `null` 和 `undefined`
 * @param value 传入的数值
 * @returns 是否存在
 */
export function isExist(value: any) {
  return value !== null && value !== undefined
}
