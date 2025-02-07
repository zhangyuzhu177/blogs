import { decorate } from 'ts-mixer'
import type { FindOneOptions } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import type { IQueryDto, IQueryResDto } from 'types'
import { GenerateParamsDecorator, sharedVariableMarkdown } from 'src/utils'

import { SuccessDto } from './success.dto'
import { PaginatedResData, QueryPagination } from './pagination.dto'

export class QueryDto<T> implements IQueryDto<T> {
  @decorate(GenerateParamsDecorator([
    ApiProperty({
      description: '分页信息',
      type: QueryPagination,
    }),
  ], true))
  pagination?: QueryPagination

  @decorate(GenerateParamsDecorator([
    ApiProperty({
      description: '过滤条件，已定义类型，请直接使用 `IQueryDto` 中的 `where` 类型' + `\n${sharedVariableMarkdown('IQueryDto', 'cloud-types', '类型定义')}`,
      type: Object,
    }),
  ], true))
  where?: FindOneOptions<T>['where']

  @decorate(GenerateParamsDecorator([
    ApiProperty({
      description: '排序信息，已定义类型，请直接使用 `IQueryDto` 中的 `order` 类型' + `\n${sharedVariableMarkdown('IQueryDto', 'cloud-types', '类型定义')}`,
      type: Object,
    }),
  ], true))
  order?: FindOneOptions<T>['order']

  @decorate(GenerateParamsDecorator([
    ApiProperty({
      description: '关联信息，已定义类型，请直接使用 `IQueryDto` 中的 `relations` 类型' + `\n${sharedVariableMarkdown('IQueryDto', 'cloud-types', '类型定义')}`,
      type: Object,
    }),
  ], true))
  relations?: FindOneOptions<T>['relations']

  @decorate(GenerateParamsDecorator([
    ApiProperty({
      description: '查询字段，已定义类型，请直接使用 `IQueryDto` 中的 `select` 类型' + `\n${sharedVariableMarkdown('IQueryDto', 'cloud-types', '类型定义')}`,
      type: Object,
    }),
  ], true))
  select?: FindOneOptions<T>['select']
}

export class QueryResDto<T> extends SuccessDto<PaginatedResData<T>> implements IQueryResDto<T> {
  @decorate(GenerateParamsDecorator([
    ApiProperty({
      description: `这是通用的分页查询返回，返回的结构为统一的分页结果类型，请直接使用 \`cloud-types\` 中定义的类型来做类型约束\n${sharedVariableMarkdown('IPaginatedResData', 'cloud-types', '响应结果类型定义')
        }\n或者使用整个响应的类型定义${sharedVariableMarkdown('IQueryResDto', 'cloud-types', '响应结果类型定义')}`,
      type: PaginatedResData,
    }),
  ], true))
  data: PaginatedResData<T>
}
