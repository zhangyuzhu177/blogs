<script setup lang="ts">
import moment from 'moment'
import { LikesType } from 'types'
import type { IArticle, ICreateLikeBodyDto, IGetLinkBodyDto, ILikes } from 'types'
import { MdPreview } from 'md-editor-v3'

import 'md-editor-v3/lib/style.css'

import aiAssistantIcon from '~/assets/icons/robot.svg'

const route = useRoute()
const router = useRouter()
const { visitorId } = useVisitor()
const articleContentRef = ref<HTMLElement>()

useArticleProgress(articleContentRef)

const dark = useDark()
const state = reactive({
  id: 'my-editor',
})

/** 加载中 */
const loading = ref(false)
/** 文章 */
const article = ref<IArticle>()
/** 文章id */
const articleId = ref()
/** 点赞记录 */
const likes = ref<ILikes[]>()

const weekMap: Record<number, string> = {
  0: '星期日',
  1: '星期一',
  2: '星期二',
  3: '星期三',
  4: '星期四',
  5: '星期五',
  6: '星期六',
}

/** 是否点赞 */
const liked = computed({
  get() {
    return likes.value?.some(v => v.visitorId === visitorId.value) ?? false
  },
  set() {
  },
})

const formattedDate = computed(() => {
  if (!article.value?.createdAt)
    return ''
  const m = moment(article.value.createdAt)
  const dateStr = m.format('YYYY年MM月DD日')
  return `${dateStr}，${weekMap[m.day()]}`
})

function mdHeadingId(_text: string, _level: number, index: number) {
  return `h-${_level}-${index}`
}

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
  const { articleId: id } = route.query
  if (!id)
    return router.replace('/')

  articleId.value = id
  loadData()
})
</script>

<template>
  <div class="article-page">
    <ZLoading :value="loading" class-name="text-grey-9 dark:text-grey-1" />

    <div class="article-shell">
      <article ref="articleContentRef" class="article-content">
        <header v-if="article" class="article-hero">
          <h1 v-text="article?.name" />
          <div class="article-meta">
            <div class="article-meta__item">
              <div i-mingcute:time-line />
              <span
                v-if="article?.createdAt"
                v-text="formattedDate"
              />
            </div>
            <template v-if="article?.pageView">
              <span class="article-meta__dot" />
              <div class="article-meta__item">
                <div i-mingcute:eye-2-line />
                <span v-text="article.pageView" />
              </div>
            </template>
          </div>
        </header>

        <section
          v-if="article?.abstract"
          class="article-summary"
        >
          <div class="article-summary__head">
            <div class="article-summary__title">
              摘要
            </div>
            <div class="article-summary__label">
              <img class="article-summary__robot" :src="aiAssistantIcon" alt="">
              <span>
                此内容由 AI 生成
              </span>
            </div>
          </div>
          <p v-text="article?.abstract" />
        </section>

        <MdPreview
          :model-value="article?.content"
          :preview-theme="article?.theme"
          :editor-id="state.id"
          :md-heading-id="mdHeadingId"
          :theme="dark ? 'dark' : 'light'"
        />

        <div
          v-if="article?.tags?.length"
          class="article-tags"
        >
          <span class="article-tags__label">标签：</span>
          <div
            v-for="v in article?.tags" :key="v.id"
            class="article-tags__item"
            v-text="`#${v.name}`"
          />
        </div>

        <ThumbsUp
          v-if="article"
          v-model:liked="liked"
          :count="likes?.length"
          @callback="thumbsUp"
        />
      </article>

    </div>

    <ArticleAgent :article="article" />
  </div>
</template>

<style scoped lang="scss">
.article-page {
  padding-top: 24px;
  padding-bottom: 72px;
}

.article-shell {
  display: grid;
  grid-template-columns: minmax(0, 860px);
  justify-content: center;
  align-items: start;
  width: 100%;
}

.article-content {
  min-width: 0;
}

.article-hero {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 30px;

  h1 {
    margin: 0;
    color: var(--grey-9);
    font-size: 34px;
    font-weight: 750;
    line-height: 1.32;
    letter-spacing: 0;
  }
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  color: var(--grey-6);
  font-size: 13px;
  line-height: 20px;
}

.article-meta__item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.article-meta__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--grey-5);
}

.article-summary {
  margin-bottom: 48px;
  padding: 18px 20px;
  border-radius: 8px;
  color: var(--grey-1);
  background: #151923;
  box-shadow: 0 16px 38px rgba(16, 21, 34, 0.14);

  p {
    margin: 12px 0 0;
    color: rgba(255, 255, 255, 0.84);
    font-size: 14px;
    line-height: 1.85;
  }
}

.article-summary__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.article-summary__title {
  color: var(--grey-1);
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
}

.article-summary__label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.58);
  font-size: 12px;
  white-space: nowrap;
}

.article-summary__robot {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding-top: 40px;
  color: var(--grey-7);
  font-size: 13px;
}

.article-tags__label {
  color: var(--grey-7);
}

.article-tags__item {
  padding: 6px 12px;
  border-radius: 7px;
  color: var(--grey-7);
  background: var(--grey-2);
  transition: background 0.2s, color 0.2s;

  &:hover {
    color: var(--grey-9);
    background: var(--grey-3);
  }
}

:deep(.md-editor) {
  background-color: transparent !important;

  .md-editor-preview-wrapper{
    padding: 0;

    .md-editor-preview {
      h1 {
        margin-top: 0;
        margin-bottom: 24px;
        color: var(--grey-9);
        font-size: 30px;
        line-height: 1.4;
      }

      h2 {
        margin-top: 44px;
        margin-bottom: 18px;
        color: var(--grey-9);
        font-size: 24px;
        line-height: 1.45;
      }

      h3 {
        margin-top: 32px;
        margin-bottom: 14px;
        color: var(--grey-9);
        font-size: 18px;
        line-height: 1.5;
      }

      p {
        color: var(--grey-9);
        font-size: 15px;
        line-height: 1.95;
      }

      li {
        color: var(--grey-9);
        font-size: 15px;
        line-height: 1.9;
      }

      .md-editor-code {
        .md-editor-code-head {
          z-index: 1;
        }
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

@media (max-width: 1180px) {
  .article-hero h1 {
    font-size: 30px;
  }
}

@media (max-width: 640px) {
  .article-page {
    padding-top: 16px;
    padding-bottom: 56px;
  }

  .article-hero {
    margin-bottom: 24px;

    h1 {
      font-size: 26px;
    }
  }

  .article-summary {
    margin-bottom: 36px;
    padding: 16px;
  }

  .article-summary__head {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  :deep(.md-editor) {
    .md-editor-preview-wrapper {
      .md-editor-preview {
        h1 {
          font-size: 26px;
        }

        h2 {
          font-size: 21px;
        }
      }
    }
  }
}
</style>
