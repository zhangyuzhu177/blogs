import { CodeActionDto } from "src/dto/code-action.dto";
import { EmailDto } from "src/dto/email.dto";
import { ISendEmailCodeBodyDto } from "src/types/http/email/send-email-code.interface";
import { Mixin } from "ts-mixer";

export class SendEmailCodeBodyDto
  extends Mixin(EmailDto, CodeActionDto)
  implements ISendEmailCodeBodyDto { }
