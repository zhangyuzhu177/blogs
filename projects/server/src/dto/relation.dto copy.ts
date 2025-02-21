import { decorate } from 'ts-mixer'
import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import type { IRelationRawDto } from 'types'
import { GenerateParamsDecorator } from 'src/utils'

function createObject(path: string, base = {}) {
  const [key, ...rest] = path.split('.')
  if (rest.length === 0)
    return base[key] ? base : { ...base, [key]: true }
  return { ...base, [key]: createObject(rest.join('.')) }
}

function relationRaw2Obj(raw: string) {
  if (typeof raw !== 'string')
    return raw
  return raw.split(';')
    .reduce((acc, path) => (createObject(path, acc)), {})
}

export class RelationRawDto implements IRelationRawDto {
  @decorate(GenerateParamsDecorator(
    [
      ApiProperty({
        description: '需要查询的关联信息, 按 `adminRole;adminRole.permissions` 的格式将多个要关联的字段用 `;` 拼接',
        type: String,
        example: 'adminRole;adminRole.permissions',
      }),
      Transform(({ value }) => relationRaw2Obj(value)),
    ],
    true,
  ))
  relation?: string
}
