import { validateString } from '.'

/** 密码的最小长度 */
export const PASSWORD_MIN_LENGTH = 8
/** 密码的最大长度 */
export const PASSWORD_MAX_LENGTH = 24
/** 密码中允许出现的字符 */
export const PASSWORD_ALLOW_CHARS = '!@#$%^&*()_+-=,.:;?~'
/** 密码的要求描述 */
export const PASSWORD_REQUIREMENTS_DESC = `密码为 ${PASSWORD_MIN_LENGTH} - ${PASSWORD_MAX_LENGTH} 位，不得包含用户名以及 ${PASSWORD_ALLOW_CHARS} 以外的特殊字符，且至少包含大小写字母、数字和特殊字符中的三种`

/**
 * 校验一个密码是否符合要求
 * @param password 待校验的密码
 * @param account 用户名
 * @returns 如果符合要求，返回空字符串，否则返回错误信息
 */
export function validatePassword(password?: string, account?: string) {
  if (typeof password !== 'string')
    return '密码必须是字符串'

  if (account) {
    if (password.toLowerCase().includes(account.toLowerCase()))
      return '密码不得包含用户名'
  }

  if (password.length < PASSWORD_MIN_LENGTH)
    return `密码长度不得小于 ${PASSWORD_MIN_LENGTH} 位`
  if (password.length > PASSWORD_MAX_LENGTH)
    return `密码长度不得大于 ${PASSWORD_MAX_LENGTH} 位`

  // 检测特殊字符
  const specialChars = password.split('').filter(char => !/[a-zA-Z0-9]/.test(char))
  const notAllowedChar = specialChars.find(char => !PASSWORD_ALLOW_CHARS.includes(char))
  if (notAllowedChar)
    return `密码不得包含 ${PASSWORD_ALLOW_CHARS} 以外的特殊字符，特殊字符 “${notAllowedChar}” 不被允许`
  if (validateString(password) < 3)
    return '密码至少包含大小写字母、数字和特殊字符中的三种'
  return ''
}
