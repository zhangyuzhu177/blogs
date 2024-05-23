import { downloadUrl } from './downloadUrl'

/**
 * 将CSV文件内容下载到本地
 * @param csvRaw csv文件内容
 * @param name 文件名
 */
export function downloadCsv(csvRaw: string, name?: string) {
  const url = `data:text/csv;charset=utf-8,\uFEFF${encodeURIComponent(csvRaw)}`
  downloadUrl(url, name)
}
