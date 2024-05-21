import { ref } from "vue"
import type { Router } from "vue-router"
import { useStorage } from "@vueuse/core"
import { loginByPasswordApi, logoutApi } from "../api/auth"
import { getOwnProfileApi } from "../api/user"
import { IUser } from "../types/entities/user.interface"
import { PermissionType } from "../types/enum/permission.enum"
import { ILoginByPasswordBodyDto, ILoginSuccessResData } from "../types/http/auth/login-by-password.interface"
import { rsaEncrypt } from "../utils/rsa"
import { useSysConfig } from "./app"

/**用户token */
export const authToken = useStorage('auth_token', '')
/** 用户管理权限 */
const adminRole=ref<PermissionType[]>()
/** 用户信息 */
const userInfo=ref<IUser>()
/** 用户信息获取时间 */
const getTime = ref<number>()
/** 加载中 */
const loading = ref(false)

export function useUser($router?: Router) {
  const { isAdmin } = useSysConfig()
  /**登录 */
  async function loginByPassword(body: ILoginByPasswordBodyDto,remember=false) {
    loading.value = true
    try {
      const res = await loginByPasswordApi({ ...body, password: await rsaEncrypt(body.password!) })
      if (res && remember) {
        // 记住密码
        localStorage.setItem(
          'remember_login_info',
          JSON.stringify({
            userCode: body.account || body.email,
            password: await rsaEncrypt(body.password!),
          }),
        )
      }
      else {
        localStorage.removeItem('remember_login_info')
      }
      processLoginInfo(res)
    }
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

  /**退出登录 */
  async function logout(flag = false) {
    if (!flag) {
      await logoutApi()
      if (isAdmin.value)
        $router?.push('/auth/login')
      else
        $router?.push('/')
    }
  }

  /**处理登录信息 */
  async function processLoginInfo(res: ILoginSuccessResData) {
    const { sign, user } = res
    authToken.value = sign.access_token
    userInfo.value = user
    await getOwnProfile(undefined, false)
    $router?.push(localStorage?.getItem('leading_page') ?? '/')
  }

  return {
    authToken,
    adminRole,
    userInfo,
    loginByPassword,
    logout,
    getOwnProfile
  }
}
