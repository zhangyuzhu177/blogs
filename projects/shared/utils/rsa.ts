import { isClient } from '@vueuse/core'

let rsa: JSEncrypt | undefined

/**
 * 加载jsencrypt
 */
async function loadRsa() {
  if (isClient && !rsa) {
    const JSEncrypt = (await import('jsencrypt/bin/jsencrypt.min.js')).default
    rsa = new JSEncrypt()
  }
}

/**
 * 对字符串进行rsa加密
 */
export async function rsaEncrypt(
  password: string,
  publicKey: string = import.meta.env.VITE_PUBLIC_KEY ?? '',
  key = 'blogsUsO',
) {
  if (!rsa)
    await loadRsa()

  rsa?.setPublicKey(publicKey)
  const encryptData = rsa?.encrypt(
    `${key}${password.split('').map(char => String.fromCharCode(char.charCodeAt(0) + 1)).join('')}`,
  )
  if (!encryptData)
    return password
  else
    return encryptData
}

/**
 * 对密文进行rsa解密
 */
export async function rsaDecrypt(
  hash: string,
  privateKey: string = import.meta.env.VITE_PRIVATE_KEY ?? '',
  key = 'blogsUsO',
) {
  if (!rsa)
    await loadRsa()

  try {
    rsa?.setPrivateKey(privateKey)
    const str = rsa?.decrypt(hash)
    if (!str)
      return hash
    return str.replace(key, '').split('').map(char => String.fromCharCode(char.charCodeAt(0) - 1)).join('')
  }
  catch (_) {
    return hash
  }
}
