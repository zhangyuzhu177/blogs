/**
 * 驼峰命名 转 横杠拼接
 * @param str 要转换的命名
 * @return 横杠拼接的字符串
 */
export function camel2Dash(str: string) {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
}
