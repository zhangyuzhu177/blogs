<script setup lang="ts">
import moment from 'moment'
import { Like } from 'typeorm'
import type { IArticle, IGallery, IQueryDto } from 'types'

interface SearchResult extends IArticle, IGallery { }
type SearchType = 'article' | 'gallery'

const router = useRouter()

/** 加载 */
const loading = ref(false)
/** 搜索对话框 */
const dialog = ref(false)
/** 搜索 */
const search = ref('')
/** 搜索类型 */
const type = ref<SearchType>('article')
/** 搜索选项 */
const typeOptions = ref<{ label: string; name: SearchType }[]>([
  { label: '文章', name: 'article' },
  { label: '图库', name: 'gallery' },
])
const searchResult = ref<SearchResult[]>()

watch(
  dialog,
  () => {
    search.value = ''
    searchResult.value = []
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
 * 查询数据
 */
async function queryData() {
  searchResult.value = []
  loading.value = true

  try {
    let res
    const body: IQueryDto<IArticle | IGallery> = {
      where: {
        name: Like(`%${search.value.trim()}%`),
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
      body.select = {
        ...body.select,
        picture: true,
        desc: true,
      }
      res = await queryGalleryListApi(body)
    }

    searchResult.value = res?.data as SearchResult[]
  }
  finally {
    loading.value = false
  }
}

/**
 * 跳转到搜索结果
 */
function jump(id: string) {
  dialog.value = false

  if (type.value === 'article')
    router.push(`/archives/article?articleId=${id}`)
  else if (type.value === 'gallery')
    router.push(`/gallery/detail?galleryId=${id}`)
}
</script>

<template>
  <div>
    <q-btn flat round @click="dialog = true">
      <div size-5 i-mingcute:search-line />
    </q-btn>

    <ZDialog
      v-model="dialog"
      :loading position="top"
      class="search-dialog"
      :wrapper-style="{
        width: '800px',
        maxWidth: '800px',
      }"
      :no-backdrop-dismiss="false"
    >
      <template #default>
        <div flex="~ col">
          <header
            p-4
            flex="~ justify-between gap6 items-center"
            :b-b="search ? '1 grey-3 dark:grey-7' : 'none'"
          >
            <div class="field" flex="~ 1">
              <ZSelect v-model="type" :options="typeOptions" option-value="name" option-label="label" />
              <ZInput
                v-model="search"
                flex-1
                debounce="500" placeholder="Search"
              >
                <template #prepend>
                  <div icon i-mingcute:search-line />
                </template>
              </ZInput>
            </div>

            <div
              b-rd-1 p1.5 b="1 grey-3 dark:grey-7"
              hover="bg-grey-2 dark:bg-grey-8" cursor-pointer
              @click="dialog = false"
            >
              Esc
            </div>
          </header>
          <div v-if="search" p-4>
            <div
              v-if="searchResult?.length && !loading"
              max-h-96 overflow-auto
            >
              <div
                v-if="type === 'article'"
                flex="~ col gap2 sm:gap4 1" px-4
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
                    @click="jump(article.id)"
                  >
                    <span v-text="article.name" />
                  </div>
                </div>
              </div>
              <div
                v-else-if="type === 'gallery'"
                grid grid-cols-1 gap-4
                sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
              >
                <div
                  v-for="item in searchResult" :key="item.id"
                  class="group"
                  relative rounded-lg overflow-hidden cursor-pointer
                  transform transition duration-300 h-60
                  hover:shadow-xl
                  @click="jump(item.id)"
                >
                  <img
                    :src="item.picture[0]"
                    full object-cover transition-transform
                    duration-300 group-hover:scale-105
                  >
                  <div
                    class="absolute top-3 right-3 bg-black/30 text-grey-1
                    px-2 py-1 rounded-2 text-sm"
                    v-text="item.picture.length"
                  />
                  <div
                    class="absolute inset-0 bg-black/40 opacity-0
                  group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <div class="absolute bottom-0 left-0 right-0 p-4">
                    <div relative z-9999 flex="~ col gap-2">
                      <h3 subtitle-1 text-grey-1 v-text="item.name" />
                      <p
                        text-grey-1
                        class="text-sm opacity-0 max-h-0
                        overflow-hidden transition-all duration-500
                        group-hover:opacity-100 group-hover:max-h-20 line-clamp-3"
                        v-text="item.desc"
                      />
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                </div>
              </div>
            </div>
            <div v-else py-10>
              <ZEmpty label="暂无数据" />
            </div>
          </div>
        </div>
      </template>
    </ZDialog>
  </div>
</template>

<style lang="scss">
.search-dialog {
  .q-dialog__inner {
    top:100px !important;
  }

  .q-card {
    padding: 0 !important;

    > div:first-child {
      padding: 0 !important;
    }
  }

  .field {
    .z-select{
      .q-field__control {
        border-radius: 6px 0 0 6px !important;

        &::before {
          border-right: none !important;
        }

        &:hover::before {
          border-color: var(--grey-3);
        }

        &::after {
          border-right: none !important;
          border-color: var(--grey-3) !important;
        }
      }
    }

    .z-input{
      .q-field__control {
        border-radius: 0 6px 6px 0 !important;

        &:hover::before {
          border-color: var(--grey-3);
        }

        &::after {
          border-color: var(--grey-3) !important;
        }
      }
    }
  }
}
</style>
