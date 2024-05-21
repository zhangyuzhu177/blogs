/**
 * 每日统计
 */
export interface IDailyCount {
  /** 每日统计唯一标识 */
  id: string
  /** 年份 */
  year: number
  /** 月份 */
  month: number
  /** 日期 */
  date: number
  /** 用户访问量 */
  access: number
}
