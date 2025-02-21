/**
 * 将 number 的字符串描述转换为整数，如果无法转换则返回 undefined 或 默认值
 * @param src 要转换的值
 * @param defaultValue 默认值
 * @return 返回转换后的 number 值
 */
export function parseIntRaw<T extends number | undefined>(
  src?: string | boolean | number,
  defaultValue?: T,
): T extends number ? number : number | undefined {
  if (typeof src === 'number')
    return Math.floor(src)
  if (typeof src === 'boolean')
    return src ? 1 : 0
  if (typeof src === 'undefined')
    return defaultValue as any

  const num = Number.parseInt(src)
  return (Number.isNaN(num) ? defaultValue : num) as any
}
