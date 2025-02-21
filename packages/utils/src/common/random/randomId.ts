import { randomString } from '.'

/**
 * 生成长度为 36 位的随机 id
 * @param type 生成 id 的类型（`upper`：大写，`lower`：小写）
 * @return 生成的 id
 */
export function randomId(type?: 'upper' | 'lower') {
  const chars = randomString(36, 36, '').split('')
  chars[8] = chars[13] = chars[18] = chars[23] = '-'
  const id = chars.join('')
  return type === 'upper'
    ? id.toUpperCase()
    : type === 'lower'
      ? id.toLowerCase()
      : id
}
