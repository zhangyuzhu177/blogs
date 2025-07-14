import { Module } from '@nestjs/common'

import { CodeModule } from '../code/code.module'
import { EmailService } from './email.service'
import { EmailController } from './email.controller'

@Module({
  imports: [CodeModule],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
