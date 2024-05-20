import { AccountOptionalDto } from "src/dto/account.dto";
import { CodeVerifyDto } from "src/dto/code-verify.dto";
import { EmailOptionalDto } from "src/dto/email.dto";
import { PasswordDto } from "src/dto/password.dto";
import { ILoginByPasswordBodyDto } from "src/types/http/auth/login-by-password.interface";
import { Mixin } from "ts-mixer";

export class LoginByPasswordBodyDto
  extends Mixin(
    AccountOptionalDto,
    EmailOptionalDto,
    PasswordDto,
    CodeVerifyDto
  )
  implements ILoginByPasswordBodyDto { }
