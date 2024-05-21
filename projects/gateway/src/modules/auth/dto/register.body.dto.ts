import { AccountDto } from "src/dto/account.dto";
import { CodeVerifyDto } from "src/dto/code-verify.dto";
import { EmailDto } from "src/dto/email.dto";
import { PasswordDto } from "src/dto/password.dto";
import { IRegisterBodyDto } from "src/types/http/auth/register.interface";
import { Mixin } from "ts-mixer";

export class RegisterBodyDto extends Mixin(
  AccountDto,
  PasswordDto,
  EmailDto,
  CodeVerifyDto
) implements IRegisterBodyDto {}
