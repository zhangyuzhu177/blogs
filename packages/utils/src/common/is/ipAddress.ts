import { isIpv4, isIpv6 } from '.'

/**
 * 判断传入的字符串是否为ip地址（ipv4 或 ipv6）
 * @param value 传入的字符串
 * @returns 是否为ip地址
 */
export function isIpAddress(value: any) {
  return isIpv4(value) || isIpv6(value)
}
