/** 验证码的最小长度 */
export const CODE_MIN_LENGTH = 6
/** 验证码的最大长度 */
export const CODE_MAX_LENGTH = 6
/** 验证码的要求描述 */
export const CODE_REQUIREMENTS_DESC = '验证码必须是 6 位数字'

/**
 * 校验一个验证码是否符合要求
 * @param code 待校验的验证码
 * @returns 如果符合要求，返回空字符串，否则返回错误信息
 */
export function validateCode(code?: string | number): string {
  if (typeof code === 'number')
    code = code.toString()
  if (typeof code !== 'string')
    return '验证码必须是字符串'
  if (code.length < CODE_MIN_LENGTH)
    return `验证码长度不得小于 ${CODE_MIN_LENGTH} 位`
  if (code.length > CODE_MAX_LENGTH)
    return `验证码长度不得大于 ${CODE_MAX_LENGTH} 位`
  // 6 位数字
  if (!/\d{6}$/.test(code))
    return '验证码格式有误'
  return ''
}
