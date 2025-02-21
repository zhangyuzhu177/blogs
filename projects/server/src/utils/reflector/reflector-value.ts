import type { Reflector } from '@nestjs/core'
import type { ExecutionContext } from '@nestjs/common'

/**
 * 获取路由守卫中映射的数据
 */
export function getReflectorValue<T>(
  reflector: Reflector,
  context: ExecutionContext,
  key: string,
  defaultValue?: T,
) {
  return reflector.get<T>(key, context.getHandler())
    ?? reflector.get<T>(key, context.getClass())
    ?? defaultValue
}
