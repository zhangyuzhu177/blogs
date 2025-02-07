import * as crypto from 'node:crypto'

/**
 * 对字符串进行 sha512 加密
 */
export function sha512(str: string) {
  const sha = crypto.createHash('sha512')
  sha.update(str, 'utf8')
  return sha.digest('hex')
}
