import { getRsaClient } from '.'

/**
 * RSA 非对称加密
 * @param value 待加密的字符串
 * @param publicKey 公钥
 * @param key 混淆的关键词
 * @returns 加密后的密文
 */
export async function rsaEncrypt(
  value: string,
  publicKey: string,
  key = 'ZyzRsa',
) {
  const rsa = await getRsaClient()
  try {
    rsa?.setPublicKey(publicKey)
    const hash = rsa?.encrypt(
      `${key}${value.split('').map(char => String.fromCharCode(char.charCodeAt(0) + 1)).join('')}`,
    )
    if (!hash)
      return value
    return hash
  }
  catch (_) {
    return value
  }
}
