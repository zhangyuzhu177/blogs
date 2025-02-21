import { decorate } from 'ts-mixer'
import { GenerateStringDecorator } from 'src/utils'
import type { IAccountDto, IAccountOptionalDto } from 'types'

const DESC = '账号'

export class AccountDto implements IAccountDto {
  @decorate(GenerateStringDecorator(DESC))
  account: string
}

export class AccountOptionalDto implements IAccountOptionalDto {
  @decorate(GenerateStringDecorator(DESC, undefined, true))
  account?: AccountDto['account']
}
