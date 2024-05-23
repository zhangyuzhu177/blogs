import { ISendEmailCodeBodyDto, ISendEmailCodeResData } from "../types/http/email/send-email-code.interface"
import { useRequest } from "../utils/request"


const { $post } = useRequest()

/**
 * 发送验证码
 */
export function sendEmailCodeApi(body: ISendEmailCodeBodyDto) {
  return $post<ISendEmailCodeResData>('/email/code', body)
}
