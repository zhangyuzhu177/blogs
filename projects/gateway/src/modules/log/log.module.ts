import { Global, Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyCount } from 'src/entities/daily-count';
import { DailyCountService } from './daily-count/daily-count.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([DailyCount]),
  ],
  controllers: [LogController],
  providers: [LogService, DailyCountService],
  exports: [LogService, DailyCountService],
})
export class LogModule {}
