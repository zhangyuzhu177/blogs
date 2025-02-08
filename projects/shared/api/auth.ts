import type { ILoginByEmailCodeBodyDto, ILoginByPasswordBodyDto, ILoginSuccessResData, IRegisterBodyDto } from 'types'
import { authToken } from '../composables/user'
import { useRequest } from '../utils/common/request'

const { $post, $get } = useRequest()

/**
 * 注册
 */
export function registerApi(body: IRegisterBodyDto) {
  return $post<ILoginSuccessResData>('/auth/register', body)
}

/**
 * 登录
 */
export function loginByPasswordApi(body: ILoginByPasswordBodyDto) {
  return $post<ILoginSuccessResData>('/auth/login/password', body)
}

/**
 * 邮箱验证码登录
 */
export function loginByEmailCodeApi(body: ILoginByEmailCodeBodyDto) {
  return $post<ILoginSuccessResData>('/auth/login/email/code', body)
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
