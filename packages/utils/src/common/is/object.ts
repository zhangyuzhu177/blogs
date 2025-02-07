/**
 * 判断传入的数值是否为对象
 * @param value 传入的数值
 * @returns 是否为对象
 */
export function isObject(value: any) {
  return Object.prototype.toString.call(value) === '[object Object]'
}
