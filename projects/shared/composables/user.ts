import { Notify } from 'quasar'
import { browser } from 'utils'
import { useRouter } from 'vue-router'
import type { Router } from 'vue-router'
import { useStorage } from '@vueuse/core'
import { computed, getCurrentInstance, ref } from 'vue'
import type {
  ILoginByEmailCodeBodyDto,
  ILoginByPasswordBodyDto,
  ILoginSuccessResData,
  IRegisterBodyDto,
  IUpdatePasswordByEmailCodeBodyDto,
  IUser,
  PermissionType,
} from 'types'

import { AES_KEY, RSA_KEY } from '../constants/encrypt'
import { getOwnProfileApi, updateOwnPasswordByEmailCodeApi } from '../api/user'
import {
  loginByEmailCodeApi,
  loginByPasswordApi,
  logoutApi,
  registerApi,
} from '../api/auth'
import {
  AUTH_TOKEN_KEY,
  LEADING_PAGE_KEY,
  REMEMBER_LOGIN_INFO_KEY,
} from '../constants/storage'

import { useSysConfig } from './app'

/** 用户token */
export const authToken = useStorage('auth_token', '')
/** 用户管理权限 */
const adminRole = ref<PermissionType[]>()
/** 用户信息 */
const userInfo = ref<IUser>()
/** 用户信息获取时间 */
const getTime = ref<number>()
/** 加载中 */
const loading = ref(false)

export function useUser($router?: Router) {
  const { isAdmin } = useSysConfig()
  const instance = getCurrentInstance()
  if (!$router && instance)
    $router = useRouter()
  /** 登录 */
  async function loginByPassword(body: ILoginByPasswordBodyDto, remember = false) {
    loading.value = true
    try {
      const res = await loginByPasswordApi({
        ...body,
        password: await browser.rsaEncrypt(body.password!, RSA_KEY),
      })
      if (res && remember) {
        // 记住密码
        localStorage.setItem(
          REMEMBER_LOGIN_INFO_KEY,
          browser.aesEncrypt(
            JSON.stringify({
              userCode: body.account || body.email,
              password: body.password,
            }),
            AES_KEY,
          ),

        )
      }
      else {
        localStorage.removeItem(AUTH_TOKEN_KEY)
      }
      processLoginInfo(res)
    }
    finally {
      loading.value = false
    }
  }

  /**
   * 邮箱 + 验证码 登录
   * @param body
   */
  async function loginByEmailCode(body: ILoginByEmailCodeBodyDto) {
    loading.value = true
    try {
      const res = await loginByEmailCodeApi(body)
      if (res)
        processLoginInfo(res)
    }
    catch (error) { }
    finally {
      loading.value = false
    }
  }

  /**
   * 邮箱修改密码
   */
  async function updatePasswordByEmailCode(body: IUpdatePasswordByEmailCodeBodyDto) {
    loading.value = true
    try {
      const res = await updateOwnPasswordByEmailCodeApi(body)
      if (res) {
        Notify.create({
          type: 'success',
          message: '修改密码成功',
        })
        $router?.push('/auth/login')
      }
    }
    finally {
      loading.value = false
    }
  }

  /**
   * 注册
   * @param body
   */
  async function register(body: IRegisterBodyDto) {
    loading.value = true
    try {
      const res = await registerApi({ ...body, password: await browser.rsaEncrypt(body.password!, RSA_KEY) })
      if (res) {
        Notify.create({
          type: 'success',
          message: '注册成功',
        })
        processLoginInfo(res)
      }
    }
    catch (_) { }
    finally {
      loading.value = false
    }
  }

  /** 获取当前登录用户信息 */
  async function getOwnProfile(relation = 'role.permissions', useCache = true) {
    if (useCache && userInfo.value && getTime.value && Date.now() - getTime.value < 10 * 1000)
      return

    getTime.value = Date.now()

    const res = await getOwnProfileApi({ relation })
    if (res) {
      userInfo.value = res
      adminRole.value = res.role?.permissions?.map(v => v.name)
    }
    return res
  }

  /** 退出登录 */
  async function logout(flag = false) {
    if (!flag) {
      await logoutApi()
      if (isAdmin.value)
        $router?.push('/auth/login')
      else
        $router?.push('/')
    }

    authToken.value = ''
    adminRole.value = []
    userInfo.value = undefined
  }

  /** 处理登录信息 */
  async function processLoginInfo(res: ILoginSuccessResData) {
    const { sign, user } = res
    authToken.value = sign.access_token
    userInfo.value = user
    await getOwnProfile(undefined, false)
    $router?.push(localStorage?.getItem(LEADING_PAGE_KEY) ?? '/')
  }

  /**
   * 管理员权限
   */
  const userPermission = computed(() => userInfo.value?.role?.permissions?.map(({ name }) => name))

  /**
   * 判断管理员有无指定权限
   */
  function hasPermission(
    permissions: PermissionType | PermissionType[],
    relation: 'OR' | 'AND' = 'OR',
  ) {
    if (!Array.isArray(permissions))
      permissions = [permissions]
    return userPermission.value?.length
      ? permissions[relation === 'OR' ? 'some' : 'every'](
        permission => userPermission.value?.includes(permission),
      )
      : false
  }

  return {
    loading,
    authToken,
    adminRole,
    userInfo,
    logout,
    register,
    getOwnProfile,
    loginByPassword,
    loginByEmailCode,
    updatePasswordByEmailCode,
    hasPermission,
  }
}
