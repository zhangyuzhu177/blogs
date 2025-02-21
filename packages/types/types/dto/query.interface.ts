import type { FindOneOptions } from 'typeorm'

import type { IBasicResponse } from '../http/basic.interface'

import type { IQueryPaginatedResData, IQueryPagination } from './pagination.interface'

/** 分页查询 */
export interface IQueryDto<Entity> {
  /** 分页信息 */
  pagination?: IQueryPagination
  /** 过滤条件 */
  where?: FindOneOptions<Entity>['where']
  /** 排序信息 */
  order?: FindOneOptions<Entity>['order']
  /** 关联信息 */
  relations?: FindOneOptions<Entity>['relations']
  /** 查询字段 */
  select?: FindOneOptions<Entity>['select']
}

/** 通用的分页查询结果 */
export interface IQueryResDto<Entity> extends IBasicResponse<IQueryPaginatedResData<Entity>> {}
