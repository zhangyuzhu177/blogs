import { isIpv6 } from '../is'
import { ipv6ToStandard } from '.'

/**
 * 将 ipv6 地址转换为 Bigint
 * @param ip ipv6 地址
 * @returns 转换后的整数（如果无法转换，则返回 null）
 */
export function ipv6ToBigint(ip: any) {
  ip = ipv6ToStandard(ip)
  if (!isIpv6(ip))
    return null

  let num = 0n
  let exp = 0n
  const parts = (ip as string).split(':')
  for (const n of parts.map(part => BigInt(Number.parseInt(part, 16))).reverse()) {
    num += n * (2n ** exp)
    exp += 16n
  }
  return num
}
