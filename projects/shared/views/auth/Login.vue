<script setup lang="ts">
import { computed, onBeforeMount, reactive, ref } from 'vue'

import { browser } from 'utils'
import { useUser } from '../../composables/user'
import { AES_KEY } from '../../constants/encrypt'
import ZBtn from '../../components/btn/ZBtn.vue'
import ZInput from '../../components/input/ZInput.vue'
import { REMEMBER_LOGIN_INFO_KEY } from '../../constants/storage'
import CaptchaInput from '../../components/input/CaptchaInput.vue'
import { validateEmail } from '../../utils/validators/email.validator'
import { validatePassword } from '../../utils/validators/password.validator'

const { loading, loginByPassword } = useUser()

/** 登录表单 */
const form = reactive({
  /** 账号 */
  account: '',
  /** 密码 */
  password: '',
  /** 记住账号密码 */
  remember: false,
})
/** 验证码 */
const code = ref('')
/** 邮箱验证校验码 */
const bizId = ref('')

/** 验证码输入框 */
const captchaInput = ref<InstanceType<typeof CaptchaInput>>()

onBeforeMount(() => {
  try {
    const { userCode, password } = JSON.parse(browser.aesDecrypt(
      localStorage.getItem(REMEMBER_LOGIN_INFO_KEY) || '',
      AES_KEY,
    ))

    form.account = userCode
    form.password = password
    if (userCode && password)
      form.remember = true
  }
  catch (_) {}
})

/** 禁用登录 */
const disable = computed(() => (
  loading.value
  || !form.account
  || !!validatePassword(form.password)
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
        !validateEmail(form.account)
          ? 'email'
          : 'account'
        ]: form.account,
        password: form.password,
        code: code.value,
        bizId: bizId.value,
      },
      form.remember,
    )
  }
  catch (e: any) {
    code.value = ''
    captchaInput.value?.getCaptchaImg()
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
          v-model="form.account"
          label="账号 / 邮箱"
          placeholder="请输入用户名/邮箱"
          dark mb5
        />
        <ZInput
          v-model="form.password"
          type="password"
          label="密码"
          placeholder="请输入密码"
          dark mb1
          :rules=" [
            (val: string) => validatePassword(val) || true,
          ]"
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
          v-model="form.remember"
          dark size="sm"
          label="记住账号密码"
          relative right-2 self-start
        />
      </div>
      <div flex="~ col gap4">
        <ZBtn
          size="big"
          color="grey-1"
          text-color="primary-1"
          label="登录"
          :disable="disable"
          :params="{
            loading
          }"
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
  </div>
</template>
