import * as crypto from 'node:crypto'
import type { BinaryLike } from 'node:crypto'

/**
 * 对字符串进行 md5 加密
 */
export function md5(src: BinaryLike) {
  const hash = crypto.createHash('md5')
  hash.update(src)
  return hash.digest('hex')
}
