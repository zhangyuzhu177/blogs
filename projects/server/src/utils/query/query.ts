import { objectPick } from 'utils'
import type { FindOneOptions, Repository } from 'typeorm'
import type { PaginatedResData, QueryDto } from 'src/dto'
import { parseSqlError, responseParamsError } from 'src/utils'

import { getQueryPaging, handleWhere } from '.'

/**
 * 通用的查询
 */
export async function getQuery<Entity>(
  repo: Repository<Entity>,
  config: QueryDto<Entity>,
  inspect?: FindOneOptions<Entity>,
): Promise<PaginatedResData<Entity>> {
  try {
    config.where = handleWhere(config.where)
    const { page, pageSize, total } = await getQueryPaging(repo, config)
    const data = await repo.find({
      ...inspect,
      ...objectPick(config, 'where', 'relations', 'order', 'select'),
      ...(
        pageSize !== 'all'
          ? {
              skip: (page - 1) * pageSize,
              take: pageSize,
            }
          : {}
      ),
    })
    return {
      page,
      pageSize,
      total,
      data,
    }
  }
  catch (e) {
    const sqlError = parseSqlError(e)
    if (sqlError === SqlError.ENTITY_PROPERTY_NOT_FOUND) {
      const value = e.message.match(/Property\s*"(\w+)"/)?.[1]
      const field = value && getAllKeys(config.order).includes(value)
        ? 'order'
        : 'relations'
      responseParamsError([{
        property: field,
        constraints: {
          [field]: `${field === 'order' ? '排序' : '关联'}信息有误`,
        },
      }])
    }
    throw e
  }
}

/**
 * 获取对象所有键
 */
function getAllKeys(obj?: object) {
  const keys = []
  const stack = [{ obj }]

  while (stack.length > 0) {
    const current = stack.pop()
    for (const key in current.obj) {
      if (Object.prototype.hasOwnProperty.call(current.obj, key)) {
        keys.push(key)
        const value = current.obj[key]
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // 如果值是对象，则将其推入堆栈以便后续处理
          stack.push({ obj: value })
        }
      }
    }
  }

  return keys
}
