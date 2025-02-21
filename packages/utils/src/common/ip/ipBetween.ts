import { isIpv4, isIpv6 } from '../is'

import { getIpType, ipv4Between, ipv6Between } from '.'

/**
 * 判断 ip 地址是否在指定的数组范围内
 * @param ip ip 地址
 * @param arr 指定的数组范围
 * @returns 是否在指定的数组范围内
 */
export function ipBetween(ip?: string, arr?: string[] | string[][]) {
  try {
    const ipType = getIpType(ip)
    if (!ipType)
      return false

    return arr?.some((item) => {
      const [lowerBound, upperBound] = Array.isArray(item) ? item : item.split('-')
      if (ipType === 4 && isIpv4(lowerBound) && isIpv4(upperBound))
        return ipv4Between(ip, lowerBound, upperBound)
      else if (ipType === 6 && isIpv6(lowerBound) && isIpv6(upperBound))
        return ipv6Between(ip, lowerBound, upperBound)
      return false
    }) ?? false
  }
  catch (_) {
    return false
  }
}
