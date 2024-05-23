<script setup lang="ts">
import { Notify } from 'quasar'
import type { ICreateUserBodyDto } from 'sust-types'
import {
  ACCOUNT_REQUIREMENTS_DESC,
  CSV_FILE_TYPE,
  EMAIL_REQUIREMENTS_DESC,
  PASSWORD_REQUIREMENTS_DESC,
  PHONE_NUMBER_REQUIREMENTS_DESC,
  browser,
  isCsv,
  validateAccount,
  validateEmail,
  validatePassword,
  validatePhone,
} from 'sust-utils'

type CreateUserItem = Partial<Record<keyof ICreateUserBodyDto, string>>

const emits = defineEmits(['callback', 'update:menu'])
const callback = inject<() => void>('callback')

/**
 * 下载模版
 */
function downloadTemplate() {
  const arr = [
    `用户名（必填，${ACCOUNT_REQUIREMENTS_DESC}）`,
    '账号状态（选填，可选值：启用、禁用，默认值：启用）',
    `邮箱（必填，${EMAIL_REQUIREMENTS_DESC}）`,
    `手机（选填，${PHONE_NUMBER_REQUIREMENTS_DESC}）`,
    `密码（选填，${PASSWORD_REQUIREMENTS_DESC}）`,
    '通知用户（选填，可选值：是、否，默认值：否）',
  ]
  Notify.create({
    type: 'success',
    message: DOWNLOAD_MESSAGE,
  })
  browser.downloadCsv(arr.map(v => `"${v}"`).join(','), '批量添加用户')
}

/**
 * 批量添加用户
 */
async function batchAddUser(file: File) {
  if (!file)
    return
  if (!isCsv(file)) {
    Notify.create({
      type: 'danger',
      message: '只能上传 CSV 文件',
    })
  }
  emits('update:menu', false)
  try {
    const content = await browser.readFile(file) as string
    const jsonArray = parseFileContent(content)

    const total = jsonArray.length
    let success = 0
    const error: Record<number, string> = {}

    const notify = Notify.create({
      type: 'loading',
      message: '正在上传中，请耐心等待...',
      caption: `上传进度：0 / ${total}`,
    })

    for (let i = 0; i < total; i++) {
      try {
        const body = await processingJSONData(jsonArray[i])
        await createUserApi(body)
        success++
      }
      catch (e: any) {
        const { message, detail } = e.response?.data ?? {}
        error[i + 1] = detail?.[0]?.message ?? message ?? e.message ?? 'error'
      }
      finally {
        notify({
          caption: `上传进度：${i + 1} / ${total}`,
        })
      }
    }
    showUploadResult(total, success, error, notify, callback)
  }
  catch (error) {
    Notify.create({
      color: 'danger',
      message: '文件内容读取失败',
    })
  }
}

/**
 * 解析 CSV 文件内容
 */
function parseFileContent(content: string) {
  const lines = content.split('\n')
  const headers: (keyof ICreateUserBodyDto)[] = [
    'account', 'isDeleted', 'email', 'phone', 'password', 'sendEmail',
  ]
  const jsonArray: CreateUserItem[] = []
  for (let i = 1; i < lines.length; i++) {
    lines[i] = lines[i].trim().replace('\\r', '')
    if (lines[i]) {
      const line = lines[i].split(',').map(v => v.replace(/^"(.*)"$/, '$1').trim())
      const obj: CreateUserItem = {}
      for (let j = 0; j < headers.length; j++)
        obj[headers[j]] = line[j]
      jsonArray.push(obj)
    }
  }
  return jsonArray
}

/**
 * 处理 json 数据
 */
async function processingJSONData(json: CreateUserItem): Promise<ICreateUserBodyDto> {
  const { account = '', isDeleted, email = '', phone, password, sendEmail } = json

  if (validateAccount(account))
    throw new Error(validateAccount(account))
  if (validateEmail(email))
    throw new Error(validateEmail(email))
  if (phone && !!validatePhone(phone))
    throw new Error(validatePhone(phone))
  if (password && !!validatePassword(password))
    throw new Error(validatePassword(password))

  return {
    account,
    isDeleted: isDeleted === '禁用',
    email,
    phone: phone || undefined,
    password: password ? await rsaEncrypt(password) : undefined,
    sendEmail: sendEmail === '是',
  }
}
</script>

<template>
  <div>
    <div
      text="xs grey-5" font-500 p="y0.5 x2"
      v-text="'批量添加'"
    />
    <q-item
      v-close-popup clickable
      @click="downloadTemplate"
    >
      <q-item-section>
        <div i-mingcute:download-3-line />
        下载模板
      </q-item-section>
    </q-item>
    <ZUpload
      :accept="CSV_FILE_TYPE.join(',')"
      :hint-message="{
        accept: '只能上传 CSV 文件',
      }"
      @update:model-value="val => batchAddUser(val)"
    >
      <q-item clickable>
        <q-item-section>
          <div i-mingcute:upload-3-line />
          上传CSV
          <HintMessageItem
            title="上传CSV"
            text="请上传 UTF-8 编码的 CSV 文件"
            :params="{
              anchor: 'top middle',
              self: 'bottom middle',
              offset: [0, 6],
            }"
            ml-auto
          />
        </q-item-section>
      </q-item>
    </ZUpload>
  </div>
</template>

<style  scoped></style>
