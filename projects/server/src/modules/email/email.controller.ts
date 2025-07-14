import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { EmailService } from './email.service'
import { SendEmailCodeBodyDto } from './dto/send-email-code.body.dto'

@Controller('email')
@ApiTags('Email | 邮件服务')
export class EmailController {
  constructor(
    private readonly _emailSrv: EmailService,
  ) { }

  @ApiOperation({ summary: '发送验证码' })
  @Post()
  public sendEmail(@Body() body: SendEmailCodeBodyDto) {
    return this._emailSrv.sendCode(body)
  }
}
