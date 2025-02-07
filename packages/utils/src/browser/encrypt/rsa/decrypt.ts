import { getRsaClient } from '.'

/**
 * RSA 非对称解密
 * @param hash 待解密的密文
 * @param privateKey 私钥
 * @param key 混淆的关键词
 * @returns 解密后的字符串
 */
export async function rsaDecrypt(
  hash: string,
  privateKey: string,
  key = 'ZyzRsa',
) {
  const rsa = await getRsaClient()
  try {
    rsa?.setPrivateKey(privateKey)
    const value = rsa?.decrypt(hash)
    if (!value)
      return hash
    return value.replace(key, '').split('').map(char => String.fromCharCode(char.charCodeAt(0) - 1)).join('')
  }
  catch (_) {
    return hash
  }
}
