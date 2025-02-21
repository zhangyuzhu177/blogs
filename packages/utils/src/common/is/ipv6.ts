/** IPV6 地址的正则表达式 */
export const IPV6_REG = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i

/**
 * 判断传入的字符串是否为ipv6地址
 * @param value 传入的字符串
 * @returns 是否为ipv6地址
 */
export function isIpv6(value: any) {
  return typeof value === 'string' && IPV6_REG.test(value)
}
