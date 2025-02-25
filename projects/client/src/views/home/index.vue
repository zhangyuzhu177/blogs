<script setup lang="ts">
import moment from 'moment'
import type { IArticle, IArticleType } from 'types'

const router = useRouter()
const { scrollEl } = useClientApp()

/** 加载中 */
const loading = ref(false)
/** 文章类别 */
const articleTypes = ref<IArticleType[]>()
/** 文章列表 */
const articlesList = ref<IArticle[]>()
/** 选中的分类 */
const articleTypeId = ref()
/** 分页 */
const pagination = ref({
  page: 1,
  pageSize: 10,
})
/** 总数 */
const rowsNumber = ref()

watch(
  () => [articleTypeId.value, pagination.value.page],
  async ([newArticleTypeId, newPage]) => {
    loading.value = true

    try {
      const { data, total } = await queryArticleListByTypeApi(
        newArticleTypeId,
        {
          page: newPage,
          pageSize: pagination.value.pageSize,
        },
      )
      articlesList.value = data
      rowsNumber.value = total
    }
    finally {
      loading.value = false
    }
  },
)

/**
 * 切换 分类
 */
function changeArticleType(id: string) {
  articleTypeId.value = id

  scrollEl.value?.setScrollPosition(
    'vertical',
    600,
    300,
  )
}

/**
 * 跳转文章详情页
 */
function jumpArticle(articleId: string) {
  router.push({
    path: '/article',
    query: {
      articleId,
    },
  })
}

onBeforeMount(async () => {
  articleTypes.value = await getArticleTypeListApi()
  articleTypeId.value = articleTypes.value?.[0]?.id
})
</script>

<template>
  <div flex="~ col lg:row gap6">
    <!-- 分类列表 -->
    <div>
      <div
        class="hide-scrollbar sticky top-18"
        flex="~ gap2 lg:col row" lg="w-45 p2 px0"
        px-2
        overflow-x-auto b-rd-2
      >
        <div
          v-for="{ id, name } in articleTypes" :key="id"
          p="x4 y2" text-center cursor-pointer h-10
          subtitle-2 transition-300 select-none
          :class="articleTypeId === id
            ? 'text-primary-1'
            : 'hover:bg-#575E6A1A hover:text-primary-1'"
          @click="changeArticleType(id)"
          v-text="name"
        />
      </div>
    </div>

    <div flex="~ 1 col justify-between gap6">
      <template v-if="articlesList?.length">
        <!-- 文章列表 -->
        <div flex="~ col gap4">
          <div
            v-for="article in articlesList"
            :key="article.id"
            class="article"
            flex="~ justify-between gap4"
            h-30 p-2 cursor-pointer b-rd-2
            b="1 transparent" overflow-hidden
            @click="jumpArticle(article.id)"
          >
            <div overflow-hidden>
              <q-img loading="lazy" w-50 :src="article.cover" />
            </div>

            <div flex="~ col 1 gap2 justify-between">
              <div flex>
                <h3
                  class="title"
                  whitespace-nowrap relative
                  transition="300"
                  style="color:var(--grey-7)"
                  v-text="article.name"
                />
              </div>

              <div flex="~ col gap2 justify-between">
                <div
                  subtitle-3
                  flex="~ justify-between"
                  text="grey-5 dark:grey-5"
                >
                  <div flex="~ gap4">
                    <div
                      v-if="article.createdAt"
                      v-text="moment.utc(article.createdAt).format('YYYY-MM-DD')"
                    />
                    <div
                      v-if="article.pageView"
                      flex="~ items-center gap1"
                    >
                      <div i-mingcute:eye-2-line />
                      <div v-text="article.pageView" />
                    </div>
                  </div>

                  <div flex="~ gap4">
                    <div
                      v-for="tag in article.tags"
                      :key="tag.id"
                      p="x2" b-rd-2px
                      v-text="tag.name"
                    />
                  </div>
                </div>
              </div>
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
      </template>

      <ZEmpty v-else label="暂无数据" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.article{
  transition: all .3s;

  .title {
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background-color: var(--grey-7);
      transition: all .5s;
    }
  }

  &:hover {
    background-color: var(--grey-2);
    border-color: var(--grey-3);
    .title{
      color: var(--grey-7);
      &::after {
        width: 100%;
      }
    }
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
