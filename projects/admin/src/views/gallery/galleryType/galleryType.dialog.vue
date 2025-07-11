<script setup lang="ts">
import { Notify } from 'quasar'
import { cloneDeep } from 'lodash'
import { objectPick } from 'utils'
import type { IGalleryType, IUpsertGalleryTypeBodyDto } from 'types'
import { validateDesc, validateName } from 'shared/utils/validators'

interface GalleryTypeProps {
  /**
   * 分类信息对话框的操作类型
   */
  type?: DialogType
  /**
   * 分类信息
   */
  galleryType?: IGalleryType
  /**
   * 在更新、插入后的回调
   */
  onCallback?: () => void
}

const props = defineProps<GalleryTypeProps>()
const emits = defineEmits<{
  /**
   * 更新标签对话框的操作类型
   */
  'update:type': [GalleryTypeProps['type']]
}>()

/** 对话框 */
const dialog = computed({
  get() {
    const { type, galleryType } = props
    return type === '添加' || (!!type && !!galleryType)
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
const initData: IUpsertGalleryTypeBodyDto = {
  name: '',
  order: 1,
}
/** 添加/编辑 form 表单 */
const form = ref(cloneDeep(initData))

watch(
  () => dialog.value,
  (newVal) => {
    if (newVal) {
      const { type, galleryType } = props
      if (type === '添加') {
        form.value = cloneDeep(initData)
      }
      else if (galleryType) {
        form.value = {
          ...objectPick(
            galleryType,
            'name', 'desc', 'order',
          ),
        }
      }
    }
  },
)

/** 禁用提交 */
const disable = computed(() => {
  const { name, desc } = form.value
  return !!validateName(name)
    || (!!desc && !!validateDesc(desc))
})

/**
 * 添加/编辑类别
 */
async function upsertGalleryType() {
  if (disable.value)
    return

  const { type, galleryType, onCallback } = props
  loading.value = true

  try {
    if (type === '添加')
      await createGalleryTypeApi(form.value)
    else if (type === '编辑')
      await updateGalleryTypeApi(form.value, galleryType!.id)

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
    :title="`${type}分类`"
    :loading
    scroll :footer="!readonly"
    confirm-text="保存"
    :wrapper-style="{
      width: '900px',
      maxWidth: '900px',
    }"
    :disable-confirm="disable"
    @ok="upsertGalleryType"
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
      <ZInput
        v-model="form.order"
        label="排序"
        placeholder="请输入排序"
        type="number"
        required :readonly
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
    </div>
  </ZDialog>
</template>
