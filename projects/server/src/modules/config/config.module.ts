import { Module } from '@nestjs/common';
import { SysConfigService } from './config.service';
import { ConfigController } from './config.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Config } from 'src/entities/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Config])
  ],
  controllers: [ConfigController],
  providers: [SysConfigService],
})
export class SysConfigModule {}
