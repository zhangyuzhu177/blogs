import { decorate } from 'ts-mixer'
import { ID_EXAMPLE } from 'types'
import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString } from 'src/decorators'
import { GenerateParamsDecorator } from 'src/utils'
import type { IIdsDto, IIdsOptionalDto } from 'types'

function IdsDecorator(optional = false) {
  return GenerateParamsDecorator(
    [
      ApiProperty({
        description: '实体唯一标识的数组',
        type: [String],
        example: [ID_EXAMPLE],
      }),
      IsArray(),
      IsString({ each: true }),
    ],
    optional,
  )
}

export class IdsDto implements IIdsDto {
  @decorate(IdsDecorator())
  ids: string[]
}

export class IdsOptionalDto implements IIdsOptionalDto {
  @decorate(IdsDecorator(true))
  ids?: IdsDto['ids']
}
