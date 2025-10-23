<script setup lang="ts">
import moment from 'moment'
import type { IArticle } from 'types'
import { MdPreview } from 'md-editor-v3'

import 'md-editor-v3/lib/style.css'

import robot from '~/assets/icons/ident/robot.svg?raw'

const route = useRoute()

/** 加载中 */
const loading = ref(false)
/** 文章id */
const articleId = ref<string>()
/** 文章信息 */
const article = ref<IArticle>()

const weekMap: Record<number, string> = {
  0: '星期日',
  1: '星期一',
  2: '星期二',
  3: '星期三',
  4: '星期四',
  5: '星期五',
  6: '星期六',
}

const formattedDate = computed(() => {
  if (!article.value?.createdAt)
    return ''
  const m = moment(article.value.createdAt)
  const dateStr = m.format('YYYY年MM月DD日')
  return `${dateStr}，${weekMap[m.day()]}`
})

watch(
  articleId,
  (newVal) => {
    if (newVal)
      gerArticleDetail(newVal)
  },
)

/**
 * 获取文章详情
 * @param articleId 文章ID
 */
async function gerArticleDetail(articleId: string) {
  loading.value = true
  try {
    article.value = await gerArticleDetailApi(articleId)
  }
  finally {
    loading.value = false
  }
}

onBeforeMount(() => {
  const { id } = route.query as { id?: string }
  articleId.value = id
})
</script>

<template>
  <div full flex="~ justify-center">
    <ZLoading :value="loading" />

    <div
      v-if="article"
      flex="~ col" h-full
      lg="w-1080px px-0" sm="px-6"
      px-4 overflow-auto
    >
      <div full flex="~ col gap6 sm:gap10" py-4>
        <div flex="~ col gap2">
          <h1 v-text="article?.name" />
          <div
            text-sm flex="~ items-center gap4"
            style="color: var(--grey-6);"
          >
            <div flex="~ items-center gap1">
              <div i-mingcute:time-line />
              <div
                v-if="article?.createdAt"
                v-text="formattedDate"
              />
            </div>
            <template v-if="article?.pageView">
              <div
                w-1.5 h-1.5 b-rd-10
                style="background-color: var(--grey-6);"
              />
              <div flex="~ items-center gap1">
                <div i-mingcute:eye-2-line />
                <div v-text="article.pageView" />
              </div>
            </template>
          </div>
        </div>
        <div flex="~ gap-6 justify-between" pb-25>
          <div lg="max-w-1080px" flex="~ col gap4 1" w-0>
            <div
              v-if="article?.abstract"
              bg="#231639" b-rd-2 p-4 flex="~ col gap2"
            >
              <div flex="~ justify-between">
                <div text="6 grey-1" subtitle-1>
                  摘要
                </div>
                <div flex="~ items-center gap2">
                  <div text-grey-5 v-html="robot" />
                  <div text-grey-5 text-sm>
                    此内容由 AI 生成
                  </div>
                </div>
              </div>
              <div text-grey-3 v-text="article?.abstract" />
            </div>
            <MdPreview
              :model-value="article?.content"
              :preview-theme="article?.theme"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.md-editor) {
  background-color: transparent !important;

  .md-editor-preview-wrapper{
    padding: 0;
    .md-editor-preview {
      h1 {
        color: var(--grey-9);
      }
      p {
        color: var(--grey-9);
      }
    }
  }
}

:deep(.md-editor-catalog) {
  width: 100%;

  .md-editor-catalog-link {
    padding-top: 0;
    padding-bottom: 0;
    span {
      color: var(--grey-6);
      opacity: 0.5;
    }
  }

  .md-editor-catalog-active {
    >span {
      color: var(--primary-9);
      opacity: 1;
    }
  }
}
</style>
