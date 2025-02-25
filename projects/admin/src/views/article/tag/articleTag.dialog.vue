<script setup lang="ts">
import { Notify } from 'quasar'
import { cloneDeep } from 'lodash'
import { objectPick } from 'utils'
import type { IArticleTag, IUpsertArticleTagBodyDto } from 'types'
import { validateDesc, validateName } from 'shared/utils/validators'

interface ArticleTagProps {
  /**
   * 标签信息对话框的操作类型
   */
  type?: DialogType
  /**
   * 标签信息
   */
  articleTag?: IArticleTag
  /**
   * 在更新、插入后的回调
   */
  onCallback?: () => void
}

const props = defineProps<ArticleTagProps>()
const emits = defineEmits<{
  /**
   * 更新标签信息对话框的操作类型
   */
  'update:type': [ArticleTagProps['type']]
}>()

/** 对话框 */
const dialog = computed({
  get() {
    const { type, articleTag } = props
    return type === '添加' || (!!type && !!articleTag)
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
const initData: IUpsertArticleTagBodyDto = {
  name: '',
}
/** 添加/编辑用户 form 表单 */
const form = ref(cloneDeep(initData))

watch(
  () => dialog.value,
  (newVal) => {
    if (newVal) {
      const { type, articleTag } = props
      if (type === '添加') {
        form.value = cloneDeep(initData)
      }
      else if (articleTag) {
        form.value = {
          ...objectPick(
            articleTag,
            'name', 'desc',
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
async function upsertArticleTag() {
  if (disable.value)
    return

  const { type, articleTag, onCallback } = props
  loading.value = true

  try {
    if (type === '添加')
      await createArticleTagApi(form.value)
    else if (type === '编辑')
      await updateArticleTagApi(form.value, articleTag!.id)

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
    :title="`${type}类别`"
    :loading
    scroll :footer="!readonly"
    confirm-text="保存"
    :wrapper-style="{
      width: '900px',
      maxWidth: '900px',
    }"
    :disable-confirm="disable"
    @ok="upsertArticleTag"
  >
    <div flex="~ col gap1">
      <ZInput
        v-model="form.name"
        label="标签名称"
        placeholder="请输入标签名称"
        required :readonly
        :rules="[
          (val: string) => validateName(val) || true,
        ]"
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
