<script setup lang="ts">
import { MdCatalog, MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import type { TocItem } from 'md-editor-v3/lib/types/MdCatalog/MdCatalog'
import type { IArticle } from 'shared/types/entities/article.interface'

const route = useRoute()
const router = useRouter()
const { articleId } = useMyLocalStorage()
const { width } = useWindowSize()
const { scrollEl } = useClientApp()

const data = ref<IArticle>()
const dark = useDark()
const state = reactive({
  id: 'my-editor',
})
const fixed = ref(false)
nextTick(() => {
  const { y } = useScroll(document?.querySelector('.q-scrollarea__container') as HTMLElement)
  watch(
    () => y.value,
    (newVal) => {
      if (newVal > 600)
        fixed.value = true
      else
        fixed.value = false
    },
  )
})

const scrollElement = document?.querySelector('.q-scrollarea__container')

function mdHeadingId(_text: string, _level: number, index: number) {
  return `h-${_level}-${index}`
}

function onClick(e: MouseEvent, t: TocItem) {
  const el = document.getElementById(`h-${t.level}-${t.index}`)

  if (el) {
    scrollEl.value?.setScrollPosition(
      'vertical',
      el?.offsetTop + 600 - 10,
      300,
    )
  }
}

onMounted(async () => {
  // 先判断本地是否有文章id，没有重定向到首页
  if (!articleId.value)
    router.replace('/')

  router.replace({ query: { id: articleId.value } })

  if (route.query.id) {
    const { id } = route.query
    data.value = await gerArticleInfoApi(id as string)
  }

  scrollEl.value?.setScrollPosition(
    'vertical',
    0,
    300,
  )
})
</script>

<template>
  <div v-if="data" flex="~  gap-6" class="el" full>
    <MdPreview
      :model-value="data.content"
      preview-theme="github"
      :editor-id="state.id"
      :md-heading-id="mdHeadingId"
      :theme="dark ? 'dark' : 'light'"
    />
    <div v-if="width >= 900" flex overflow-hidden min-w-60>
      <div
        w-60 h-100 overflow-y-auto flex-1 top-20
        :style="{ position: fixed ? 'fixed' : 'static' }"
      >
        <MdCatalog
          :editor-id="state.id"
          :md-heading-id="mdHeadingId"
          :offset-top="100"
          :scroll-element="scrollElement"
          @on-click="onClick"
        />
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
  .md-editor-catalog-link {
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
