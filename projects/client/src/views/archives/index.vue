<script setup lang="ts">
import moment from 'moment'
import { Like } from 'typeorm'
import type { IArticle, IArticleType, IQueryDto } from 'types'

const router = useRouter()
const { width } = useWindowSize()

/** 加载中 */
const loading = ref(false)
/** 文章分类 */
const types = ref<Omit<IArticleType, 'createdAt' | 'updatedAt'>[]>()
/** 分类 */
const typeId = ref()
/** 文章列表 */
const yearArticles = ref<{ year: number; articles: IArticle[] }[]>()

watch(
  typeId,
  async (newVal) => {
    loading.value = true
    try {
      const body: IQueryDto<IArticle> = {
        where: {
          status: true,
        },
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
      if (newVal && newVal !== 'all')
        body.where = { articleTypeId: Like(`%${newVal}%`) }

      const { data } = await queryArticleListApi(body)
      yearArticles.value = groupByYear(data)
    }
    finally {
      loading.value = false
    }
  },
)

// 按年份分类数据
function groupByYear(data: IArticle[]) {
  if (!data)
    return []
  const groupedData = data.reduce<Record<number, IArticle[]>>((acc, item) => {
    const year = new Date(item.createdAt).getFullYear()
    if (!acc[year])
      acc[year] = []
    acc[year].push(item)
    return acc
  }, {})

  // 将对象转为数组并按年份降序排列
  return Object.keys(groupedData)
    .map(Number)
    .sort((a, b) => b - a)
    .map(year => ({
      year,
      articles: groupedData[year],
    }))
}

onBeforeMount(async () => {
  loading.value = true
  try {
    const res = (await queryArticleTypeListApi({
      relations: {
        articles: true,
      },
      select: {
        id: true,
        name: true,
        articles: {
          id: true,
        },
      },
      pagination: {
        pageSize: 'all',
      },
      order: {
        createdAt: 'DESC',
      },
    })).data || []

    types.value = [
      {
        id: 'all',
        name: '全部',
        articles: res.map(v => v.articles ?? []).flat(),
      },
      ...res,
    ]
    typeId.value = types.value?.[0]?.id
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <div full flex="~ col gap6 sm:gap8" pt-6 md:pt-8>
    <ZLoading :value="loading" />

    <div flex="~ gap2 col" sm="justify-center flex-row gap4">
      <ZTabs
        v-if="width > 600"
        v-model="typeId"
        :options="types?.map(v => {
          return {
            label: `${v.name} ${v.articles?.length}`,
            name: v.id,
          }
        })"
      />
      <ZSelect
        v-else
        v-model="typeId"
        class="archive"
        :options="types"
        option-value="id"
        option-label="name"
        size="small"
        w-35
      />
    </div>

    <div
      v-for="{ year, articles } in yearArticles" :key="year"
      flex="~ col gap4 sm:gap6"
    >
      <div flex="~ gap2 items-center">
        <div w-6 h-6 i-mingcute:calendar-2-line />
        <div text-8 font-600 v-text="year" />
      </div>
      <div flex="~ col gap2 sm:gap4" px-4>
        <div
          v-for="article in articles" :key="article.id"
          flex="~ 1 gap-2 items-center"
        >
          <div
            text-nowrap
            v-text="moment(article.createdAt).format('MM-DD')"
          />
          <div icon i-mingcute:arrows-right-line />
          <div
            cursor-pointer truncate
            flex-1 w-0 hover:subtitle-2
            transition-all
            @click="router.push(`/article?articleId=${article.id}`)"
          >
            <span v-text="article.name" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.archive {
  .q-field__control {
    &:hover::before {
      border-color: var(--grey-3) !important;
    }
    &::after {
      border-color: var(--grey-3) !important;
    }
  }
}
</style>
