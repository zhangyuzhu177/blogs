import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Config } from 'src/entities/config'
import { SysConfigService } from './config.service'
import { ConfigController } from './config.controller'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Config]),
  ],
  controllers: [ConfigController],
  providers: [SysConfigService],
})
export class SysConfigModule {}
