<script setup lang="ts">
import { Notify } from 'quasar'
import { SysConfig } from 'types'
import type { IConfigDto } from 'types'
import { validateEmail, validateName, validatePhone } from 'shared/utils/validators'
import { cloneDeep } from 'lodash'

const { active } = usePageAdmin()

/** 加载中 */
const loading = ref(false)
/** 初始化配置 */
const initData: IConfigDto[SysConfig.ABOUT] = {
  title: '',
  label: '',
  url: '',
  avatar: '',
  name: '',
  phone: '',
  email: '',
  github: '',
  motto: '',
  content: '',
}
/** 页面配置 */
const pageCfg = ref<IConfigDto[SysConfig.ABOUT]>(cloneDeep(initData))

/** 上传背景图片 */
const pageImg = ref<File>()
watch(
  pageImg,
  async (newVal) => {
    loading.value = true
    try {
      if (newVal) {
        const formData = new FormData()
        formData.append('file', newVal as File)
        const res = await uploadFileApi(formData, `/images/article/${newVal.name}`)
        pageCfg.value!.url = res.url
      }
    }
    finally {
      loading.value = false
      pageImg.value = undefined
    }
  },
)

/** 上传头像 */
const avatar = ref<File>()
watch(
  avatar,
  async (newVal) => {
    loading.value = true
    try {
      if (newVal) {
        const formData = new FormData()
        formData.append('file', newVal as File)
        const res = await uploadFileApi(formData, `/images/page/${newVal.name}`)
        pageCfg.value!.avatar = res.url
      }
    }
    finally {
      loading.value = false
      avatar.value = undefined
    }
  },
)

/** 获取数据 */
async function getConfigList() {
  loading.value = true
  try {
    const data = await getConfigApi(active.value) || initData
    pageCfg.value = data
  }
  finally {
    loading.value = false
  }
}

/** 保存修改 */
async function save() {
  loading.value = true
  try {
    const data = await upsertConfigApi({
      version: active.value,
      [SysConfig.ABOUT]: {
        ...pageCfg.value,
      },
    })
    if (data) {
      Notify.create({
        message: '修改成功',
        type: 'success',
      })
    }
  }
  finally {
    loading.value = false
  }
}

onBeforeMount(() => {
  getConfigList()
})
</script>

<template>
  <div flex="~ col gap4" full>
    <ZLoading :value="loading" />

    <!-- 标题 -->
    <div flex="~ items-center justify-between">
      <h3 v-text="'关于页设置'" />
      <ZBtn
        label="保存"
        @click="save()"
      >
        <template #left>
          <div size-5 i-mingcute:save-2-line />
        </template>
      </ZBtn>
    </div>

    <div flex="~ col gap4" overflow-auto>
      <!-- 基础设置 -->
      <div flex="~ col gap4">
        <div flex="~ items-center gap2">
          <div w-2 h-2 b-rd-0.5 bg-primary-1 />
          <div subtitle-2 v-text="'基础设置'" />
        </div>

        <div flex="~ col gap1">
          <ZInput
            v-model="pageCfg!.title"
            label="标题"
            placeholder="请输入标题"
            :max="12"
            mb-5
          />
          <ZInput
            v-model="pageCfg!.label"
            label="简介"
            placeholder="请输入简介"
            mb-5
          />
          <div flex="~ col gap2" mb-5>
            <ZLabel label="背景图片" />
            <ZUpload
              v-model="pageImg"
              type="image"
              accept="image/*"
              w-50 b-rd-4
            >
              <div
                v-if="!pageCfg?.url"
                flex="~ col gap2 center"
                b-rd-4 full h-30
                border="1px dashed gray-5"
              >
                <div text="6 grey-5" i-ph:plus />
                <div text="grey-5" v-text="'上传背景图片'" />
              </div>
              <div
                v-else flex="~ col gap2 center" b-rd-4 full
                h-30 overflow-hidden relative
              >
                <img full :src="pageCfg?.url">
              </div>
            </ZUpload>
          </div>
        </div>
      </div>

      <!-- 内容设置 -->
      <div flex="~ col gap4">
        <div flex="~ items-center gap2">
          <div w-2 h-2 b-rd-0.5 bg-primary-1 />
          <div subtitle-2 v-text="'内容设置'" />
        </div>

        <div flex="~ col gap1">
          <div flex="~ col gap2" mb-5>
            <ZLabel label="头像" />
            <ZUpload
              v-model="avatar"
              type="image"
              accept="image/*"
              w-30 b-rd-4
            >
              <div
                v-if="!pageCfg?.avatar"
                flex="~ col gap2 center"
                b-rd-4 full h-30
                border="1px dashed gray-5"
              >
                <div text="6 grey-5" i-ph:plus />
                <div text="grey-5" v-text="'上传头像'" />
              </div>
              <div
                v-else flex="~ col gap2 center" b-rd-4 full
                h-30 overflow-hidden relative
              >
                <img full :src="pageCfg?.avatar">
              </div>
            </ZUpload>
          </div>
          <ZInput
            v-model="pageCfg!.name"
            label="名称"
            placeholder="请输入名称"
            :max="12"
            :rules="[
              (val: string) => !val || validateName(val) || true,
            ]"
          />
          <ZInput
            v-model="pageCfg!.phone"
            label="手机号"
            placeholder="请输入手机号"
            :rules="[
              (val: string) => !val || validatePhone(val) || true,
            ]"
          />
          <ZInput
            v-model="pageCfg!.email"
            label="邮箱"
            placeholder="请输入邮箱"
            :rules="[
              (val:string) => !val || validateEmail(val) || true,
            ]"
          />
          <ZInput
            v-model="pageCfg!.github"
            label="GitHub地址"
            placeholder="请输入GitHub地址"
            mb-5
          />
          <ZInput
            v-model="pageCfg!.motto"
            label="座右铭"
            placeholder="请输入座右铭"
            mb-5
          />
          <div flex="~ col gap2" mb-5>
            <ZLabel label="内容" />
            <MdEditor v-model="pageCfg!.content" w-0 h-500px />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
