<script setup lang="ts">
import { Notify } from 'quasar'

import type { SysConfig } from 'shared/types/enum'
import type { IConfigDto } from 'shared/types/dto/config.interface'

interface Props {
  data: {
    id: string
    label: string
  }
}
const props = defineProps<Props>()

const { active } = usePageAdmin()

const loading = ref(false)
const pageCfg = ref<IConfigDto[SysConfig.HOME]>()
const oldCfg = ref('')

/** 上传logo图片 */
const pageImg = ref<File>()
watch(pageImg, async (newVal) => {
  loading.value = true
  try {
    if (newVal) {
      const formData = new FormData()
      formData.append('file', newVal as File)
      const res = await uploadFileApi(formData, `/images/page/${newVal.name}`)
      pageCfg.value!.url = res.url
    }
  }
  catch (e) {}
  finally {
    loading.value = false
    pageImg.value = undefined
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
    const data = await upsertConfigApi({ version: active.value, [props.data.id]: { ...pageCfg.value } })
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
  <div class="">
    <ZLoading :value="loading" />
    <div v-if="!loading" flex="~ col gap-4">
      <div flex items-center justify-between>
        <h3 v-text="data.label" />
        <ZBtn
          :disable="oldCfg === JSON.stringify(pageCfg)"
          min-w-20 label="保存" @click="save()"
        />
      </div>
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
      <div v-if="pageCfg" flex="~ col gap1">
        <ZLabel label="简介" />
        <ZInput
          v-model="pageCfg.label" flex-1
          size="medium"
        />
      </div>
      <div flex="~ col">
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
    </div>
  </div>
</template>
