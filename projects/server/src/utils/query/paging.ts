import type { Repository } from 'typeorm'
import type { PaginatedResData, QueryDto } from 'src/dto'
import { parseSqlError, responseParamsError } from 'src/utils'
import { PAGINATION_SIZE_DFT, PAGINATION_SIZE_MAX } from 'utils'

/**
 * 通用的查询分页
 */
export async function getQueryPaging<Entity>(
  repo: Repository<Entity>,
  config: QueryDto<Entity>,
): Promise<Omit<PaginatedResData<Entity>, 'data'>> {
  try {
    const { pagination, where } = config
    let { page = 1, pageSize } = pagination ?? {}
    const total = await repo.count({ where })

    page = Math.max(page, 1)
    if (
      pageSize !== 'all'
      && (
        typeof pageSize !== 'number'
        || !(pageSize >= 1 && pageSize <= PAGINATION_SIZE_MAX)
      )
    )
      pageSize = PAGINATION_SIZE_DFT

    return {
      page,
      pageSize,
      total,
    }
  }
  catch (e) {
    const sqlError = parseSqlError(e)
    if (sqlError === SqlError.ENTITY_PROPERTY_NOT_FOUND) {
      responseParamsError([{
        property: 'where',
        constraints: {
          where: '过滤条件有误',
        },
      }])
    }
    throw e
  }
}
