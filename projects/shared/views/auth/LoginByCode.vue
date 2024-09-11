<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUser } from '../../composables/user'
import ZInput from '../../components/input/ZInput.vue'
import ZBtn from '../../components/btn/ZBtn.vue'
import { validateEmail } from '../../utils/validators/email.validator'
import type { ILoginByEmailCodeBodyDto } from '../../types/http/auth/login-by-email-code.interface'
import { CodeAction } from '../../types/enum/code-action.enum'

const { loading, loginByEmailCode } = useUser()

/** 邮箱 */
const email = ref('')
/** 手机号 */
const phone = ref('')
/** 验证码 */
const code = ref('')
/** 验证校验码 */
const bizId = ref('')
/** 找回类型（true：邮箱找回，false：手机号找回） */
const type = ref(true)

/** 禁用提交 */
const disable = computed(() => (
  loading.value
  || (type.value && !!validateEmail(email.value))
  || code.value.length !== 6
  || !bizId.value
))

/** 提交表单 */
const formArg = computed(() => {
  const obj = type.value ? { email: email.value } : { phone: phone.value }
  return {
    ...obj,
    code: code.value,
    bizId: bizId.value,
  }
})

/**
 * 验证码登录
 */
function confirm() {
  if (disable.value)
    return

  if (type.value)
    loginByEmailCode(formArg.value as ILoginByEmailCodeBodyDto)
}
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
      {{ type ? '邮箱' : '手机号' }}登录
    </h2>
    <div flex="~ col gap10">
      <div flex="~ col gap1">
        <ZInput
          v-if="type"
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
        <!-- <ZInput
          v-else
          v-model="phone"
          label="手机号"
          placeholder="请输入手机号"
          dark
          :params="{
            rules: [
              (val: string) => validatePhone(val) || true,
            ],
          }"
        /> -->
        <SMSInput
          v-model="code"
          v-model:biz-id="bizId"
          :email="email"
          :action="CodeAction.LOGIN"
          :type="type"
          dark
          @keydown.enter="confirm"
        />
        <!-- <div
          v-if="isPhone"
          cursor-pointer self-end font-400
          @click="type = !type"
          v-text="`切换${type ? '手机号' : '邮箱'}登录`"
        /> -->
      </div>
      <ZBtn
        size="big"
        color="grey-1"
        text-color="primary-1"
        label="登录"
        :disable="disable"
        @click="confirm"
      />
    </div>
  </div>
</template>
