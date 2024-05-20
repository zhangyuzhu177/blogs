import * as crypto from 'node:crypto'

export function md5(src: any) {
  const hash = crypto.createHash('md5')
  hash.update(src)
  return hash.digest('hex')
}
