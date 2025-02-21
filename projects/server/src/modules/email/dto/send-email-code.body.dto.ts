import { CodeActionDto } from "src/dto/code-action.dto";
import { EmailDto } from "src/dto/email.dto";
import { Mixin } from "ts-mixer";
import { ISendEmailCodeBodyDto } from "types";

export class SendEmailCodeBodyDto
  extends Mixin(EmailDto, CodeActionDto)
  implements ISendEmailCodeBodyDto { }
