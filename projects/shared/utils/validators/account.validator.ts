export const ACCOUNT_MAX_LENGTH = 16
export const ACCOUNT_MIN_LENGTH = 4
export const ACCOUNT_ALLOW_CHARS = '_-'
export const ACCOUNT_REQUIREMENTS_DESC = `账号为${ACCOUNT_MIN_LENGTH}-${ACCOUNT_MAX_LENGTH}位，由大小写字母、数字及特殊字符 ${ACCOUNT_ALLOW_CHARS} 组成，且必须以字母开头`

/**
 * 校验一个账号是否符合要求
 * @param account 待校验的账号
 * @returns 如果符合要求，返回空字符串，否则返回错误信息
 */
export function validateAccount(account: string) {
  if (/^[^A-Za-z]/.test(account))
    return '账号必须以字母开头'
  if (/^\d/.test(account))
    return '账号不能以数字开头'
  if (account.length < ACCOUNT_MIN_LENGTH)
    return `账号长度不得小于 ${ACCOUNT_MIN_LENGTH}`
  if (account.length > ACCOUNT_MAX_LENGTH)
    return `账号长度不得大于 ${ACCOUNT_MAX_LENGTH}`

  // 检测特殊字符
  const specialChars = account.split('').filter(char => !/[a-zA-Z0-9]/.test(char))
  const notAllowedChar = specialChars.find(char => !ACCOUNT_ALLOW_CHARS.includes(char))
  if (notAllowedChar)
    return `特殊字符 “${notAllowedChar}” 不被允许`
  return ''
}
