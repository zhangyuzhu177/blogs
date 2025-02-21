import { decorate } from 'ts-mixer'
import { GenerateNumberDecorator } from 'src/utils'
import type { IOrderDto, IOrderOptionalDto } from 'types'

const DESC = '排序'

export class OrderDto implements IOrderDto {
  @decorate(GenerateNumberDecorator(DESC))
  order: number
}

export class OrderOptionalDto implements IOrderOptionalDto {
  @decorate(GenerateNumberDecorator(DESC, undefined, true))
  order?: OrderDto['order']
}
