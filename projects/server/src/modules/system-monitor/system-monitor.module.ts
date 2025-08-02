import { Module } from '@nestjs/common'

import { SystemMonitorController } from './system-monitor.controller'
import { SystemMonitorService } from './system-monitor.service'

@Module({
  imports: [],
  controllers: [SystemMonitorController],
  providers: [SystemMonitorService],
  exports: [SystemMonitorService],
})
export class SystemMonitorModule {}
