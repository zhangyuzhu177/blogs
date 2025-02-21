/**
 * 将 boolean 的字符串描述转换为 boolean 值，如果无法转换则返回 undefined 或 默认值
 *
 * - true 值的描述：`true`, `yes`, `1`, `TRUE`, `YES`, `True`, `Yes`
 * - false 值的描述：`false`, `no`, `0`, `FALSE`, `NO`, `False`, `No`
 * @param src 要转换的值
 * @param defaultValue 默认值
 * @return 返回转换后的 boolean 值
 */
export function parseBoolRaw<T extends boolean | undefined>(
  src?: string | boolean | number,
  defaultValue?: T,
): T extends boolean ? boolean : boolean | undefined {
  if (typeof src === 'undefined')
    return defaultValue as any
  if (typeof src !== 'string')
    return Boolean(src)

  const truly = ['true', 'yes', '1', 'TRUE', 'YES', 'True', 'Yes']
  const falsely = ['false', 'no', '0', 'FALSE', 'NO', 'False', 'No']
  return (truly.includes(src)
    ? true
    : falsely.includes(src)
      ? false
      : defaultValue) as any
}
