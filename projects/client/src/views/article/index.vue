<script setup lang="ts">
import type { IArticle } from 'types'
import type { TocItem } from 'md-editor-v3/lib/types/MdCatalog/MdCatalog'

import 'md-editor-v3/lib/style.css'
import { MdCatalog, MdPreview } from 'md-editor-v3'
import { isClient } from '@vueuse/core'

interface ArticleDetailProps {
  article?: IArticle
}

defineProps<ArticleDetailProps>()

const { width } = useWindowSize()
const { scrollEl } = useClientApp()

const dark = useDark()
const state = reactive({
  id: 'my-editor',
})
const sticky = ref(false)
const scrollElement = ref<HTMLElement | null>(null)

function mdHeadingId(_text: string, _level: number, index: number) {
  return `h-${_level}-${index}`
}

function onClick(e: MouseEvent, t: TocItem) {
  const el = document?.getElementById(`h-${t.level}-${t.index + 1}`)

  if (el) {
    scrollEl.value?.setScrollPosition(
      'vertical',
      el?.offsetTop + 600 - 10,
      300,
    )
  }
}

onBeforeMount(async () => {
  nextTick(() => {
    if (!isClient)
      return
    const { y } = useScroll(document?.querySelector('.q-scrollarea__container') as HTMLElement)
    watch(
      () => y.value,
      (newVal) => {
        if (newVal > 600)
          sticky.value = true
        else
          sticky.value = false
      },
    )
    scrollElement.value = document?.querySelector('.q-scrollarea__container') as HTMLElement
  })

  scrollEl.value?.setScrollPosition(
    'vertical',
    0,
    300,
  )
})
</script>

<template>
  <div flex="~ col">
    <div class="el" flex="~ gap-6 justify-between" full>
      <div xxl="max-w-1080px" flex="~ 1" w-0>
        <MdPreview
          :model-value="article?.content"
          preview-theme="github"
          :editor-id="state.id"
          :md-heading-id="mdHeadingId"
          :theme="dark ? 'dark' : 'light'"
        />
      </div>
      <div v-if="width >= 1200" w-60>
        <div
          top-20 right-0 max-h-100
          overflow-y-auto overflow-x-auto
          :class="sticky ? 'sticky ' : ''"
        >
          <MdCatalog
            v-if="scrollElement"
            :editor-id="state.id"
            :md-heading-id="mdHeadingId"
            :offset-top="100"
            :scroll-element="scrollElement"
            @on-click="onClick"
          />
        </div>
      </div>
    </div>

    <div h-100 />
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
