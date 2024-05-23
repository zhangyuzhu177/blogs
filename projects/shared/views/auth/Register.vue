<script setup lang="ts">
import { computed, ref } from 'vue'

import { useUser } from '../../composables/user'
import ZInput from '../../components/input/ZInput.vue'
import SMSInput from '../../components/input/SMSInput.vue'
import ZBtn from '../../components/btn/ZBtn.vue'
import { validateAccount } from '../../utils/validators/account.validator'
import { validatePassword } from '../../utils/validators/password.validator'
import { validateEmail } from '../../utils/validators/email.validator'
import { IRegisterBodyDto } from '../../types/http/auth/register.interface'
import { CodeAction } from '../../types/enum/code-action.enum'

const { loading, register } = useUser()

/** 账号 */
const account = ref('')
/** 密码 */
const password = ref('')
/** 确认密码 */
const repeatPassword = ref('')
/** 邮箱 */
const email = ref('')
/** 验证码 */
const code = ref('')
/** 邮箱验证校验码 */
const bizId = ref('')

/** 禁用注册 */
const disable = computed(() => {
  return loading.value
    || !!validateAccount(account.value)
    || !!validatePassword(password.value)
    || password.value !== repeatPassword.value
    || !!validateEmail(email.value)
    || code.value.length !== 6
    || !bizId.value
})

/** 注册表单 */
const formArg = computed<IRegisterBodyDto>(() => {
  return {
    account: account.value,
    password: password.value,
    email: email.value,
    code: code.value,
    bizId: bizId.value,
  }
})
</script>

<template>
  <div flex="~ col gap14">
    <h2 text-center relative>
      <RouterLink
        :to="{
          path: '/auth/login',
        }"
      >
        <div absolute-y-center left-0 text="xl grey-1" i-mingcute:left-line />
      </RouterLink>
      注册
    </h2>
    <div flex="~ col gap5">
      <div flex="~ col gap1">
        <ZInput
          v-model="account"
          label="用户名称"
          placeholder="请输入用户名称"
          dark
          :params="{
            rules: [
              (val: string) => validateAccount(val) || true,
            ],
          }"
        />
        <ZInput
          v-model="password"
          label="密码"
          placeholder="请输入密码"
          dark password
          :params="{
            rules: [
              (val: string) => validatePassword(val) || true,
            ],
          }"
        />
        <ZInput
          v-model="repeatPassword"
          label="确认密码"
          placeholder="请确认密码"
          dark password
          :params="{
            rules: [
              (val: string) => val === password || '两次密码不一致',
            ],
            reactiveRules: true,
          }"
        />
        <ZInput
          v-model="email"
          label="邮箱"
          placeholder="请输入邮箱"
          dark
          :params="{
            rules: [
              (val: string) => validateEmail(val) || true,
            ],
          }"
        />
        <SMSInput
          v-model="code"
          v-model:biz-id="bizId"
          :email="email"
          :action="CodeAction.REGISTER"
          dark
        />
      </div>
      <ZBtn
        size="big"
        color="grey-1"
        text-color="primary-1"
        label="注册"
        :disable="disable"
        @click="register(formArg)"
      />
    </div>
  </div>
</template>
