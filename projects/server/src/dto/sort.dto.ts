import { decorate } from 'ts-mixer'
import { IsArray } from 'src/decorators'
import { ApiProperty } from '@nestjs/swagger'
import { GenerateParamsDecorator } from 'src/utils'
import type { ISortDto, ISortOptionalDto } from 'types'

function SortDecorator(optional = false) {
  return GenerateParamsDecorator(
    [
      ApiProperty({
        description: '排序信息',
        type: Array,
        example: [{
          time: {
            order: 'ASC',
          },
        }],
      }),
      IsArray(),
    ],
    optional,
  )
}

export class SortDto<T extends object = any> implements ISortDto<T> {
  @decorate(SortDecorator())
  sort: Partial<Record<
    keyof T,
    {
      order: 'ASC' | 'DESC' | 'asc' | 'desc'
    }
  >>[]
}

export class SortOptionalDto<T extends object = any> implements ISortOptionalDto<T> {
  @decorate(SortDecorator(true))
  sort?: SortDto<T>['sort']
}
