/**
 * 获取文件名的基本名
 * @param filename 文件名
 * @param ext 是否包含后缀
 * @default
 *  ext = false
 * @return 基本名
 */
export function pathBaseName(filename?: string, ext = false) {
  if (typeof filename !== 'string')
    return ''

  const lastSlashIndex = Math.max(filename.lastIndexOf('/'), filename.lastIndexOf('\\'))
  const base = filename.substring(lastSlashIndex + 1)

  if (ext) {
    return base
  }
  else {
    const lastDotIndex = base.lastIndexOf('.')
    if (lastDotIndex === -1)
      return base
    return base.substring(0, lastDotIndex)
  }
}
