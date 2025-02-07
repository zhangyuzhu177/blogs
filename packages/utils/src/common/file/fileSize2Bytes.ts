import { FILE_SIZE_UNITS } from '.'

/**
 * 格式化文件尺寸大小转换为字节数
 * @param size 文件尺寸大小
 * @returns 对应的字节数
 */
export function fileSize2Bytes(size?: string) {
  if (!size)
    return 0

  const num = Number.parseFloat(size)
  const regex = new RegExp(`^(-?\\d+(?:\\.\\d+)?)\\s?(${FILE_SIZE_UNITS.join('|')})$`, 'i')
  const matches = size.match(regex)
  if (!matches || !matches[2])
    return 0
  const k = 1024
  const i = FILE_SIZE_UNITS.findIndex(v => v === matches[2].toUpperCase())
  if (i === -1)
    return 0
  return num * k ** i
}
