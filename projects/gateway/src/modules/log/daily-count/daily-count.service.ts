import { In, Repository } from 'typeorm'
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
  private _getDate(src = new Date()) {
    const year = src.getFullYear()
    const month = src.getMonth() + 1
    const date = src.getDate()

    const id = `${year}-${month}-${date}`
    return { id, year, month, date }
  }

  /**
   * 记录访问量
   */
  async recordAccess() {
    const { id, year, month, date } = this._getDate()
    try {
      const updateRes = await this._dailyCountRepo.increment({ id }, 'access', 1)
      if (!updateRes.affected) {
        await this._dailyCountRepo.insert({ id, year, month, date })
        this._logger.log('new daily-count record')
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
      const info = this._getDate(new Date(Date.now() - i * 24 * 60 * 60 * 1000))
      infos.push(info)
    }
    const counts = await this._dailyCountRepo.find({
      where: { id: In(infos.map(i => i.id)) },
    })
    return infos.map(info => counts.find(c => c.id === info.id) || { ...info, access: 0 })
  }

  /**
   * 获取当天的访问量
   */
  async getAccessToday() {
    const { id } = this._getDate()
    return Number(
      (await this._dailyCountRepo.findOne({ where: { id } })).access || 0,
    )
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
