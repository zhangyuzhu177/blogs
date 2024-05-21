import { merge } from 'lodash'

export function mergeDeep<T>(
  source: Partial<T>,
  ...targets: Partial<T>[]
): T {
  return merge(source, ...targets)
}
