import { validateString } from './string.validator'

export const PASSWORD_MAX_LENGTH = 24
export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_ALLOW_CHARS = '!#$%^&*()_+-='
export const PASSWORD_REQUIREMENTS_DESC = `密码为${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH}位，不得包含 ${PASSWORD_ALLOW_CHARS} 以外的特殊字符，且至少包含大小写字母、数字和特殊字符中的三种`

/**
 * 校验一个密码是否符合要求
 * @param password 待校验的密码
 * @returns 如果符合要求，返回空字符串，否则返回错误信息
 */
export function validatePassword(password: string) {
  if (typeof password !== 'string')
    return '密码必须是字符串'
  if (password.length < PASSWORD_MIN_LENGTH)
    return `密码长度不得小于 ${PASSWORD_MIN_LENGTH}`
  if (password.length > PASSWORD_MAX_LENGTH)
    return `密码长度不得大于 ${PASSWORD_MAX_LENGTH}`

  // 检测特殊字符
  const specialChars = password.split('').filter(char => !/[a-zA-Z0-9]/.test(char))
  const notAllowedChar = specialChars.find(char => !PASSWORD_ALLOW_CHARS.includes(char))
  if (notAllowedChar)
    return `不得包含 ${PASSWORD_ALLOW_CHARS} 以外的特殊字，特殊字符 “${notAllowedChar}” 不被允许`
  if (validateString(password) < 3)
    return '至少包含大小写字母、数字和特殊字符中的三种'
  return ''
}
