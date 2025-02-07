import * as NodeRSA from 'node-rsa'

let rsa: NodeRSA

function initRsa() {
  const { RSA_PUBLIC_KEY, RSA_PRIVATE_KEY } = process.env

  rsa = new NodeRSA()
  rsa.setOptions({ encryptionScheme: 'pkcs1' })
  rsa.importKey(RSA_PUBLIC_KEY, 'pkcs8-public')
  rsa.importKey(RSA_PRIVATE_KEY, 'pkcs8-private')
}

/**
 * 对字符串进行 rsa 加密
 */
export function rsaEncrypt(str: string, key = 'QiyanData') {
  if (!rsa)
    initRsa()

  return rsa.encrypt(
    `${key}${str.split('').map(char => String.fromCharCode(char.charCodeAt(0) + 1)).join('')}`,
    'base64',
  )
}

/**
 * 对密文进行 rsa 解密
 */
export function rsaDecrypt(hash: string, key = 'QiyanData') {
  if (!rsa)
    initRsa()

  try {
    const str = rsa.decrypt(hash, 'utf8')
    if (!str)
      return hash
    return str.replace(key, '').split('').map(char => String.fromCharCode(char.charCodeAt(0) - 1)).join('')
  }
  catch (_) {
    return hash
  }
}
