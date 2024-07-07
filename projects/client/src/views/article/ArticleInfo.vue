<script setup lang="ts">
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import type { IArticle } from 'shared/types/entities/article.interface'

const data = ref<IArticle[]>([])

onMounted(async () => {
  data.value = await getArticleListApi()
})
</script>

<template>
  <div v-if="data.length">
    <MdPreview text="grey-1" :model-value="data[0].content" />
  </div>
</template>

<style scoped lang="scss">
:deep(.md-editor-preview-wrapper) {
  background-color: var(--grey-2);
  .md-editor-preview h1{
    color: var(--grey-0);
  }
}
</style>
