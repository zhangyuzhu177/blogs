/**
 * 判断传入的数值是否为 Date 对象
 * @param value 传入的数值
 * @returns 是否为 Date 对象
 */
export function isDate(value: any) {
  return Object.prototype.toString.call(value) === '[object Date]'
}
