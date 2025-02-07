/** Url 的最小长度 */
export const URL_MIN_LENGTH = 11
/** Url 的最大长度 */
export const URL_MAX_LENGTH = 2048
/** Url 的要求描述 */
export const URL_REQUIREMENTS_DESC = `Url 长度不得小于 ${URL_MIN_LENGTH} 位，不得大于 ${URL_MAX_LENGTH} 位`

/**
 * 校验一个 Url 是否符合要求
 * @param url 待校验的 Url
 * @returns 如果符合要求，返回空字符串，否则返回错误信息
 */
export function validateUrl(url?: string): string {
  if (typeof url !== 'string')
    return 'Url 必须是字符串'
  if (url.length < URL_MIN_LENGTH)
    return `Url 长度不得小于 ${URL_MIN_LENGTH} 位`
  if (url.length > URL_MAX_LENGTH)
    return `Url 长度不得大于 ${URL_MAX_LENGTH} 位`
  // 以 1 开头，后面跟 10 位数字
  if (!/^(http|https):\/\/[a-zA-Z0-9]/.test(url))
    return 'Url 格式有误'
  return ''
}
