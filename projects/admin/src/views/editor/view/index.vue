<script setup lang="ts">
import moment from 'moment'
import type { IArticle } from 'types'
import { MdPreview } from 'md-editor-v3'

import 'md-editor-v3/lib/style.css'

const route = useRoute()

/** 文章id */
const articleId = ref<string>()
/** 文章信息 */
const article = ref<IArticle>()

watch(
  articleId,
  async (newVal) => {
    if (newVal)
      article.value = await gerArticleDetailApi(newVal)
  })

onBeforeMount(() => {
  const { id } = route.query as { id?: string }
  articleId.value = id
})
</script>

<template>
  <div
    w-full relative
    flex="~ justify-center"
  >
    <div
      flex="~ col" h-full
      lg="w-1080px px-0" sm="px-6"
      px-4 overflow-auto
    >
      <div full flex="~ col gap6 sm:gap10" py-4>
        <div flex="~ col gap2">
          <h1 v-text="article?.name" />
          <div
            subtitle-3 flex="~ items-center gap2"
            style="color: var(--grey-4);"
          >
            <div flex="~ items-center gap1">
              <div i-mingcute:time-line />
              <div
                v-if="article?.createdAt"
                v-text="moment.utc(article.createdAt).format('YYYY-MM-DD')"
              />
            </div>
            <template v-if="article?.pageView">
              <div
                w-1.5 h-1.5 b-rd-10
                style="background-color: var(--grey-4);"
              />
              <div flex="~ items-center gap1">
                <div i-mingcute:eye-2-line />
                <div v-text="article.pageView" />
              </div>
            </template>
          </div>
        </div>
        <div overflow-scroll flex="~ gap-6 justify-between" pb-50>
          <div lg="max-w-1080px" flex="~ 1" w-0>
            <MdPreview
              :model-value="article?.content"
              preview-theme="github"
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
