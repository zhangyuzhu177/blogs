import { decorate } from 'ts-mixer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IRelation, IRelationDto, IRelationRawDto } from 'src/types/dto/relation.interface'

export class RelationDto implements IRelationDto {
  @ApiPropertyOptional({
    description: '要查询的关联信息',
    example: { user: { role: { permissions: true } } },
  })
  relation?: IRelation
}

export class RelationRawDto implements IRelationRawDto {
  @decorate(ApiPropertyOptional({
    description: '要查询的关联信息，请使用点号分隔，如：`role.permissions`，如果有多个关联，使用 `,` 拼接，如 `role.permissions,deleteRecord`',
  }))
  @decorate(Transform(({ value }) => relationRaw2Obj(value)))
  relation?: string
}

function createObject(path: string, base = {}) {
  const [key, ...rest] = path.split('.')
  if (rest.length === 0)
    return base[key] ? base : { ...base, [key]: true }
  return { ...base, [key]: createObject(rest.join('.')) }
}

export function relationRaw2Obj(raw: string) {
  if (typeof raw !== 'string')
    return raw
  return raw.split(',').reduce((acc, path) => (createObject(path, acc)), {})
}
