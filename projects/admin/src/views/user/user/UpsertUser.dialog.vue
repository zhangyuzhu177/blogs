<script setup lang="ts">
import { Notify } from 'quasar'
import { cloneDeep } from 'lodash'
import { browser, objectPick } from 'utils'
import type { IUpdateUserBodyDto, IUser } from 'types'
import {
  validateAccount,
  validateEmail,
  validatePassword,
  validatePhone,
} from 'shared/utils/validators'

interface UserDialogProps {
  /**
   * 管理员角色对话框的操作类型
   */
  type?: DialogType
  /**
   * 用户信息
   */
  user?: IUser
  /**
   * 在更新、插入后的回调
   */
  onCallback?: () => void
}

const props = defineProps<UserDialogProps>()
const emits = defineEmits<{
  /**
   * 更新用户对话框的操作类型
   */
  'update:type': [UserDialogProps['type']]
}>()

/** 对话框 */
const dialog = computed({
  get() {
    const { type, user } = props
    return type === '添加' || (!!type && !!user)
  },
  set() {
    emits('update:type', undefined)
  },
})
/** 是否只读 */
const readonly = computed(() => props.type === '查看')

/** 加载中 */
const loading = ref(false)
/** 初始数据 */
const initData: IUpdateUserBodyDto = {
  account: '',
  email: '',
  status: true,
}
/** 添加/编辑用户 form 表单 */
const form = ref(cloneDeep(initData))

watch(
  () => dialog.value,
  (newVal) => {
    if (newVal) {
      const { type, user } = props
      if (type === '添加') {
        form.value = cloneDeep(initData)
      }
      else if (user) {
        form.value = {
          ...objectPick(
            user,
            'account', 'phone', 'email', 'status',
          ),
        }
      }
    }
  },
)

/** 禁用提交 */
const disable = computed<boolean>(() => {
  const {
    account,
    email,
    phone,
    password,
  } = form.value
  return !!validateAccount(account)
    || !!validateEmail(email)
    || (!!phone && !!validatePhone(phone))
    || (!!password && (!!validatePassword(password)))
})

/**
 * 添加/修改用户
 */
async function upsertUser() {
  if (disable.value)
    return

  const { type, user, onCallback } = props
  loading.value = true

  let { password } = form.value
  password = password ? await browser.rsaEncrypt(form.value.password!, RSA_KEY) : undefined
  if (type === '添加') {
    await createUserApi({
      ...form.value,
      password: password!,
    })
  }
  else if (type === '编辑') {
    await updateUserApi(
      user!.id,
      {
        ...form.value,
        password,
      },
    )
  }

  Notify.create({
    type: 'success',
    message: `${type}成功`,
  })
  onCallback?.()
}
</script>

<template>
  <ZDialog
    v-model="dialog"
    :title="`${type}用户`"
    :loading
    scroll :footer="!readonly"
    confirm-text="保存"
    :wrapper-style="{
      width: '900px',
      maxWidth: '900px',
    }"
    :disable-confirm="disable"
    @ok="upsertUser"
  >
    <div flex="~ col gap1">
      <ZInput
        v-model="form.account"
        label="账号"
        placeholder="请输入账号"
        required :readonly
        :rules="[
          (val: string) => validateAccount(val) || true,
        ]"
      />

      <ZInput
        v-model="form.email"
        label="邮箱"
        placeholder="请输入邮箱"
        required :readonly
        :rules="[
          (val: string) => validateEmail(val) || true,
        ] "
      />
      <ZInput
        v-model="form.phone"
        label="手机"
        placeholder="请输入手机号"
        :readonly
        :rules="[
          (val: string) => !val || validatePhone(val) || true,
        ]"
      />
      <ZInput
        v-model="form.password"
        label="密码"
        placeholder="请输入密码"
        type="password" :readonly
        :required="type === '添加'"
        :rules="[
          (val: string) => !val || validatePassword(val) || true,
        ]"
      />
      <div flex="~ col gap2" mb5>
        <ZLabel
          label="账号状态"
          w34
        />
        <div flex="~ 1 gap5" right-2>
          <ZRadio
            :model-value="form.status?.toString()"
            val="true"
            label="启用"
            :disable="readonly"
            @update:model-value="form.status = true"
          />
          <ZRadio
            :model-value="form.status?.toString()"
            val="false"
            label="禁用"
            :disable="readonly"
            @update:model-value="form.status = false"
          />
        </div>
      </div>
    </div>
  </ZDialog>
</template>
