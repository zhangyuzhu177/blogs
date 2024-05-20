/**
 * 校验字符串包含大小写字母、数字和特殊字符中的几种
 * @param str 待校验的字符串
 * @returns 字符串包含字符种类的数量
 */
export function validateString(str: string) {
  let count = 0
  if (/[A-Z]/.test(str))
    count++
  if (/[a-z]/.test(str))
    count++
  if (/[0-9]/.test(str))
    count++
  if (/[^\w\s]/.test(str))
    count++
  return count
}
