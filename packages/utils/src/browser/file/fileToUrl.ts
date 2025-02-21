/**
 * 将文件转为可预览的 URL
 * @param file 要转换的文件
 * @returns 可预览的 URL
 */
export function fileToUrl(file: File) {
  return window.URL.createObjectURL(file)
}
