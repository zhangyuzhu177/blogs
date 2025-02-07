import { downloadUrl } from '.'

/**
 * 将 JSON 文件内容下载到本地
 * @param jsonContent json 文件内容
 * @param name 文件名
 * @default name 未命名文件
 */
export function downloadJson(jsonContent: object, name?: string) {
  const jsonStr = encodeURIComponent(JSON.stringify(jsonContent, null, '\t'))
  const url = `data:application/json;charset=utf-8,\uFEFF${jsonStr}`
  downloadUrl(url, name)
}
