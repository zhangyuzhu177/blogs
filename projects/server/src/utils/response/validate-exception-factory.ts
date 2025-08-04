import { objectKeys } from 'utils'
import { ErrorCode } from 'types'
import type { ValidationError } from '@nestjs/common'

import { responseError } from '.'

export function exceptionFactory(errs: ValidationError[]) {
  const detail: {
    property: string
    message: string
  }[] = []

  function handleError(errs?: ValidationError[], path: string[] = []) {
    if (!errs)
      return
    for (const err of errs) {
      const { property, constraints, children } = err
      const params = [...path, property]
      if (constraints) {
        detail.push(...objectKeys(constraints).map(v => ({
          property: params.join('.'),
          message: constraints[v],
        })))
      }
      handleError(children, params)
    }
  }

  handleError(errs)

  return responseError(
    ErrorCode.COMMON_PARAMS_NOT_VALID,
    detail,
  )
}

/**
 * 给客户端返回参数错误
 */
export const responseParamsError = exceptionFactory
