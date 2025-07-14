import { Mixin } from 'ts-mixer'
import { EmailDto } from 'src/dto/email.dto'
import type { ISendEmailCodeBodyDto } from 'types'
import { CodeActionDto } from 'src/dto/code-action.dto'

export class SendEmailCodeBodyDto
  extends Mixin(EmailDto, CodeActionDto)
  implements ISendEmailCodeBodyDto { }
