import { getIpType, ipv4ToInt, ipv6ToBigint } from '../ip'

/** ip 地址的要求描述 */
export const IP_REQUIREMENTS_DESC = '字符串数组，每个元素由一个起始地址和一个结束地址组成，使用 - 连接'

/**
 * 校验一个 ip 地址范围数组是否符合要求
 * @param arr 待校验的 ip 地址范围数组
 * @returns 如果符合要求，返回空字符串，否则返回错误信息
 */
export function validateIp(arr?: string[] | string[][]) {
  if (!Array.isArray(arr))
    return 'ip 地址范围必须是字符串数组'

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    const [lowerBound, upperBound] = Array.isArray(item) ? item : item.split('-')
    const lowerBoundType = getIpType(lowerBound)
    const upperBoundType = getIpType(upperBound)

    if (!lowerBoundType)
      return `ip 地址范围第 ${i + 1} 行的起始地址不符合要求`
    if (!upperBoundType)
      return `ip 地址范围第 ${i + 1} 行的结束地址不符合要求`
    if (lowerBoundType !== upperBoundType)
      return `ip 地址范围第 ${i + 1} 行的起始地址和结束地址类型不一致`

    if (
      (lowerBoundType === 4 && (ipv4ToInt(lowerBound) as number) > (ipv4ToInt(upperBound) as number))
      || (lowerBoundType === 6 && (ipv6ToBigint(lowerBound) as bigint) > (ipv6ToBigint(upperBound) as bigint))
    )
      return `ip 地址范围第 ${i + 1} 行的起始地址不能大于结束地址`
  }

  return ''
}
