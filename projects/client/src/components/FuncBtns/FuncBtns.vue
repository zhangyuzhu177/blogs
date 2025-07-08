<script setup lang="ts">
import moment from 'moment'
import { Like } from 'typeorm'
import type { IArticle, IGallery, IQueryDto } from 'types'

const router = useRouter()
const isDark = useDark({
  selector: 'html',
  attribute: 'theme',
  valueDark: 'dark',
  valueLight: 'light',
})
const dark = useStorage('dark', useColorMode().value)

const toggle = useToggle(isDark)

/** 加载 */
const loading = ref(false)
/** 搜索对话框 */
const dialog = ref(false)
/** 搜索 */
const search = ref('')
/** 搜索类型 */
const type = ref('article')
/** 搜索选项 */
const typeOptions = ref([
  { label: '文章', name: 'article' },
  // { label: '图库', name: 'gallery' },
])
const searchResult = ref<IArticle[] | IGallery[]>()

watch(
  isDark,
  () => {
    dark.value = useColorMode().value
  },
)

watch(
  () => [search.value, type.value],
  ([newSearch, newType]) => {
    if (!newSearch || !newType)
      return searchResult.value = []
    queryData()
  },
)

/**
 * 主题切换
 */
function toggleTheme(event: any) {
  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )

  // 兼容性处理
  if (!(document as any).startViewTransition) {
    toggle()
    return
  }
  const transition = (document as any).startViewTransition(async () => {
    toggle()
  })

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ]
    document.documentElement.animate(
      {
        clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 400,
        easing: 'ease-in',
        pseudoElement: isDark.value
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)',
      },
    )
  })
}

/**
 * 查询数据
 */
async function queryData() {
  searchResult.value = []
  loading.value = true

  try {
    let res
    const body: IQueryDto<IArticle | IGallery> = {
      where: {
        name: Like(`%${search.value}%`),
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
    if (type.value === 'article') {
      res = await queryArticleListApi(body)
    }
    else if (type.value === 'gallery') {
      // searchResult.value = [
      //   { id: '1', name: '图库1' } as IGallery,
      //   { id: '2', name: '图库2' } as IGallery,
      // ]
    }
    searchResult.value = res?.data || []
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div flex="~ justify-end items-center" b-rd>
    <q-btn flat round @click="dialog = true">
      <div size-5 i-mingcute:search-line />
    </q-btn>
    <q-btn flat round @click="toggleTheme">
      <div v-if="dark === 'light'" size-5 i-ph:sun-bold />
      <div v-else size-5 i-ph:moon-bold />
    </q-btn>

    <ZDialog
      v-model="dialog"
      title="搜索"
      :loading scroll
      class="search-dialog"
      :wrapper-style="{
        width: '800px',
        maxWidth: '800px',
        height: '650px',
      }"
    >
      <div flex="~ col gap4" full>
        <ZInput v-model="search" debounce="500" placeholder="请输入搜索内容">
          <template #prepend>
            <div icon i-mingcute:search-line />
          </template>
        </ZInput>
        <div flex="~ justify-center">
          <ZTabs v-model="type" :options="typeOptions" />
        </div>
        <div
          v-if="searchResult?.length"
          flex="~ col gap2 sm:gap4 1" h-0 px-4
          overflow-auto
        >
          <div
            v-for="article in searchResult" :key="article.id"
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
        <div v-else py-10>
          <ZEmpty label="暂无数据" />
        </div>
      </div>
    </ZDialog>
  </div>
</template>

<style scoped lang="scss">
:deep(.q-btn){
  .q-focus-helper {
    display: none;
  }

  .q-ripple {
    display: none;
  }

  .q-tab__indicator{
    display: none;
  }
}
</style>
