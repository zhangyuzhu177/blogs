/** IPV4 地址的正则表达式 */
export const IPV4_REG = /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/

/**
 * 判断传入的字符串是否为ipv4地址
 * @param value 传入的字符串
 * @returns 是否为ipv4地址
 */
export function isIpv4(value: any) {
  return typeof value === 'string' && IPV4_REG.test(value)
}
