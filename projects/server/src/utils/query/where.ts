import { FindOperator } from 'typeorm'
import type { QueryDto } from 'src/dto'
import { isObject, objectFromEntries, objectKeys } from 'utils'
import { cloneDeep, merge } from 'lodash'

/**
 * 处理通用查询的过滤条件
 */
export function handleWhere<Entity>(
  where: QueryDto<Entity>['where'],
) {
  if (!Array.isArray(where))
    where = [where]

  // 处理对象
  function handleObject(obj: any) {
    if (!isObject(obj))
      return obj

    if (!obj._type) {
      return objectFromEntries(
        objectKeys(obj).map(key => ([
          key,
          handleObject(obj[key]),
        ])),
      )
    }
    else {
      const { _type, _value, _useParameter, _multipleParameters } = obj
      return new FindOperator(_type, _value, _useParameter, _multipleParameters)
    }
  }

  for (const item of where) {
    for (const key in item)
      item[key] = handleObject(item[key])
  }

  return where
}

/**
 * 合并过滤条件
 */
export function mergeWhere<Entity>(
  body: QueryDto<Entity>,
  where?: QueryDto<Entity>['where'],
) {
  if (!where)
    return

  if (!body.where || (Array.isArray(body.where) && !body.where.length)) {
    body.where = where
  }
  else {
    if (!Array.isArray(body.where))
      body.where = [body.where]

    if (!Array.isArray(where)) {
      body.where.forEach((item) => {
        merge(item, where)
      })
    }
    else {
      const arr = []
      body.where.forEach((a) => {
        where.forEach((b) => {
          const obj = cloneDeep(a)
          merge(obj, b)
          arr.push(obj)
        })
      })
      body.where = arr
    }
  }
}
