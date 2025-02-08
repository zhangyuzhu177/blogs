import { decorate } from 'ts-mixer'
import { GenerateStringDecorator } from 'src/utils'
import type { INameDto, INameOptionalDto } from 'types'

const DESC = '名称'

export class NameDto implements INameDto {
  @decorate(GenerateStringDecorator(DESC))
  name: string
}

export class NameOptionalDto implements INameOptionalDto {
  @decorate(GenerateStringDecorator(DESC, undefined, true))
  name?: NameDto['name']
}
