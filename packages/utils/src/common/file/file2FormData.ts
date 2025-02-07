/**
 * 将指定文件转换为FormData
 * @param file 指定文件
 * @returns FormData
 */
export function file2FormData(file: File) {
  const fromData = new FormData()
  fromData.append('file', file)
  return fromData
}
