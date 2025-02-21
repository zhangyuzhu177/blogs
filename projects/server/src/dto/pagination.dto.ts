import { decorate } from 'ts-mixer'
import { ApiProperty } from '@nestjs/swagger'
import { GenerateParamsDecorator } from 'src/utils'
import type { IQueryPaginatedResData, IQueryPagination } from 'types'

export class QueryPagination implements IQueryPagination {
  @decorate(GenerateParamsDecorator([
    ApiProperty({
      description: '页码',
      example: 1,
      type: Number,
    }),
  ], true))
  page?: number

  @decorate(GenerateParamsDecorator([
    ApiProperty({
      description: '每页的数量',
      example: 'all',
      type: [Number, 'all'],
    }),
  ], true))
  pageSize?: number | 'all'
}

export class PaginatedResData<T> implements IQueryPaginatedResData<T> {
  @decorate(ApiProperty({
    description: '当前页数',
  }))
  page: number

  @decorate(ApiProperty({
    description: '每页的数量',
  }))
  pageSize: number | 'all'

  @decorate(ApiProperty({
    description: '数据总数',
  }))
  total: number

  @decorate(ApiProperty({
    description: '数据列表',
    type: [Object],
  }))
  data: T[]
}
