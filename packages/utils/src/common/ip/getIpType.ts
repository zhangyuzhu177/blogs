import { isIpv4, isIpv6 } from '../is'

/**
 * 获取 ip 地址的类型（ipv4 或 ipv6）
 * @param ip ip 地址
 * @returns ip 地址的类型（4：ipv4；6：ipv6；0：不是ip地址）
 */
export function getIpType(ip: any) {
  if (isIpv4(ip))
    return 4
  else if (isIpv6(ip))
    return 6
  return 0
}
