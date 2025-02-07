import { AES, enc } from 'crypto-js'

/**
 * AES 对称解密
 * @param hash 待解密的密文
 * @param key 秘钥
 * @returns 解密后的字符串
 */
export function aesDecrypt(hash: string, key: string) {
  return AES.decrypt(hash, key).toString(enc.Utf8)
}
