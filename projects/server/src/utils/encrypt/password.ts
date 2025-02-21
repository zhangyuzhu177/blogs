import * as bcrypt from 'bcrypt'

/**
 * 对密码进行加密
 */
export function encryptPassword(password: string) {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

/**
 * 校验密码是否正确
 */
export function comparePassword(password?: string, hash?: string) {
  return bcrypt.compare(password ?? '', hash ?? '')
}
