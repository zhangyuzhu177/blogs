<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { Notify } from 'quasar'
import { SysConfig } from 'types'
import type { IConfigDto } from 'types'

const { PAGE_NAV, active } = usePageAdmin()

/** 加载中 */
const loading = ref(false)
/** 初始化配置 */
const initData: IConfigDto[SysConfig.HOME] = {
  title: '',
  label: '',
  url: '',
  isArtBg: true,
  isArtCursor: true,
}
/** 配置 */
const pageCfg = ref<IConfigDto[SysConfig.HOME]>(cloneDeep(initData))
/** 旧数据 */
const oldPageCfg = ref<IConfigDto[SysConfig.HOME]>()

const disable = computed(() => {
  return JSON.stringify(pageCfg.value) === JSON.stringify(oldPageCfg.value)
})

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
  finally {
    loading.value = false
    pageImg.value = undefined
  }
})

/** 获取数据 */
async function getConfigList() {
  if (disable.value)
    return

  loading.value = true
  try {
    const data = await getConfigApi(active.value) || initData
    pageCfg.value = data as IConfigDto[SysConfig.HOME]
    oldPageCfg.value = JSON.parse(JSON.stringify(data))
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
    await upsertConfigApi({
      version: active.value,
      [SysConfig.HOME]:
      {
        ...pageCfg.value,
      },
    })
    Notify.create({ message: '修改成功', type: 'success' })
    getConfigList()
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  getConfigList()
})
</script>

<template>
  <div flex="~ col gap4" full>
    <ZLoading :value="loading" />

    <!-- 标题 -->
    <div flex="~ items-center justify-between">
      <h3 v-text="PAGE_NAV[0].label" />
      <ZBtn
        label="保存"
        :disable="disable"
        @click="save()"
      >
        <template #left>
          <div size-5 i-mingcute:save-2-line />
        </template>
      </ZBtn>
    </div>

    <div flex="~ col gap-4" overflow-auto>
      <div flex="~ col gap1">
        <ZInput
          v-model="pageCfg!.title"
          label="标题"
          placeholder="请输入标题"
          :max="12"
          mb5
        />
        <ZInput
          v-model="pageCfg!.label"
          label="简介"
          placeholder="请输入简介"
          mb5
        />
        <div flex="~ col gap2" mb5>
          <ZLabel
            label="背景"
            w34
          />
          <div flex="~ 1 gap5" right-2>
            <ZRadio
              :model-value="pageCfg!.isArtBg?.toString()"
              val="true"
              label="艺术背景"
              @update:model-value="pageCfg!.isArtBg = true"
            />
            <ZRadio
              :model-value="pageCfg!.isArtBg?.toString()"
              val="false"
              label="图片背景"
              @update:model-value="pageCfg!.isArtBg = false"
            />
          </div>
        </div>
        <div v-if="!pageCfg!.isArtBg" flex="~ col gap2" mb-5>
          <ZLabel label="背景图片" />
          <div flex="~ gap4">
            <ZImg v-model="pageCfg!.url" width="200" height="120" />
            <ZUpload
              v-model="pageImg"
              type="image"
              accept="image/*"
              w-50 b-rd-2
            >
              <div
                flex="~ col gap2 center"
                b-rd-2 full h-30
                border="1px dashed gray-5"
              >
                <div text="6 grey-5" i-ph:plus />
                <div text="grey-5" v-text="'上传背景图片'" />
              </div>
            </ZUpload>
          </div>
        </div>
        <div flex="~ col gap2" mb5>
          <ZLabel
            label="鼠标特效"
            w34
          />
          <div flex="~ 1 gap5" right-2>
            <ZRadio
              :model-value="pageCfg!.isArtCursor?.toString()"
              val="true"
              label="启用"
              @update:model-value="pageCfg!.isArtCursor = true"
            />
            <ZRadio
              :model-value="pageCfg!.isArtCursor?.toString()"
              val="false"
              label="禁用"
              @update:model-value="pageCfg!.isArtCursor = false"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
