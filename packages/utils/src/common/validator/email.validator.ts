/** 邮箱的最小长度 */
export const EMAIL_MIN_LENGTH = 6
/** 邮箱的最大长度 */
export const EMAIL_MAX_LENGTH = 320
/** 邮箱的要求描述 */
export const EMAIL_REQUIREMENTS_DESC = `邮箱长度不得小于 ${EMAIL_MIN_LENGTH} 位，不得大于 ${EMAIL_MAX_LENGTH} 位`

/**
 * 校验一个邮箱地址是否符合要求
 * @param email 待校验的邮箱地址
 * @returns 如果符合要求，返回空字符串，否则返回错误信息
 */
export function validateEmail(email?: string): string {
  if (typeof email !== 'string')
    return '邮箱必须是字符串'
  if (email.length < EMAIL_MIN_LENGTH)
    return `邮箱长度不得小于 ${EMAIL_MIN_LENGTH} 位`
  if (email.length > EMAIL_MAX_LENGTH)
    return `邮箱长度不得大于 ${EMAIL_MAX_LENGTH} 位`
  if (!/^[a-zA-Z0-9_\-\.]{1,64}\@([a-zA-Z0-9_-]+\.)+([a-zA-Z0-9]{2,6})$/.test(email))
    return '邮箱格式有误'
  return ''
}
