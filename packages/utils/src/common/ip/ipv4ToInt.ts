import { isIpv4 } from '../is'

/**
 * 将 ipv4 地址转换为整数
 * @param ip ipv4 地址
 * @returns 转换后的整数（如果无法转换，则返回 null）
 */
export function ipv4ToInt(ip: any) {
  if (!isIpv4(ip))
    return null

  let ipl = 0;
  (ip as string).split('.').forEach((octet) => {
    ipl <<= 8
    ipl += Number.parseInt(octet)
  })
  return (ipl >>> 0)
}
