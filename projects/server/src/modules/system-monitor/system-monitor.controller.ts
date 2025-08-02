import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Controller, Get } from '@nestjs/common'

import { SystemMonitorService } from './system-monitor.service'

@Controller('system-monitor')
@ApiTags('System Monitor | 系统监控')
export class SystemMonitorController {
  constructor(
    private readonly _systemMonitorSrv: SystemMonitorService,
  ) { }

  @ApiOperation({ summary: '获取服务器信息' })
  @Get()
  public sendEmail() {
    return this._systemMonitorSrv.connect()
  }
}
