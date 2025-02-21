import { objectEntries } from '.'

/**
 * 将对象转换为对象数组
 * @param obj 原始对象
 * @param name1 键对应的key
 * @param name2 值对应的key
 * @returns 转换后的对象数组
 */
export function objectToArray<
  K extends PropertyKey,
  V,
  N1 extends PropertyKey,
  N2 extends PropertyKey,
>(
  obj: Record<K, V>, name1: N1, name2: N2,
) {
  return objectEntries(obj).map(([k, v]) => {
    return {
      [name1]: k,
      [name2]: v,
    }
  }) as (Record<N1, K> & Record<N2, V>)[]
}
