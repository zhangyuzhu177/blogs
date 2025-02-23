<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { Notify } from 'quasar'
import type { IArticleType, IUpsertArticleTypeBodyDto } from 'types'
import { objectPick } from 'utils'
import { validateDesc, validateName } from 'shared/utils/validators'

interface ArticleTypeProps {
  /**
   * 分类信息对话框的操作类型
   */
  type?: DialogType
  /**
   * 分类信息
   */
  articleType?: IArticleType
  /**
   * 在更新、插入后的回调
   */
  onCallback?: () => void
}

const props = defineProps<ArticleTypeProps>()
const emits = defineEmits<{
  /**
   * 更新用户对话框的操作类型
   */
  'update:type': [ArticleTypeProps['type']]
}>()

/** 对话框 */
const dialog = computed({
  get() {
    const { type, articleType } = props
    return type === '添加' || (!!type && !!articleType)
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
const initData: IUpsertArticleTypeBodyDto = {
  name: '',
  order: 1,
}
/** 添加/编辑用户 form 表单 */
const form = ref(cloneDeep(initData))

watch(
  () => dialog.value,
  (newVal) => {
    if (newVal) {
      const { type, articleType } = props
      if (type === '添加') {
        form.value = cloneDeep(initData)
      }
      else if (articleType) {
        form.value = {
          ...objectPick(
            articleType,
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
async function upsertArticleType() {
  if (disable.value)
    return

  const { type, articleType, onCallback } = props
  loading.value = true

  try {
    if (type === '添加')
      await createArticleTypeApi(form.value)
    else if (type === '编辑')
      await updateArticleTypeApi(form.value, articleType!.id)

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
    @ok="upsertArticleType"
  >
    <div flex="~ col gap1">
      <ZInput
        v-model="form.name"
        label="分类名称"
        placeholder="请输入分类名称"
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
