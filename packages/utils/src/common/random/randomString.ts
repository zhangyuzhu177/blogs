import { PASSWORD_ALLOW_CHARS, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '../validator'

import { randomInt } from '.'

/**
 * 根据配置生成随机字符串
 * @param min 最小长度
 * @param max 最大长度
 * @param special 允许的特殊字符
 * @default
 *  min 24
 *  max 24
 *  special !@#$%^&*()_+-=,.:;?~
 * @return 生成的字符串
 */
export function randomString(min = PASSWORD_MIN_LENGTH, max = PASSWORD_MAX_LENGTH, special = PASSWORD_ALLOW_CHARS) {
  [min, max] = [Math.min(min, max), Math.max(min, max)]
  min < 0 && (min = 0)
  if (max <= 0)
    return ''

  const length = randomInt(min, max)
  const num = '0123456789'
  const chars = 'abcdefghijklmnopqrstuvwxyz'

  /** 特殊字符的数量 */
  const specialNum = special ? randomInt(1, Math.min(4, length)) : 0
  /** 大写字母的数量 */
  const upperCharNum = randomInt(1, (length - specialNum) / 2)
  /** 数字的数量 */
  const numNum = randomInt(1, (length - specialNum - upperCharNum) / 2)
  /** 小写字母的数量 */
  const lowerCharNum = (length - specialNum - upperCharNum - numNum) || 1

  let password = ''
  const randomC = (dict: string) => dict[randomInt(0, dict.length - 1)]

  for (let i = 0; i < specialNum; i++)
    password += randomC(special)
  for (let i = 0; i < upperCharNum; i++)
    password += randomC(chars.toUpperCase())
  for (let i = 0; i < numNum; i++)
    password += randomC(num)
  for (let i = 0; i < lowerCharNum; i++)
    password += randomC(chars)

  password = password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('')
    .substring(0, length)
  return password
}
