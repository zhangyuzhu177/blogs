<script setup lang="ts">
import { Notify } from 'quasar'
import { cloneDeep } from 'lodash'
import { objectPick } from 'utils'
import type { IGallery, IGalleryType, IUpsertGalleryBodyDto } from 'types'
import { validateDesc, validateName } from 'shared/utils/validators'

interface GalleryProps {
  /**
   * 图库信息对话框的操作类型
   */
  type?: DialogType
  /**
   * 图库信息
   */
  gallery?: IGallery
  /**
   * 图库分类列表
   */
  galleryTypeList?: IGalleryType[]
  /**
   * 在更新、插入后的回调
   */
  onCallback?: () => void
}

const props = defineProps<GalleryProps>()
const emits = defineEmits<{
  /**
   * 更新标签对话框的操作类型
   */
  'update:type': [GalleryProps['type']]
}>()

/** 对话框 */
const dialog = computed({
  get() {
    const { type, gallery } = props
    return type === '添加' || (!!type && !!gallery)
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
const initData: IUpsertGalleryBodyDto = {
  name: '',
  galleryTypeId: '',
  picture: [],
}
/** 添加/编辑 form 表单 */
const form = ref(cloneDeep(initData))
/** 图片 */
const picture = ref<File[]>()

watch(
  () => dialog.value,
  (newVal) => {
    if (newVal) {
      const { type, gallery } = props
      if (type === '添加') {
        form.value = cloneDeep(initData)
      }
      else if (gallery) {
        form.value = {
          ...objectPick(
            gallery,
            'name', 'desc', 'galleryTypeId', 'picture',
          ),
        }
      }
    }
  },
)

watch(picture, async (newVal) => {
  if (!newVal)
    return

  loading.value = true

  try {
    const uploadPromises = (newVal as File[]).map(async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      const res = await uploadFileApi(formData, `/images/gallery/${file.name}`)
      return res.url
    })

    const urls = await Promise.all(uploadPromises)
    Notify.create({
      type: 'success',
      message: '上传图片成功',
    })
    form.value.picture.push(...urls)
  }
  catch (error) {
    Notify.create({
      type: 'danger',
      message: '部分图片上传失败，请重试',
    })
  }
  finally {
    loading.value = false
    picture.value = undefined
  }
})

/** 禁用提交 */
const disable = computed(() => {
  const { name, galleryTypeId, picture } = form.value
  return !name || !galleryTypeId || !picture?.length
})

/**
 * 添加/编辑
 */
async function upsertGallery() {
  if (disable.value)
    return

  const { type, gallery, onCallback } = props
  loading.value = true

  try {
    if (type === '添加')
      await createGalleryApi(form.value)
    else if (type === '编辑')
      await updateGalleryApi(form.value, gallery!.id)

    Notify.create({
      type: 'success',
      message: `${type}成功`,
    })

    onCallback?.()
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <ZDialog
    v-model="dialog"
    :title="`${type}图库`"
    :loading
    scroll :footer="!readonly"
    confirm-text="保存"
    :wrapper-style="{
      width: '900px',
      maxWidth: '900px',
    }"
    :disable-confirm="disable"
    @ok="upsertGallery"
  >
    <div flex="~ col gap1">
      <ZInput
        v-model="form.name"
        label="名称"
        placeholder="请输入名称"
        required :readonly
        :rules="[
          (val: string) => validateName(val) || true,
        ]"
      />
      <ZSelect
        v-model="form.galleryTypeId"
        label="分类"
        required :readonly
        placeholder="请选择图库分类"
        :options="galleryTypeList"
        option-value="id"
        option-label="name"
        mb5
      />
      <ZInput
        v-model="form.desc"
        label="描述"
        placeholder="请输入描述(不能超过200字)"
        type="textarea"
        :readonly
        :rules="[
          (val: string) => validateDesc(val) || true,
        ]"
      />
      <div flex="~ col gap2" mb-5>
        <ZLabel required label="图片" />
        <div flex="~ gap4 wrap">
          <ZImg v-model="form.picture" width="120" height="120" />
          <ZUpload
            v-model="picture"
            type="image"
            multiple
            accept="image/*"
            w-30 b-rd-4
          >
            <div
              flex="~ col gap2 center"
              b-rd-4 full h-30
              border="1px dashed gray-5"
            >
              <div text="6 grey-5" i-ph:plus />
              <div text="grey-5" v-text="'上传图片'" />
            </div>
          </ZUpload>
        </div>
      </div>
    </div>
  </ZDialog>
</template>
