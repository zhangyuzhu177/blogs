import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsOptional } from 'class-validator'
import { AccountDto } from 'src/dto/account.dto'
import { EmailDto } from 'src/dto/email.dto'
import { PasswordOptionalDto } from 'src/dto/password.dto'
import { Mixin } from 'ts-mixer'
import { IUpdateUserBodyDto } from 'src/types/http/user/update-user.interface';
import { PhoneOptionalDto } from 'src/dto/phone.dto'

export class UpdateUserBodyDto extends Mixin(
  AccountDto,
  EmailDto,
  PasswordOptionalDto,
  PhoneOptionalDto,
) implements IUpdateUserBodyDto {
  @ApiPropertyOptional({ description: '账号是否被删除' })
  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean

  @ApiPropertyOptional({ description: '是否给用户发送邮件' })
  @IsBoolean()
  @IsOptional()
  sendEmail?: boolean
}
