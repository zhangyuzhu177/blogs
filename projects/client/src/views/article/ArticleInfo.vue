<script setup lang="ts">
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import type { IArticle } from 'shared/types/entities/article.interface'

const route = useRoute()
const router = useRouter()
const { query } = useMyLocalStorage()

const data = ref<IArticle>()

onMounted(async () => {
  // 判断本地存储的中是否有query参数
  const q = JSON.parse(query.value)
  if (q.id)
    router.replace({ query: q })

  if (route.query.id) {
    const { id } = route.query
    data.value = await gerArticleInfoApi(id as string)
  }
})
</script>

<template>
  <div v-if="data" flex="~ items-center" full>
    <MdPreview h-1000 text="grey-1" :model-value="data.content" />
    <div bg-red w-100>
      sa
    </div>
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
