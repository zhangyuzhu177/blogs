import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { LogService } from './log.service'
import { DailyCountService } from './daily-count/daily-count.service'

@Controller('log')
@ApiTags('Log | 日志')
export class LogController {
  constructor(
    private readonly logService: LogService,
    private readonly _dailyCountSrv: DailyCountService,
  ) { }

  @ApiOperation({ summary: '获取总访问量、今日访问量' })
  @Get('visit-count')
  public async getVisitCount() {
    return {
      total: await this._dailyCountSrv.getAccessTotal(),
      today: await this._dailyCountSrv.getAccessToday(),
    }
  }
}
