<script setup lang="ts">
import { Notify } from 'quasar'
import { cloneDeep } from 'lodash'
import { objectPick } from 'utils'
import type {
  ArticleTheme,
  IArticle,
  IArticleTag,
  IArticleType,
  IUpsertArticleBodyDto,
} from 'types'

import type { EditorType } from './index.vue'

const props = defineProps<EditorDialogProps>()

const emits = defineEmits<{
  /**
   * 更新文章对话框的操作类型
   */
  'update:type': [EditorDialogProps['type']]
}>()

const router = useRouter()

interface EditorDialogProps {
  /**
   * 文章对话框的操作类型
   */
  type?: EditorType
  /**
   * 文章标题
   */
  name?: string
  /**
   * 文章内容
   */
  content?: string
  /**
   * 文章主题
   */
  theme?: ArticleTheme
  /**
   * 文章信息
   */
  article?: IArticle
  /**
   * 文章分类列表
   */
  articleTypeList?: IArticleType[]
  /**
   * 文章标签列表
   */
  articleTagList?: IArticleTag[]
}

/** 对话框 */
const dialog = computed({
  get() {
    const { type, article } = props
    return type === 'add' || (!!type && !!article)
  },
  set() {
    emits('update:type', undefined)
  },
})

/** 加载中 */
const loading = ref(false)
/** 生成摘要中 */
const abstractLoading = ref(false)

const initData: IUpsertArticleBodyDto = {
  name: '',
  articleTypeId: '',
  abstract: '',
  content: '',
  status: true,
  tagIds: [],
}
/** 表单 */
const form = ref<IUpsertArticleBodyDto>(cloneDeep(initData))

watch(
  () => dialog.value,
  (newVal) => {
    if (newVal) {
      const { type, article } = props
      if (type === 'add') {
        form.value = cloneDeep(initData)
      }
      else if (article) {
        form.value = {
          ...objectPick(
            article,
            'name', 'articleTypeId', 'abstract', 'content',
            'tags', 'status',
          ),
        }
        form.value.tagIds = article.tags?.map(tag => tag.id)
      }
      form.value.name = props.name as string
      form.value.content = props.content as string
      form.value.theme = props.theme as ArticleTheme
    }
  },
)

const disable = computed(() => {
  const { name, articleTypeId, content, tagIds, abstract } = form.value
  return !name || !articleTypeId || !abstract || !content || !tagIds?.length || abstractLoading.value
})

/**
 * 添加/编辑文章
 */
async function callback() {
  if (disable.value)
    return

  loading.value = true
  const { type, article } = props
  try {
    if (type === 'add')
      await createArticleApi(form.value)
    else if (type === 'edit')
      await updateArticleApi(form.value, article!.id)

    Notify.create({
      type: 'success',
      message: `${type === 'add' ? '发布' : '修改'}成功`,
    })
    router.replace('/article')
  }
  finally {
    loading.value = false
  }
}

/**
 * 生成摘要
 */
async function generateAbstract() {
  abstractLoading.value = true
  form.value.abstract = '思考中...'

  try {
    const res = await fetch('/api/article/entities/abstract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        'Authorization': `Bearer ${authToken.value.trim()}`,
      },
      body: JSON.stringify({
        content: form.value.content,
      }),
    })

    if (!res.ok)
      throw new Error(`HTTP error! status: ${res.status}`)

    const reader = res.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader)
      throw new Error('No reader available')

    let isFirstChunk = true // 标记是否是第一个数据块

    while (true) {
      const { done, value } = await reader.read()
      if (done)
        break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)

          if (data === '[DONE]')
            return

          try {
            const parsed = JSON.parse(data)
            // 如果是第一个有效数据块，清除 "思考中..."
            if (isFirstChunk && parsed.content) {
              form.value.abstract = parsed.content
              isFirstChunk = false
            }
            else {
              form.value.abstract += parsed.content
            }
          }
          catch (e) {
            Notify.create({
              type: 'danger',
              message: '生成摘要失败',
            })
          }
        }
      }
    }
  }
  catch (error) {
    // 出错时也清除"思考中..."
    form.value.abstract = '生成失败，请重试...'
  }
  finally {
    abstractLoading.value = false
  }
}
</script>

<template>
  <ZDialog
    v-model="dialog"
    :title="`${type === 'add' ? '发布' : '修改'}文章`"
    scroll :loading footer
    :disable-confirm="disable"
    :wrapper-style="{
      width: '700px',
      maxWidth: '700px',
      maxHeight: '700px',
    }"
    @ok="callback"
  >
    <div flex="~ col gap1">
      <ZSelect
        v-model="form.articleTypeId"
        label="分类"
        required
        placeholder="请选择文章分类"
        :options="articleTypeList"
        option-value="id"
        option-label="name"
        mb5
      />
      <ZSelect
        v-model="form.tagIds"
        label="标签"
        required multiple
        placeholder="请选择文章标签"
        :options="articleTagList"
        option-value="id"
        option-label="name"
        mb5
        :params="{
          popupContentClass: 'z-select-popup-content',
        }"
      />
      <div flex="~ col gap1" mb5>
        <div flex="~ justify-between items-center">
          <ZLabel required label="摘要" />
          <ZBtn
            size="small"
            :disable="abstractLoading"
            :label="abstractLoading ? '生成中...' : form.abstract ? '重新生成' : '生成摘要'"
            @click="generateAbstract"
          />
        </div>
        <ZInput
          v-model="form.abstract"
          required
          type="textarea"
          placeholder="请输入文章摘要"
        />
      </div>
      <div flex="~ col gap2" mb5>
        <ZLabel
          label="文章状态"
          w34
        />
        <div flex="~ 1 gap5" right-2>
          <ZRadio
            :model-value="form.status?.toString()"
            val="true"
            label="正常"
            @update:model-value="form.status = true"
          />
          <ZRadio
            :model-value="form.status?.toString()"
            val="false"
            label="隐藏"
            @update:model-value="form.status = false"
          />
        </div>
      </div>
    </div>
  </ZDialog>
</template>

<style lang="scss">
.z-select-popup-content {
  max-height: 160px !important;
  overflow-y: auto;
  background-color: var(--grey-1) !important;
  box-shadow: 0px 5px 3px -2px #00000005, 0px 3px 2px -2px #0000000F;
  border-radius: 6px;
  border: 1px solid var(--grey-3);
  padding: 4px 0;
  color: var(--grey-9);
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  z-index: 9001;

  .q-item {
    padding: 8px 12px;
    min-height: 36px;

    .q-focus-helper {
      display: none;
    }

    &.q-item--active {
      background-color: var(--grey-2);

      > .q-item__section {
        color: var(--grey-9);
        font-weight: 500;
      }
    }

    &:hover {
      background-color: var(--grey-2);
    }
  }
}
</style>
