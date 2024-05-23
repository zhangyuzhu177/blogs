<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { Notify } from 'quasar'
import type { ICreateUserBodyDto, IUpdateUserBodyDto, IUser, IUserIdDto } from 'sust-types'
import { validateAccount, validateEmail, validatePassword, validatePhone } from 'sust-utils'

export type Type = 'add' | 'edit'
interface Props {
  type?: Type
  user?: IUser
}

interface Form extends ICreateUserBodyDto, IUpdateUserBodyDto {
  repeatPassword?: ICreateUserBodyDto['password']
}

const props = defineProps<Props>()
const emits = defineEmits(['update:type', 'callback', 'loading'])

const { isPhone } = useUser()

/** 对话框 */
const dialog = computed({
  get() {
    const { type, user } = props
    return type === 'add' || (!!type && !!user)
  },
  set() {
    emits('update:type', undefined)
  },
})

/** 初始数据 */
const initData: Form = {
  account: '',
  email: '',
  isDeleted: false,
  sendEmail: false,
}
/** 添加/编辑用户 form 表单 */
const form = ref(cloneDeep(initData))
/** 当前编辑用户的id */
const userId = ref<IUserIdDto['userId']>()

/** 禁用提交 */
const disable = computed<boolean>(() => {
  const {
    account, email, phone, password, repeatPassword,
  } = form.value
  return !!validateAccount(account)
    || !!validateEmail(email)
    || (!!phone && !!validatePhone(phone))
    || (!!password && (!!validatePassword(password) || password !== repeatPassword))
})

/**
 * 初始化数据
 */
function init() {
  const { type, user } = props
  if (type === 'edit') {
    if (user) {
      const { id, account, email = '', phone, isDeleted } = user
      userId.value = id
      form.value = {
        account,
        email,
        phone,
        isDeleted,
        sendEmail: false,
      }
    }
    else {
      form.value = cloneDeep(initData)
      userId.value = undefined
    }
  }
}

watch(() => dialog.value, (newVal) => {
  if (newVal)
    init()
})

/**
 * 添加/修改用户
 */
async function upsertUser() {
  if (disable.value)
    return
  const { type } = props
  emits('loading', true)
  try {
    const body = deepCopy(form.value)
    const { phone, password } = body
    delete body.repeatPassword
    body.password = password ? await rsaEncrypt(password) : undefined
    body.phone = phone || undefined

    let res
    if (type === 'add')
      res = await createUserApi(body)
    else
      res = await updateUserApi(userId.value!, body)

    if (res) {
      Notify.create({
        type: 'success',
        message: `${type === 'add' ? '添加' : '编辑'}成功`,
      })
      emits('callback')
      form.value = deepCopy(initData)
    }
  }
  catch (error) {}
  finally {
    emits('loading', false)
  }
}
</script>

<template>
  <ZDialog
    v-model="dialog"
    :title="`${type === 'add' ? '添加' : '编辑'}用户`"
    scroll footer
    confirm-text="保存"
    :wrapper-style="{
      width: '900px',
      maxWidth: '900px',
    }"
    :disable-confirm="disable"
    @ok="upsertUser"
  >
    <div flex="~ col gap8">
      <div flex="~ col gap6">
        <SubLabel label="基本信息" />
        <div flex="~ col gap1">
          <ZInput
            v-model="form.account"
            label="用户名"
            placeholder="请输入用户名"
            label-position="left"
            :required="type === 'add'"
            :aligning="type !== 'add'"
            :params="{
              rules: [
                (val: string) => validateAccount(val) || true,
              ],
              readonly: type === 'edit',
            }"
          />
          <div flex="~ items-center gap2" mb5>
            <ZLabel
              label="账号状态"
              aligning w34
            />
            <div flex="~ 1 gap5" w0 relative right-2>
              <ZRadio
                :model-value="form.isDeleted?.toString()"
                val="false"
                label="启用"
                @update:model-value="form.isDeleted = false"
              />
              <ZRadio
                :model-value="form.isDeleted?.toString()"
                val="true"
                label="禁用"
                @update:model-value="form.isDeleted = true"
              />
            </div>
          </div>
          <ZInput
            v-model="form.email"
            label="邮箱"
            placeholder="请输入邮箱"
            label-position="left"
            required
            :params="{
              rules: [
                (val: string) => validateEmail(val) || true,
              ],
            }"
          />
          <ZInput
            v-if="isPhone"
            v-model="form.phone"
            label="手机"
            placeholder="请输入手机号"
            label-position="left"
            aligning
            :params="{
              rules: [
                (val: string) => !val || validatePhone(val) || true,
              ],
            }"
          />
          <ZInput
            v-model="form.password"
            label="密码"
            placeholder="请输入密码"
            label-position="left"
            aligning password
            :params="{
              rules: [
                (val: string) => !val || validatePassword(val) || true,
              ],
              reactiveRules: true,
            }"
          />
          <ZInput
            v-model="form.repeatPassword"
            label="确认密码"
            placeholder="请确认密码"
            label-position="left"
            :required="!!form.password"
            aligning password
            :params="{
              rules: [
                (val: string) => (!form.password && !val) || val === form.password || '两次密码不一致',
              ],
              reactiveRules: true,
            }"
          />
        </div>
      </div>
      <div flex="~ col gap6">
        <SubLabel label="其他" />
        <div flex="~ col gap1">
          <div flex="~ items-center gap2" mb5>
            <ZLabel
              label="通知用户"
              aligning w34
            />
            <div flex="~ 1 gap5" w0 relative right-2>
              <ZRadio
                :model-value="form.sendEmail?.toString()"
                val="true"
                label="是"
                @update:model-value="form.sendEmail = true"
              />
              <ZRadio
                :model-value="form.sendEmail?.toString()"
                val="false"
                label="否"
                @update:model-value="form.sendEmail = false"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </ZDialog>
</template>

<style  scoped></style>
