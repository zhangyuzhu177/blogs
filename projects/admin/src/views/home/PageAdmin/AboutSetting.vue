<script setup lang="ts">
import { Notify } from 'quasar'
import { validateEmail, validatePhone } from 'shared/utils/validators'
import type { IConfigDto } from 'shared/types/dto/config.interface'
import { SysConfig } from 'shared/types/enum'

const { active } = usePageAdmin()

const loading = ref(false)
const pageCfg = ref<IConfigDto[SysConfig.ABOUT]>()
const oldCfg = ref('')

/** 上传背景图片 */
const pageImg = ref<File>()
watch(pageImg, async (newVal) => {
  loading.value = true
  try {
    if (newVal) {
      const formData = new FormData()
      formData.append('file', newVal as File)
      const res = await uploadFileApi(formData, `/images/article/${newVal.name}`)
      pageCfg.value!.url = res.url
    }
  }
  catch (e) {}
  finally {
    loading.value = false
    pageImg.value = undefined
  }
})

/** 上传头像 */
const avatar = ref<File>()
watch(avatar, async (newVal) => {
  loading.value = true
  try {
    if (newVal) {
      const formData = new FormData()
      formData.append('file', newVal as File)
      const res = await uploadFileApi(formData, `/images/page/${newVal.name}`)
      pageCfg.value!.avatar = res.url
    }
  }
  catch (e) {}
  finally {
    loading.value = false
    avatar.value = undefined
  }
})

/** 获取数据 */
async function getConfigList() {
  loading.value = true
  try {
    const data = await getConfigApi(active.value) || {}

    pageCfg.value = data
    oldCfg.value = JSON.stringify(data)
  }
  catch (error) {}
  finally {
    loading.value = false
  }
}

/** 保存修改 */
async function save() {
  loading.value = true
  try {
    const data = await upsertConfigApi({ version: active.value, [SysConfig.ABOUT]: { ...pageCfg.value } })
    if (data)
      Notify.create({ message: '修改成功', type: 'success' })
  }
  catch (error) {}
  finally {
    loading.value = false
  }
}

onMounted(() => {
  getConfigList()
})
</script>

<template>
  <div flex flex-col full overflow-auto>
    <ZLoading :value="loading" />
    <div v-if="!loading" flex="~ col">
      <div flex items-center justify-between>
        <h3 v-text="'关于页设置'" />
        <ZBtn
          :disable="oldCfg === JSON.stringify(pageCfg)"
          min-w-20 label="保存" @click="save()"
        />
      </div>
      <h5 v-text="'基础设置'" />
      <div v-if="pageCfg" flex="~ col gap1">
        <ZLabel label="标题" />
        <ZInput
          v-model="pageCfg.title"
          size="medium"
          :params="{
            counter: true,
            maxlength: '12',
          }"
        />
      </div>
      <div v-if="pageCfg" flex="~ col gap1" pb-5>
        <ZLabel label="简介" />
        <ZInput
          v-model="pageCfg.label" flex-1
          size="medium"
        />
      </div>
      <div flex="~ col" pb-5>
        <div flex items-center justify-between>
          <ZLabel label="背景图片" />
          <ZUpload
            v-model="pageImg"
            type="image"
            accept="image/*"
          >
            <ZBtn label="上传图片">
              <template #left>
                <div w-5 h-5 i-mdi:file-image-outline />
              </template>
            </ZBtn>
          </ZUpload>
        </div>
        <div
          w-55 h-30 b-rd-2
          b="1 gray-3"
          overflow-hidden
        >
          <img v-if="pageCfg?.url" full :src="pageCfg?.url">
        </div>
      </div>

      <h5 v-text="'内容设置'" />
      <div flex="~ col" pb-5>
        <div flex items-center justify-between>
          <ZLabel label="头像" />
          <ZUpload
            v-model="avatar"
            type="image"
            accept="image/*"
          >
            <ZBtn label="上传图片">
              <template #left>
                <div w-5 h-5 i-mdi:file-image-outline />
              </template>
            </ZBtn>
          </ZUpload>
        </div>
        <div
          w-30 h-30 b-rd-2
          b="1 gray-3"
          overflow-hidden
        >
          <img v-if="pageCfg?.avatar" full :src="pageCfg?.avatar">
        </div>
      </div>
      <div v-if="pageCfg" flex="~ col gap1">
        <ZLabel label="名称" />
        <ZInput
          v-model="pageCfg.name"
          size="medium"
          :params="{
            counter: true,
            maxlength: '12',
          }"
        />
      </div>
      <div v-if="pageCfg" flex="~ col gap1">
        <ZLabel label="手机号" />
        <ZInput
          v-model="pageCfg.phone"
          size="medium"
          :params="{
            rules: [
              (val: string) => !val || validatePhone(val) || true,
            ],
          }"
        />
      </div>
      <div v-if="pageCfg" flex="~ col gap1">
        <ZLabel label="邮箱" />
        <ZInput
          v-model="pageCfg.email"
          size="medium"
          :params="{
            rules: [
              (val:string) => !val || validateEmail(val) || true,
            ],
          }"
        />
      </div>
      <div v-if="pageCfg" flex="~ col gap1" pb-5>
        <ZLabel label="GitHub地址" />
        <ZInput
          v-model="pageCfg.github"
          size="medium"
        />
      </div>
      <div v-if="pageCfg" flex="~ col gap1" pb-5>
        <ZLabel label="座右铭" />
        <ZInput
          v-model="pageCfg.motto"
          size="medium"
        />
      </div>
      <div v-if="pageCfg" flex="~ col gap1">
        <ZLabel label="内容" />
        <MdEditor v-model="pageCfg.content" w-0 h-500px />
      </div>
    </div>
  </div>
</template>
