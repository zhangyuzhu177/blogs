import { decorate } from 'ts-mixer'
import { GenerateBooleanDecorator } from 'src/utils'
import type { IStatusDto, IStatusOptionalDto } from 'types'

const DESC = '状态（true：正常、false：禁用）'

export class StatusDto implements IStatusDto {
  @decorate(GenerateBooleanDecorator(DESC))
  status: boolean
}

export class StatusOptionalDto implements IStatusOptionalDto {
  @decorate(GenerateBooleanDecorator(DESC, undefined, true))
  status?: StatusDto['status']
}
