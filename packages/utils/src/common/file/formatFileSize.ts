/** 文件大小单位 */
export const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

/**
 * 格式化文件尺寸大小
 * @param bytes 文件大小
 * @returns 格式化后的字符串 `1024MB`
 */
export function formatFileSize(bytes?: number) {
  if (!bytes)
    return '0B'
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const v = (bytes / k ** i).toFixed(2)
  return `${Number(v)} ${FILE_SIZE_UNITS[i]}`
}
