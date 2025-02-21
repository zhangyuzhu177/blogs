/**
 * 校验一个数字是否符合要求
 * @param label 参数标签
 * @param value 待校验的数字
 * @param min 最小值
 * @param max 最大值
 * @returns 如果符合要求，返回空字符串，否则返回错误信息
 */
export function validateNumber(label: string, value?: number, min?: number, max?: number) {
  if (typeof value !== 'number')
    return `${label}必须是数字`

  if (typeof min === 'number' && value < min)
    return `${label} 不得小于 ${min}`
  if (typeof max === 'number' && value > max)
    return `${label} 不得大于 ${max}`

  return ''
}
