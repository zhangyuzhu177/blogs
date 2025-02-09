<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { Notify } from 'quasar'
import { SysConfig } from 'types'
import type { IConfigDto } from 'types'

const { active } = usePageAdmin()

/** 加载中 */
const loading = ref(false)
/** 初始化配置 */
const initData: IConfigDto[SysConfig.APP] = {
  name: '',
  nameEn: '',
  icon: '',
}
/** app配置 */
const appCfg = ref<IConfigDto[SysConfig.APP]>(cloneDeep(initData))

/** 上传logo图片 */
const logoImg = ref<File>()
watch(
  logoImg,
  async (newVal) => {
    loading.value = true
    try {
      if (newVal) {
        const formData = new FormData()
        formData.append('file', newVal as File)
        const res = await uploadFileApi(formData, `/images/page/${newVal.name}`)
        appCfg.value!.icon = res.url
      }
    }
    finally {
      loading.value = false
      logoImg.value = undefined
    }
  })

/** 获取数据 */
async function getConfigList() {
  loading.value = true
  try {
    const data = await getConfigApi(active.value) || initData
    appCfg.value = data as IConfigDto[SysConfig.APP]
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
      [SysConfig.APP]: {
        ...appCfg.value,
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

onBeforeMount(async () => {
  await getConfigList()
})
</script>

<template>
  <div flex="~ col gap4" full>
    <ZLoading :value="loading" />

    <!-- 标题 -->
    <div flex="~ items-center justify-between">
      <h3 v-text="'APP设置'" />
      <ZBtn
        label="保存"
        @click="save()"
      >
        <template #left>
          <div size-5 i-mingcute:save-2-line />
        </template>
      </ZBtn>
    </div>

    <div flex="~ col gap-4" overflow-auto>
      <!-- 基础设置 -->
      <div flex="~ items-center gap2">
        <div w-2 h-2 b-rd-0.5 bg-primary-1 />
        <div subtitle-2 v-text="'基础设置'" />
      </div>

      <div flex="~ col gap1">
        <ZInput
          v-model="appCfg!.name"
          label="名称"
          placeholder="输入APP名称"
          :max="12"
          mb5
        />
        <ZInput
          v-model="appCfg!.nameEn"
          label="英文名"
          placeholder="输入APP名称"
          :max="12"
          mb5
        />
        <div flex="~ col gap2" mb5>
          <ZLabel label="logo" />
          <ZUpload
            v-model="logoImg"
            type="image"
            accept="image/*"
            w-30 b-rd-4
          >
            <div
              v-if="!appCfg?.icon"
              flex="~ col gap2 center"
              b-rd-4 full h-30
              border="1px dashed gray-5"
            >
              <div text="6 grey-5" i-ph:plus />
              <div text="grey-5" v-text="'上传logo'" />
            </div>
            <div
              v-else flex="~ col gap2 center" b-rd-4 full
              h-30 overflow-hidden relative
            >
              <img full :src="appCfg?.icon">
            </div>
          </ZUpload>
        </div>
      </div>
    </div>
  </div>
</template>
