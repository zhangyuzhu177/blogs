/** 分页信息 */
export interface IQueryPagination {
  /** 查询的页码 */
  page?: number
  /** 每页的数量 */
  pageSize?: number | 'all'
}

/** 分页查询的响应结果 */
export interface IQueryPaginatedResData<T> {
  /** 当前页数 */
  page: number
  /** 每页的数量 */
  pageSize: number | 'all'
  /** 数据总数 */
  total: number
  /** 数据列表 */
  data: T[]
}
