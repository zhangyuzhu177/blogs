import { ipv4ToInt } from '.'

/**
 * 判断 ipv4 地址是否在指定的范围内
 * @param ip ipv4 地址
 * @param lowerBound 指定范围的下界
 * @param upperBound 指定范围的上界
 * @returns 是否在指定范围内（如果任意参数不是 ipv4 地址，则返回 null）
 */
export function ipv4Between(ip: any, lowerBound: any, upperBound: any) {
  const ipNum = ipv4ToInt(ip)
  let lowerNum = ipv4ToInt(lowerBound)
  let upperNum = ipv4ToInt(upperBound)

  if (ipNum === null || lowerNum === null || upperNum === null)
    return null

  if (lowerNum > upperNum)
    [upperNum, lowerNum] = [lowerNum, upperNum]

  return ipNum >= lowerNum && ipNum <= upperNum
}
