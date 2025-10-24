import { Repository } from 'typeorm'
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { DailyCount } from 'src/entities/daily-count'

@Injectable()
export class DailyCountService {
  private readonly _logger = new Logger(DailyCountService.name)

  constructor(
    @InjectRepository(DailyCount)
    private readonly _dailyCountRepo: Repository<DailyCount>,
  ) {}

  /**
   * 获取日期
   */
  private _getDate(ip?: string, src = new Date()) {
    const year = src.getFullYear()
    const month = src.getMonth() + 1
    const date = src.getDate()

    const id = `${year}-${month}-${date}-${ip}`
    return { id, year, month, date }
  }

  /**
   * 记录访问量
   */
  async recordAccess(ip: string) {
    const { id, year, month, date } = this._getDate(ip)

    if (await this._dailyCountRepo.existsBy({ id }))
      return

    try {
      const updateRes = await this._dailyCountRepo.increment({ id }, 'access', 1)
      if (!updateRes.affected) {
        await this._dailyCountRepo.insert({ id, year, month, date, ip })
        this._logger.verbose(`新的每日记录 ${id}`)
      }
    }
    catch (e) {
      await this._dailyCountRepo.increment({ id }, 'access', 1)
    }
  }

  /**
   * 获取最近7天的访问量
   */
  async getAccessLast7Days() {
    const infos = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      infos.push({
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        date: d.getDate(),
        label: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
      })
    }
    // 查询最近7天所有匹配记录
    const counts = await this._dailyCountRepo.find({
      where: infos.map(({ year, month, date }) => ({ year, month, date })),
    })

    // 组装结果，确保每一天都有一条（没有访问时 access = 0）
    const results = infos
      .reverse() // 可选：反转，让结果按时间正序（最早 → 最新）
      .map((info) => {
        const match = counts.find(
          c => c.year === info.year && c.month === info.month && c.date === info.date,
        )
        return {
          ...info,
          access: match?.access ?? 0,
        }
      })

    return results
  }

  /**
   * 获取当月的访问量
   */
  async getAccessThisMonth(ip?: string) {
    const { year, month } = this._getDate(ip)

    const q = this.qb()
      .select('SUM(dc.access)', 'sum')
      .where('dc.year = :year', { year })
      .andWhere('dc.month = :month', { month })

    if (ip)
      q.andWhere('dc.ip = :ip', { ip })

    const { total } = await q.getRawOne<{ total: string | null }>()

    return Number(total) || 0
  }

  /**
   * 获取当天的访问量
   */
  async getAccessToday() {
    const { year, month, date } = this._getDate()
    const { sum } = await this.qb()
      .select('SUM(dc.access)', 'sum')
      .where('dc.year = :year', { year })
      .andWhere('dc.month = :month', { month })
      .andWhere('dc.date = :date', { date })
      .getRawOne<{ sum: string | null }>()

    return Number(sum) || 0
  }

  /**
   * 获取总的访问量
   */
  async getAccessTotal() {
    return await this._dailyCountRepo.sum('access') || 0
  }

  public qb(alias = 'dc') {
    return this._dailyCountRepo.createQueryBuilder(alias)
  }

  public repo() {
    return this._dailyCountRepo
  }
}
