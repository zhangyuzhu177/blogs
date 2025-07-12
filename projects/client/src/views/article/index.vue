<script setup lang="ts">
import moment from 'moment'
import { LikesType } from 'types'
import type { IArticle, ICreateLikeBodyDto, IGetLinkBodyDto, ILikes } from 'types'
import { isClient } from '@vueuse/core'
import { MdPreview } from 'md-editor-v3'

import 'md-editor-v3/lib/style.css'

const route = useRoute()
const router = useRouter()
const { visitorId } = useVisitor()
// const { width } = useWindowSize()
// const { scrollEl } = useClientApp()

const dark = useDark()
const state = reactive({
  id: 'my-editor',
})
const sticky = ref(false)
const scrollElement = ref<HTMLElement | null>(null)

/** 加载中 */
const loading = ref(false)
/** 文章 */
const article = ref<IArticle>()
/** 文章id */
const articleId = ref()
/** 点赞记录 */
const likes = ref<ILikes[]>()

/** 是否点赞 */
const liked = computed({
  get() {
    return likes.value?.some(v => v.visitorId === visitorId.value) ?? false
  },
  set() {
  },
})

function mdHeadingId(_text: string, _level: number, index: number) {
  return `h-${_level}-${index}`
}

// function onClick(e: MouseEvent, t: TocItem) {
//   const el = document?.getElementById(`h-${t.level}-${t.index}`)

//   if (el) {
//     scrollEl.value?.setScrollPosition(
//       'vertical',
//       el?.offsetTop - 64,
//       0,
//     )
//   }
// }

/**
 * 点赞
 */
async function thumbsUp() {
  if (liked.value)
    return
  const body: ICreateLikeBodyDto = {
    contentId: articleId.value,
    visitorId: visitorId.value,
  }
  try {
    await likeArticleApi(body)
    // 避免重复点赞
    if (!liked.value) {
      likes.value = [
        ...(likes.value || []),
        { visitorId: visitorId.value } as ILikes,
      ]
    }
  }
  catch (e) {

  }
}

/**
 * 获取数据
 */
async function loadData() {
  loading.value = true

  try {
    const body: IGetLinkBodyDto = {
      contentId: articleId.value,
      type: LikesType.ARTICLE,
    }
    const [articleRes, likesRes] = await Promise.all([
      gerArticleDetailApi(articleId.value as string),
      getLinkApi(body),
    ])
    article.value = articleRes || {}
    likes.value = likesRes || []
  }
  finally {
    loading.value = false
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
        if (newVal > 64)
          sticky.value = true
        else
          sticky.value = false
      },
    )
    scrollElement.value = document?.querySelector('.q-scrollarea__container') as HTMLElement
  })

  const { articleId: id } = route.query
  if (!id)
    return router.replace('/')

  articleId.value = id
  loadData()
})
</script>

<template>
  <div flex="~ col gap8 sm:gap10" pt-6 md:pt-8>
    <ZLoading :value="loading" />

    <div flex="~ col gap2">
      <h1 v-text="article?.name" />
      <div
        subtitle-3 flex="~ items-center gap2"
        style="color: var(--grey-8);"
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
            style="background-color: var(--grey-8);"
          />
          <div flex="~ items-center gap1">
            <div i-mingcute:eye-2-line />
            <div v-text="article.pageView" />
          </div>
        </template>
      </div>
    </div>
    <div class="el" pb-10 sm:pb-16 flex="~ gap-6 justify-between">
      <div lg="max-w-1080px" flex="~ 1" w-0>
        <MdPreview
          :model-value="article?.content"
          :preview-theme="article?.theme"
          :editor-id="state.id"
          :md-heading-id="mdHeadingId"
          :theme="dark ? 'dark' : 'light'"
        />
      </div>
      <!-- <div v-if="width >= 960" w-60>
        <div
          flex="~ col gap2" p-4 p-b-0
          top-20 right-0
          overflow-y-auto overflow-x-auto
          :class="sticky ? 'sticky ' : ''"
          border-l="1" style="border-color: var(--grey-4);"
        >
          <div subtitle-2 flex="~ items-center gap2">
            <div i-mingcute:bookmark-fill />
            <div>目录</div>
          </div>
          <MdCatalog
            v-if="scrollElement"
            :editor-id="state.id"
            :md-heading-id="mdHeadingId"
            :offset-top="100"
            :scroll-element="scrollElement"
            @on-click="onClick"
          />
        </div>
      </div> -->
    </div>
    <ThumbsUp
      v-if="article"
      v-model:liked="liked"
      :count="likes?.length"
      @callback="thumbsUp"
    />
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
