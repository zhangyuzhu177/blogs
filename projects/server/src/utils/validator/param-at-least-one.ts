import { responseParamsError } from '../response/validate-exception-factory'

/**
 * 检查请求体中是否至少有一个指定的参数，如果没有，给客户端返回错误信息
 */
export function paramAtLeastOne<T extends Record<string, any>, K extends keyof T>(info: T, ...keys: K[]) {
  if (keys.some(key => info[key]))
    return

  responseParamsError([{
    property: keys.join('|'),
    constraints: {
      [keys.join('|')]: `${keys.join('、')} 参数中至少需要一个`,
    },
  }])
}
