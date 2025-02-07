/**
 * 根据指定链接下载文件到本地
 * @param url 链接
 * @param name 文件名
 * @default name 未命名文件
 */
export function downloadUrl(url: string, name = '未命名文件') {
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
}
