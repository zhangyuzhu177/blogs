<script setup lang="ts">
import moment from 'moment'
import { Like } from 'typeorm'
import type { IArticle, IArticleTag } from 'types'

const router = useRouter()
const { scrollEl } = useClientApp()

/** 加载中 */
const loading = ref(false)
/** 标签列表 */
const tags = ref<IArticleTag[]>()
/** 标签 */
const tag = ref<IArticleTag>()
/** 文章列表 */
const articlesList = ref<IArticle[]>()
/** 分页 */
const pagination = ref({
  page: 1,
  pageSize: 10,
})
/** 总数 */
const rowsNumber = ref()

watch(
  () => [tag.value?.id, pagination.value.page],
  async ([newTagId, newPage]) => {
    loading.value = true

    scrollEl.value?.setScrollPosition(
      'vertical',
      0,
      0,
    )

    try {
      const { data, total } = await queryArticleListApi({
        where: {
          tags: {
            id: newTagId ? Like(`%${newTagId}%`) : undefined,
          },
        },
        relations: {
          tags: true,
        },
        pagination: {
          page: newPage as number,
          pageSize: pagination.value.pageSize,
        },
      })

      articlesList.value = data
      rowsNumber.value = total
    }
    finally {
      loading.value = false
    }
  },
  { immediate: true },
)

/**
 * 切换标签
 */
function changeArticleTag(val: IArticleTag) {
  if (tag.value?.id === val.id)
    tag.value = undefined
  else
    tag.value = val
}

/**
 * 跳转到
 */

onBeforeMount(async () => {
  tags.value = await getArticleTagListApi() || []
})
</script>

<template>
  <div full flex="~ col gap4 sm:gap6" relative whitespace-nowrap>
    <ZLoading :value="loading" />

    <header flex="~ col justify-center gap2 sm:gap4">
      <h1 text-center>
        标签
      </h1>
      <div w-full h-1px bg-grey-3 />
    </header>

    <div flex="~ 1 col" h0>
      <div v-if="tags?.length" full flex="~ col gap4 sm:gap6">
        <!-- 标签列表 -->
        <div flex="~ col gap4">
          <div subtitle-3 v-text="`共 ${tags?.length} 个标签`" />
          <div flex="~ gap2 sm:gap4 wrap row" sm="flex- flex-row">
            <div
              v-for="t in tags" :key="t.id"
              :class="tag?.id === t.id ? 'active' : 'tag-item'"
              flex="~ items-center gap3"
              px4 py1 b-rd-10 cursor-pointer
              @click="changeArticleTag(t)"
            >
              <div subtitle-3 v-text="t.name" />
              <div class="label" text-3 v-text="t.articles?.length || 0" />
            </div>
          </div>
        </div>
        <!-- 文章列表 -->
        <div flex="~ col sm:gap4 gap2">
          <div
            v-for="article in articlesList"
            :key="article.id"
            class="article"
            flex="~ col justify-between gap2"
            sm:p4 p2 cursor-pointer b-rd-2
            b="1 transparent" overflow-hidden
            @click="router.push(`/article?articleId=${article.id}`)"
          >
            <div subtitle-1 truncate v-text="article.name" />
            <div flex="~ col gap2 justify-between">
              <div
                subtitle-3
                flex="~ gap4"
                text="grey-5 dark:grey-5"
              >
                <div flex="~ items-center gap1">
                  <div i-mingcute:time-line />
                  <div
                    v-if="article.createdAt"
                    v-text="moment.utc(article.createdAt).format('YYYY-MM-DD')"
                  />
                </div>
                <div
                  v-if="article.pageView"
                  flex="~ items-center gap1"
                >
                  <div i-mingcute:eye-2-line />
                  <div v-text="article.pageView" />
                </div>
              </div>
            </div>

            <div v-if="article.tags?.length" flex="~ gap4">
              <div
                v-for="t in article.tags"
                :key="t.id"
                class="tag"
                p="x2" b-rd-5 text-3
                v-text="t.name"
              />
            </div>
          </div>
        </div>
        <!-- 分页 -->
        <div
          v-if="articlesList?.length && rowsNumber > pagination.pageSize"
          flex="~ center"
        >
          <q-pagination
            v-model="pagination.page"
            :max="Math.ceil(rowsNumber / pagination.pageSize)"
            :max-pages="6"
            direction-links flat
            color="dark:grey-1"
            active-color="none"
            active-text-color="primary-1"
          />
        </div>
      </div>
      <ZEmpty v-else label="暂无数据" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.tag-item {
  border: 1px solid var(--grey-3);

  &:hover {
    background-color: var(--grey-2);
  }

  .label{
    color:var(--grey-5);
  }
}

.active {
  color:var(--primary-1);
  border: 1px solid var(--primary-1);
  background-color: var(--primary-4);

  .label{
    color:var(--primary-1);
  }
}

.article {
  border: 1px solid var(--grey-3);

  .tag {
    background-color: var(--grey-3);
    color: var(--grey-7);
  }
}
</style>

<style lang="scss">
.q-pagination__content {
  gap: 16px;

  .q-btn {
    margin: 0 !important;
    padding: 0 !important;
    min-width: auto !important;

    &::before {
      display: none;
    }

    &.disabled {
      color: var(--grey-4) !important;
      opacity: 1 !important;
    }

    .q-focus-helper {
      display: none;
    }

    .q-ripple {
      display: none;
    }

    .q-icon {
      font-size: 14px;
    }

    .q-btn__content {
      font-size: 16px;
    }
  }

  .q-pagination__middle{
    gap: 16px;
  }
}
</style>
