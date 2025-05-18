<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { ArticleTheme, PermissionType, articleThemeDescriptions } from 'types'
import type { IArticle, IArticleTag, IArticleType, IUpsertArticleBodyDto } from 'types'

import EditorDialog from './editor.dialog.vue'

export type EditorType = 'add' | 'edit'

const route = useRoute()
const router = useRouter()
const { hasPermission } = useUser()

/** 是否可添加 */
const isCreate = hasPermission(PermissionType.ARTICLE_PUBLISH)
/** 是否可便捷 */
const isUpdate = hasPermission(PermissionType.ARTICLE_UPDATE)

/** 加载中 */
const loading = ref(false)
/** 操作类型 */
const type = ref<EditorType>()
/** 文章id */
const articleId = ref<string>('')
/** 文章 */
const article = ref<IArticle>()
/** 分类列表 */
const articleTypeList = ref<IArticleType[]>()
/** 标签列表 */
const articleTagList = ref<IArticleTag[]>()

const initData: IUpsertArticleBodyDto = {
  name: '',
  content: '',
  articleTypeId: '',
  status: true,
  theme: ArticleTheme.DEFAULT,
}
/** 表单 */
const form = ref<IUpsertArticleBodyDto>(cloneDeep(initData))

const disable = computed(() => {
  const { name, content } = form.value
  return !name || !content
})

watch(
  articleId,
  async (newVal) => {
    const { type } = route.query as { type: EditorType }

    if (newVal && type === 'edit') {
      article.value = await gerArticleDetailApi(newVal)
      form.value = article.value
    }
  },
)

onBeforeMount(async () => {
  const { id, type } = route.query as { type: EditorType; id?: string }

  articleId.value = id || ''

  if (type === 'add' && !isCreate)
    router.push('/')
  else if (type === 'edit' && !isUpdate)
    router.push('/')
  else if ((type === 'edit' && !articleId.value) || !type)
    router.push('/')

  loading.value = true
  try {
    articleTypeList.value = (await queryArticleTypeListApi({
      pagination: {
        pageSize: 'all',
      },
      order: {
        order: 'asc',
      },
    })).data
    articleTagList.value = (await queryArticleTagListApi({
      pagination: {
        pageSize: 'all',
      },
    })).data
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="editor" p-4 flex="~ justify-center">
    <ZLoading :value="loading" />

    <div w-full flex="~ col gap4">
      <div px-6 flex="~ gap-6 items-center justify-between">
        <ZInput
          v-model="form.name"
          flex-1
          class="title_input"
          placeholder="输入文章标题..."
        />
        <ZBtn
          :disable label="保存"
          @click="() => { type = route.query.type as EditorType }"
        >
          <template #left>
            <div size-5 i-mingcute:save-2-line />
          </template>
        </ZBtn>
      </div>
      <div px-6 flex="~ items-center gap-4">
        <ZLabel label="主题" />
        <div flex="~ gap2">
          <div
            v-for="[key, value] in Object.entries(articleThemeDescriptions)" :key
            :class="key === form.theme ? 'active' : ''"
            cursor-pointer p="x2 y1" b-rd-2 b="1 grey-3"
            @click="() => { form.theme = key as ArticleTheme }"
            v-text="value"
          />
        </div>
      </div>
      <div flex-1 w-full h-0>
        <MdEditor
          v-model="form.content"
          :theme="form.theme"
          placeholder="输入文章内容"
          style="height: calc(100vh - 96px);"
        />
      </div>
    </div>

    <EditorDialog
      v-model:type="type"
      :article :theme="form.theme"
      :name="form.name"
      :content="form.content"
      :article-type-list
      :article-tag-list
    />
  </div>
</template>

<style scoped lang="scss">
.editor {
  .title_input {
    :deep(.q-field__control) {
      background-color: transparent;

      input {
        font-size: 24px;
        font-weight: 600;
      }

      &::before,&::after {
        border-color: transparent;
      }

      &:hover {
        &::before {
          border-color: transparent;
        }
      }
    }
  }

  .active {
    border-color: var(--primary-1);
    background-color: var(--primary-4);
  }
}
</style>
