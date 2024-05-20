/**
 * 所有响应的基础类型
 */
export interface IBasicResponse<T> {
  /** 状态码，当不为 0 时时，表示请求出错 */
  status: number
  /** 请求错误时的错误信息 */
  message: string
  /** 请求错误时的错误详情 */
  detail?: string
  /** 详细数据 */
  data: T
}
