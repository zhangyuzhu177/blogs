import { isIpv6 } from '../is'

/**
 * 将 ipv6 地址转换为标准无零压缩的格式
 * @param ip ipv6 地址
 * @returns 转换后的标准格式（如果不是 ipv6 地址，则返回 null）
 */
export function ipv6ToStandard(ip: any) {
  if (typeof ip !== 'string' || !isIpv6(ip))
    return null

  if (ip.includes('.')) {
    ip = ip.split(':').map((part) => {
      if (part.includes('.')) {
        const [a, b, c, d] = part.split('.').map(str => Number(str).toString(16).padStart(2, '0'))
        return `${a}${b}:${c}${d}`
      }
      else {
        return part
      }
    }).join(':')
  }

  const parts = (ip as string).split(':')
  const index = parts.indexOf('')

  if (index !== -1) {
    while (parts.length < 8)
      parts.splice(index, 0, '')
  }

  return parts.map(part => part.padStart(4, '0')).join(':')
}
