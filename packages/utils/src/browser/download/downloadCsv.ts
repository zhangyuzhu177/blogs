import { downloadUrl } from '.'

/**
 * 将 CSV 文件内容下载到本地
 * @param csvRaw csv 文件内容
 * @param name 文件名
 * @default name 未命名文件
 */
export function downloadCsv(csvRaw: string, name?: string) {
  const url = `data:text/csv;charset=utf-8,\uFEFF${encodeURIComponent(csvRaw)}`
  downloadUrl(url, name)
}
