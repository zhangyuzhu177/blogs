<script setup lang="ts">
import { Notify } from 'quasar'
import type { IConfigDto } from 'shared/types/dto/config.interface'
import { SysConfig } from 'shared/types/enum/config.enum'

const { active } = usePageAdmin()

const loading = ref(false)
const appCfg = ref<IConfigDto[SysConfig.APP]>()
const oldCfg = ref('')

/** 上传logo图片 */
const logoImg = ref<File>()
watch(logoImg, async (newVal) => {
  loading.value = true
  try {
    if (newVal) {
      const formData = new FormData()
      formData.append('file', newVal as File)
      const res = await uploadFileApi(formData, `/images/page/${newVal.name}`)
      appCfg.value!.icon = res.url
    }
  }
  catch (e) {}
  finally {
    loading.value = false
    logoImg.value = undefined
  }
})

/** 获取数据 */
async function getConfigList() {
  loading.value = true
  try {
    const data = await getConfigApi(active.value) || {}
    appCfg.value = data
    oldCfg.value = JSON.stringify(data)
  }
  catch (error) {}
  finally {
    loading.value = false
  }
}
const inputRef = ref()
/** 保存修改 */
async function save(val: SysConfig) {
  loading.value = true
  try {
    const data = await upsertConfigApi({ version: val, [SysConfig.APP]: { ...appCfg.value } })
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
  <div full>
    <ZLoading :value="loading" />
    <div v-if="!loading" flex="~ col gap-4">
      <div flex items-center justify-between>
        <h3>APP设置</h3>
        <ZBtn
          min-w-20 label="保存"
          :disable="oldCfg === JSON.stringify(appCfg)"
          @click="save(SysConfig.APP)"
        />
      </div>
      <div v-if="appCfg" flex="~ col gap1">
        <ZLabel label="名称" />
        <ZInput
          ref="inputRef"
          v-model="appCfg.name"
          placeholder="输入APP名称"
          size="medium"
          :params="{
            counter: true,
            maxlength: '12',
          }"
        />
      </div>
      <div v-if="appCfg" flex="~ col gap1">
        <ZLabel label="英文名" />
        <ZInput
          v-model="appCfg.nameEn"
          placeholder="输入APP名称"
          size="medium"
          :params="{
            counter: true,
            maxlength: '12',
          }"
        />
      </div>
      <div flex="~ col">
        <div flex items-center justify-between>
          <ZLabel label="logo" />
          <ZUpload
            v-model="logoImg"
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
          <img v-iof="appCfg?.icon" full :src="appCfg?.icon">
        </div>
      </div>
    </div>
  </div>
</template>
