/**
 * 生成指定区间内的随机整数
 * @param start 最小值
 * @param end 最大值
 * @default
 *  start 0
 *  end 100
 * @return 生成的随机整数
 */
export function randomInt(start = 0, end = 100) {
  [start, end] = [Math.min(start, end), Math.max(start, end)]
  return Math.ceil(Math.random() * (end - start) + start)
}
