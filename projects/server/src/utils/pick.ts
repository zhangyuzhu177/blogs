/**
 * 从对象中取出指定的属性组成新的对象
 * @param obj 原始对象
 * @param keys 指定属性
 * @returns 新对象
 */
export function objectPick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  return keys.reduce((acc, key) => {
    acc[key] = obj[key]
    return acc
  }, {} as Pick<T, K>)
}
