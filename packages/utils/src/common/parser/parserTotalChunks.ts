/**
 * 将 total 划分为 count 小块
 * @param total 总数
 * @param count 份额
 * @return 划分后的数组
 */
export function parseTotalChunks(total = 0, count = 0) {
  // 每份的理想大小
  const idealChunkSize = Math.floor(total / count)
  // 需要增加大小的份数
  const extra = total % count
  const result = []
  let start = 1
  for (let i = 0; i < count && start <= total; i++) {
    // 如果当前索引小于 extra，则这份会比理想的 chunkSize 多1
    const end = start + (i < extra ? idealChunkSize : idealChunkSize - 1)
    result.push([start, end])
    start = end + 1
  }

  return result
}
