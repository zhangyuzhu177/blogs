<script setup lang="ts">
import {Notify} from 'quasar'
import { IConfigDto } from 'shared/types/dto/config.interface';
import { SysConfig } from 'shared/types/enum/config.enum';

interface Props {
  data: {
    id: string
    label:string
  }
}
const props= defineProps<Props>()

const {active}=usePageAdmin()

const loading = ref(false)
const pageCfg=ref<IConfigDto[SysConfig.HOME]>()

/** 上传logo图片 */
const pageImg=ref<File>()
watch(pageImg, async(newVal) => {
  loading.value = true
  try {
    if (newVal) {
    const formData = new FormData()
    formData.append('file', newVal as File)
    const res = await uploadFileApi(formData, `/images/page/${newVal.name}`)
    pageCfg.value!.url = res.url
  }
  } catch (e) {}
  finally {
    loading.value = false
    pageImg.value=undefined
  }
})

/**获取数据 */
async function getConfigList() {
  loading.value=true
  try {
    const data = await getConfigApi(active.value)
    pageCfg.value=data
  } catch (error) {}
  finally {
    loading.value=false
  }
}

/** 保存修改 */
async function save() {
  loading.value = true
  try {
    const data = await upsertConfigApi({ version: active.value, [props.data.id]: { ...pageCfg.value } })

    if (data)
      Notify.create({ message: '修改成功', type: 'success' })
  } catch (error) {}
  finally {
    loading.value=false
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
      <div flex justify-between>
        <h3  v-text="data.label"/>
        <ZBtn min-w-20 label="保存" @click="save()" />
      </div>
      <div v-if="pageCfg" flex="~ col gap1">
        <div v-text="'标题'"/>
        <ZInput
        v-model="pageCfg.title"
        size="medium"
        :params="{
          counter:true,
          maxlength:'12'
        }"
        />
      </div>
      <div v-if="pageCfg" flex="~ col gap1">
        <div v-text="'简介'"/>
        <ZInput flex-1 v-model="pageCfg.label"
        size="medium" />
      </div>
      <div flex="~ col">
        <div flex justify-between>
          <div>背景图片</div>
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
          w-55 h-30 b-rd-5
          border="1px gray-4"
          overflow-hidden
          >
          <img full :src="pageCfg?.url" alt="">
        </div>
      </div>
    </div>
  </div>
</template>
