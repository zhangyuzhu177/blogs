<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'

import { rsaDecrypt } from '../../utils/common/rsa'
import { useUser } from '../../composables/user'
import { REMEMBER_LOGIN_INFO_KEY } from '../../constants/storage'

import ZInput from '../../components/input/ZInput.vue'
import CaptchaInput from '../../components/input/CaptchaInput.vue'
import ZBtn from '../../components/btn/ZBtn.vue'
import ZDialog from '../../components/dialog/ZDialog.vue'
import { validatePassword } from '../../utils/validators/password.validator'
import { validateEmail } from '../../utils/validators/email.validator'
import { ErrorCode } from '../../types/enum/error-code.enum'

const { loading, loginByPassword } = useUser()

/** 用户账号 */
const userCode = ref('')
/** 密码 */
const password = ref('')
/** 记住账号密码 */
const remember = ref(false)
/** 验证码 */
const code = ref('')
/** 邮箱验证校验码 */
const bizId = ref('')

/** 登录提示对话框 */
const dialog = ref(false)
/** 验证码输入框 */
const captchaInput = ref<InstanceType<typeof CaptchaInput>>()

onBeforeMount(async () => {
  try {
    const loginInfo = JSON.parse(localStorage?.getItem(REMEMBER_LOGIN_INFO_KEY) ?? '{}')

    if (loginInfo.userCode && loginInfo.password) {
      userCode.value = loginInfo.userCode
      password.value = await rsaDecrypt(loginInfo.password)

      remember.value = true
    }
  }
  catch (_) {}
})

/** 禁用登录 */
const disable = computed(() => (
  loading.value
  || !userCode.value
  || !!validatePassword(password.value)
  || code.value.length !== 6
  || !bizId.value
))

/**
 * 登录
 */
async function login() {
  if (disable.value)
    return

  try {
    await loginByPassword(
      {
        [
        !validateEmail(userCode.value)
          ? 'email'
          : 'account'
        ]: userCode.value,
        password: password.value,
        code: code.value,
        bizId: bizId.value,
      },
      remember.value,
    )
  }
  catch (e: any) {
    code.value = ''
    captchaInput.value?.getCaptchaImg()
    const { status } = e.response?.data || {}
    if (status === ErrorCode.AUTH_PASSWORD_IS_NULL)
      dialog.value = true
  }
}
</script>

<template>
  <div flex="~ col gap5">
    <h2 text-center>
      登录
    </h2>
    <div flex="~ col gap10">
      <div flex="~ col">
        <ZInput
          v-model="userCode"
          label="账号 / 邮箱"
          placeholder="请输入用户名/邮箱"
          dark mb6
        />
        <ZInput
          v-model="password"
          label="密码"
          placeholder="请输入密码"
          dark password mb1
          :params="{
            rules: [
              (val: string) => validatePassword(val) || true,
            ],
          }"
          @keydown.enter="login"
        />
        <CaptchaInput
          ref="captchaInput"
          v-model="code"
          v-model:biz-id="bizId"
          dark
          @keydown.enter="login"
        />
        <q-checkbox
          v-model="remember"
          dark size="sm"
          label="记住账号密码"
          relative right-2 self-start
        />
        <div flex="~ justify-between" font-400 mt-2>
          <RouterLink
            text-grey-1
            :to="{
              path: '/auth/forgetPassword',
            }"
          >
            忘记密码？
          </RouterLink>
          <RouterLink
            text-grey-1
            :to="{
              path: '/auth/loginByCode',
            }"
          >
            使用验证码登录
          </RouterLink>
        </div>
      </div>
      <div flex="~ col gap4">
        <ZBtn
          size="big"
          color="grey-1"
          text-color="primary-1"
          label="登录"
          :disable="disable"
          @click="login"
        />
        <!-- <div text="center white-7" font-400>
          没有账号？
          <RouterLink
            text-grey-1
            :to="{
              path: '/auth/register',
            }"
          >
            立即注册
          </RouterLink>
        </div> -->
      </div>
    </div>

    <!-- 登录提示对话框 -->
    <ZDialog
      v-model="dialog"
      title="提示"
      confirm-text="立即前往"
      footer
      @ok="$router.push('/auth/forgetPassword')"
    >
      您登录的账号密码不存在，为了您的账号安全，请先前往“忘记密码？”设置初始密码。
    </ZDialog>
  </div>
</template>
