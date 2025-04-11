<script setup lang="ts">
import moment from 'moment'
import { Like } from 'typeorm'
import type { IArticle, IArticleType, IQueryDto } from 'types'

const router = useRouter()

/** 加载中 */
const loading = ref(false)
/** 文章分类 */
const types = ref<Omit<IArticleType, 'createdAt' | 'updatedAt'>[]>()
/** 分类 */
const typeId = ref()
/** 搜索 */
const search = ref('')
/** 文章列表 */
const articles = ref()

watch(
  [typeId, search],
  async ([newTypeId, newSearch]) => {
    loading.value = true
    try {
      const body: IQueryDto<IArticle> = {
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
        pagination: {
          pageSize: 'all',
        },
        order: {
          createdAt: 'DESC',
        },
      }
      if (newSearch)
        body.where = { name: Like(`%${newSearch}%`) }
      if (newTypeId && newTypeId !== 'all')
        body.where = { articleTypeId: Like(`%${newTypeId}%`) }

      const { data } = await queryArticleListApi(body)
      articles.value = groupByYear(data)
    }
    finally {
      loading.value = false
    }
  },
)

// 按年份分类数据
function groupByYear(data: IArticle[]) {
  return data.reduce<Record<number, IArticle[]>>((acc, item) => {
    const year = new Date(item.createdAt).getFullYear()
    if (!acc[year])
      acc[year] = []

    acc[year].push(item)
    return acc
  }, {})
}

onBeforeMount(async () => {
  const res = await getArticleTypeListApi() || []
  types.value = [
    {
      id: 'all',
      name: '全部',
    },
    ...res,
  ]
  typeId.value = types.value?.[0]?.id
})
</script>

<template>
  <div full flex="~ col gap4 sm:gap6">
    <ZLoading :value="loading" />

    <header flex="~ col justify-center gap2 sm:gap4">
      <h1 text-center>
        归档
      </h1>
      <div w-full h-1px bg-grey-3 />
    </header>

    <div flex="~ 1 col gap4 sm:gap6" h0>
      <div flex="~ gap4 justify-between">
        <ZSelect
          v-model="typeId"
          :options="types"
          option-value="id"
          option-label="name"
          size="small"
          w-35
        />
        <ZInput
          v-model="search"
          size="small"
          placeholder="搜索文章..."
          :debounce="500"
          w70
        >
          <template #prepend>
            <div icon i-mingcute:search-line />
          </template>
        </ZInput>
      </div>

      <template v-if="articles">
        <div
          v-for="(item, key) in articles" :key="key"
          flex="~ col gap4"
        >
          <div flex="~ gap2 items-center">
            <div w-6 h-6 i-mingcute:calendar-2-line />
            <div text-6 font-600 v-text="key" />
          </div>
          <div flex="~ col gap2 sm:gap4" px-4>
            <div
              v-for="article in item" :key="article.id"
              flex="~ gap-2 items-center"
            >
              <div
                w-1.5 h-1.5 b-rd-10
                style="background-color: var(--grey-9);"
              />
              <div
                text-nowrap text="grey-5 dark:grey-7"
                v-text="moment(article.createdAt).format('MM-DD')"
              />
              <div icon i-mingcute:arrows-right-line />
              <div
                subtitle-2 cursor-pointer truncate transition-all
                hover="text-grey-9 dark:text-grey-1" text-grey-5
                flex-1
                @click="router.push(`/article?articleId=${article.id}`)"
                v-text="article.name"
              />
            </div>
          </div>
        </div>
      </template>
      <ZEmpty v-else full flex-center label="暂无数据" />
    </div>
  </div>
</template>
