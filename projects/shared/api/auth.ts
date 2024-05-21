import { IRegisterBodyDto } from "../types/http/auth/register.interface";
import { ILoginByPasswordBodyDto, ILoginSuccessResData } from "../types/http/auth/login-by-password.interface";
import { authToken } from "../composables/user";
import { useRequest } from "../utils/request";

const { $post,$get } = useRequest()


/**
 * 注册
 * @param body
 * @returns
 */
export function registerApi(body: IRegisterBodyDto) {
  return $post<ILoginSuccessResData>('/auth/register', body)
}

/**
 * 登录
 * @param body
 * @returns
 */
export function loginByPasswordApi(body: ILoginByPasswordBodyDto) {
  return $post<ILoginSuccessResData>('/auth/login/password', body)
}

/**
 * 获取图形验证码
 */
export function getCaptchaImgApi() {
  return $get<{
    bizId: string
    img: string
  }>('/auth/captcha')
}

/** 退出登录 */
export function logoutApi() {
  if (authToken.value)
    return $post<boolean>('/auth/logout')
}
