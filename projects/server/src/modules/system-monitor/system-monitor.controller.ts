import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { type ISystemMonitorReturnInfo, PermissionType } from 'types'

import { SuccessDto } from 'src/dto'
import { HasPermission } from 'src/guards'
import { ApiSuccessResponse } from 'src/utils'
import { SystemMonitorService } from './system-monitor.service'

@Controller('system-monitor')
@ApiTags('System Monitor | 系统监控')
export class SystemMonitorController {
  constructor(
    private readonly _systemMonitorSrv: SystemMonitorService,
  ) { }

  @ApiOperation({ summary: '获取服务监控信息' })
  @ApiSuccessResponse(SuccessDto<ISystemMonitorReturnInfo>)
  @HasPermission(PermissionType.SYSTEM_MONITOR_QUERY)
  @Get('server-info')
  public getSystemInfo() {
    return this._systemMonitorSrv.getSystemInfo()
  }
}
