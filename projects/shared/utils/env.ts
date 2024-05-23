import { parseBoolRaw } from './parseBoolRaw'

/**
 * 辅助函数，用于根据传入的变量名获取环境变量并进行类型转换
 * @param name 变量名
 * @param defaultValue 默认值
 * @returns 转换后的环境变量
 */
export function getEnvVariable<T extends keyof Env, S extends Env[T]>(
  name: T, defaultValue?: S,
): S extends undefined ? Env[T] : Exclude<Env[T], undefined> {
  const value = import.meta.env[name]
  if (!value)
    return defaultValue as any

  // 进行类型转换
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')
      return parseBoolRaw(value.toLowerCase()) as any
    else if (!Number.isNaN(Number(value)))
      return Number(value) as any
  }

  return value as any
}
