import { decorate } from 'ts-mixer'
import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString } from 'src/decorators'
import { GenerateParamsDecorator } from 'src/utils'
import type { ISelectDto, ISelectOptionalDto } from 'types'

function SelectDecorator(optional = false) {
  return GenerateParamsDecorator(
    [
      ApiProperty({
        description: '查询字段',
        type: Array,
      }),
      IsArray(),
      IsString({ each: true }),
    ],
    optional,
  )
}

export class SelectDto<T extends object = any> implements ISelectDto<T> {
  @decorate(SelectDecorator())
  select: (keyof T)[]
}

export class SelectOptionalDto<T extends object = any> implements ISelectOptionalDto<T> {
  @decorate(SelectDecorator(true))
  select?: SelectDto<T>['select']
}
