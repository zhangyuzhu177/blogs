import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { CodeModule } from '../code/code.module';

@Module({
  imports: [CodeModule],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
