import { decorate } from 'ts-mixer'
import { GenerateStringDecorator } from 'src/utils'
import type { IDescDto, IDescOptionalDto } from 'types'

const DESC = '描述'

export class DescDto implements IDescDto {
  @decorate(GenerateStringDecorator(DESC))
  desc: string
}

export class DescOptionalDto implements IDescOptionalDto {
  @decorate(GenerateStringDecorator(DESC, undefined, true))
  desc?: DescDto['desc']
}
