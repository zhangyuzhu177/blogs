/**
 * 横杠拼接 转 驼峰命名
 * @param str 要转换的字符串
 * @param upperFirst 是否将首字母转为大写
 * @return 驼峰命名的字符串（首字母是否大写取决于 `upperFirst` 参数）
 */
export function dash2Camel(str: string, upperFirst?: boolean) {
  const res = str.replace(/-([a-z])/g, (m, w) => w.toUpperCase())
  return (upperFirst ? res[0]?.toUpperCase() : res[0]?.toLowerCase()) + res.slice(1)
}
