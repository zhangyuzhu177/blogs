import { AES } from 'crypto-js'

/**
 * AES 对称加密
 * @param value 待加密的字符串
 * @param key 秘钥
 * @returns 加密后的密文
 */
export function aesEncrypt(value: string, key: string) {
  return AES.encrypt(value, key).toString()
}
