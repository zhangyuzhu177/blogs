<script setup lang="ts">
import type { IArticle } from 'types'
import Article from '~/views/article/index.vue'

const route = useRoute()

/** 加载中 */
const loading = ref(false)
/** 文章详情 */
const article = ref<IArticle>()

watch(
  () => route.query,
  async (newVal) => {
    const { articleId } = newVal
    if (articleId)
      article.value = await gerArticleDetailApi(articleId as string)
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <Container
    :title="article?.name || 'null'"
    :img="article?.cover || 'null'"
  >
    <ZLoading :value="loading" />
    <Article :article />
  </Container>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
