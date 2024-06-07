/**
 * 从对象中移除指定的属性组成新的对象
 * @param obj 原始对象
 * @param keys 指定属性
 * @returns 新对象
 */
export function objectOmit<T, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  const newObj = { ...obj }
  keys.forEach(key => delete newObj[key])
  return newObj
}
