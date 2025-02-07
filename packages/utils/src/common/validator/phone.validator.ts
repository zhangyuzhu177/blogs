/** 手机号的最小长度 */
export const PHONE_NUMBER_MIN_LENGTH = 11
/** 手机号的最大长度 */
export const PHONE_NUMBER_MAX_LENGTH = 11
/** 手机号的要求描述 */
export const PHONE_NUMBER_REQUIREMENTS_DESC = '手机号码必须是 11 位数字'

/**
 * 校验一个手机号是否符合要求
 * @param phone 待校验的手机号
 * @returns 如果符合要求，返回空字符串，否则返回错误信息
 */
export function validatePhone(phone?: string | number): string {
  if (typeof phone === 'number')
    phone = phone.toString()
  if (typeof phone !== 'string')
    return '手机号码必须是字符串'
  if (phone.length < PHONE_NUMBER_MIN_LENGTH)
    return `手机号码长度不得小于 ${PHONE_NUMBER_MIN_LENGTH} 位`
  if (phone.length > PHONE_NUMBER_MAX_LENGTH)
    return `手机号码长度不得大于 ${PHONE_NUMBER_MAX_LENGTH} 位`
  // 以 1 开头，后面跟 10 位数字
  if (!/^1\d{10}$/.test(phone))
    return '手机号码格式有误'
  return ''
}
