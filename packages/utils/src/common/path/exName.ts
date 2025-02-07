/**
 * 获取文件名的扩展名
 * @param filename 文件名
 * @return 扩展名
 */
export function pathExtName(filename?: string) {
  if (typeof filename !== 'string')
    return ''

  const lastDotIndex = filename.lastIndexOf('.')
  if (lastDotIndex === -1)
    return ''

  const lastSlashIndex = Math.max(filename.lastIndexOf('/'), filename.lastIndexOf('\\'))
  if (lastDotIndex > lastSlashIndex)
    return filename.substring(lastDotIndex)

  return ''
}
