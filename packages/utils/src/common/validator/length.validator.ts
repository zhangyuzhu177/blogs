/**
 * 校验一个字符串是否符合要求的长度
 * @param label 参数标签
 * @param value 待校验的字符串
 * @param min 最小长度
 * @param max 最大长度
 * @returns 如果符合要求，返回空字符串，否则返回错误信息
 */
export function validateLength(label: string, value?: string, min?: number, max?: number) {
  if (typeof value !== 'string')
    return `${label}必须是字符串`

  if (typeof min === 'number' && value.length < min)
    return `${label}长度不得小于 ${min} 位`
  if (typeof max === 'number' && value.length > max)
    return `${label}长度不得大于 ${max} 位`

  return ''
}
