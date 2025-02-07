/**
 * 将数组转换为 CSV
 */
export function arrayToCsv(data: any[][]) {
  // 构建 CSV 内容
  const rows = data.map(row => (
    row.map(cell => (
      `"${String(cell ?? '').replace(/"/g, '""')}"`
    )).join(',')
  )).join('\r\n')

  return rows
}
