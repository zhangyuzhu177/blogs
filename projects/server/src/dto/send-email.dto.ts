import { decorate } from 'ts-mixer'
import { GenerateBooleanDecorator } from 'src/utils'
import type { ISendEmailDto, ISendEmailOptionalDto } from 'types'

const DESC = '是否发送邮件'

export class SendEmailDto implements ISendEmailDto {
  @decorate(GenerateBooleanDecorator(DESC))
  sendEmail: boolean
}

export class SendEmailOptionalDto implements ISendEmailOptionalDto {
  @decorate(GenerateBooleanDecorator(DESC, undefined, true))
  sendEmail?: ISendEmailDto['sendEmail']
}
