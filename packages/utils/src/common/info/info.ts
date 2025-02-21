import { validateEmail, validatePhone } from '../validator'

/**
 * 隐藏敏感信息
 * @param info 需处理的信息（邮箱/手机号/身份证号/姓名）
 * @returns 隐藏后的信息
 */
export function hideSensitiveInfo(info?: string) {
  if (!info)
    return ''

  let result = ''
  // 邮箱
  if (!validateEmail(info)) {
    const atIndex = info.indexOf('@')
    if (atIndex) {
      const username = info.slice(0, atIndex)
      const domain = info.slice(atIndex + 1)
      let hiddenUsername
      if (atIndex > 4)
        hiddenUsername = username.slice(0, 3) + '*'.repeat(username.length - 3)
      else if (atIndex > 2 && atIndex <= 4)
        hiddenUsername = username.slice(0, 2) + '*'.repeat(username.length - 2)
      else
        hiddenUsername = `${username.slice(0, 1)}*`
      result = `${hiddenUsername}@${domain}`
    }
  }
  // 手机号
  else if (!validatePhone(info)) {
    result = `${info.slice(0, 3)}******${info.slice(info.length - 2)}`
  }
  // 身份证号
  else if (/^(\d{17}[\dXx])$/.test(info)) {
    result = `${info.slice(0, 3)}${'*'.repeat(info.length - 7)}${info.slice(info.length - 4)}`
  }
  // 姓名
  else {
    const firstChar = info.charAt(0)
    result = `${firstChar}${'*'.repeat(info.length - (info.length > 2 ? 2 : 1))}`
    if (info.length > 2)
      result += info.charAt(info.length - 1)
  }

  return result || info
}
