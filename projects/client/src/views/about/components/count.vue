<script setup lang="ts">
import type { IArticleCount } from 'types'

const articleCount = ref<IArticleCount[]>([])

/**
 * 获取文章、分类、标签数量
 */
async function getArticleAndTypeAndTagCount() {
  articleCount.value = await getArticleAndTypeAndTagCountApi()
}

onBeforeMount(getArticleAndTypeAndTagCount)
</script>

<template>
  <div v-if="articleCount.length" flex="~ gap6 justify-center">
    <div
      v-for="(count, index) in articleCount" :key="index"
      flex="~ 1 col items-center" max-w-58
      border="1 grey-2 dark:grey-8"
      bg="grey-1 dark:grey-9"
      sm="p-4" b-rd-2 p2 subtitle-2
    >
      <div v-text="count.count" />
      <div v-text="count.name" />
    </div>
  </div>
</template>

<style scoped></style>
