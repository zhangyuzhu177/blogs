import type { ExecutionContext } from '@nestjs/common'
import type { Reflector } from '@nestjs/core'

export function getReflectorValue<T>(
  reflector: Reflector,
  context: ExecutionContext,
  key: string,
  defaultValue: T) {
  return reflector.get<T>(key, context.getHandler())
    ?? reflector.get<T>(key, context.getClass())
    ?? defaultValue
}
