<script setup lang="ts">
import { Like } from 'typeorm'
import type { IGallery, IGalleryType, IQueryDto } from 'types'

const router = useRouter()
const { width } = useWindowSize()

/** 加载中 */
const loading = ref(false)
/** 图库分类 */
const types = ref<Omit<IGalleryType, 'createdAt' | 'updatedAt'>[]>()
/** 分类 */
const typeId = ref()
/** 图库列表 */
const galleryList = ref<IGallery[]>()
/** 分页 */
const pagination = {
  page: 1,
  pageSize: 8,
}

watch(
  () => [typeId.value, pagination.page],
  async ([newTypeId, newPage]) => {
    if (newTypeId || newPage)
      await loadData()
  },
)

/**
 * 获取数据
 */
async function loadData() {
  loading.value = true
  const { page, pageSize } = pagination
  try {
    const body: IQueryDto<IGallery> = {
      pagination: {
        page,
        pageSize,
      },
      order: {
        createdAt: 'DESC',
      },
    }
    if (typeId.value && typeId.value !== 'all')
      body.where = { galleryTypeId: Like(`%${typeId.value}%`) }

    const { data } = await queryGalleryListApi(body)
    galleryList.value = data
  }
  finally {
    loading.value = false
  }
}

onBeforeMount(async () => {
  loading.value = true
  try {
    const res = (await queryGalleryTypeListApi({
      relations: {
        galleries: true,
      },
      select: {
        id: true,
        name: true,
        galleries: {
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
        galleries: res.map(v => v.galleries ?? []).flat(),
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
  <div full flex="~ col gap6 sm:gap8 items-center" pt-6 md:pt-8>
    <ZLoading :value="loading" />

    <div flex="~ gap2 col" sm="justify-center flex-row gap4">
      <ZTabs
        v-if="width > 600"
        v-model="typeId"
        :options="types?.map(v => {
          return {
            label: `${v.name} ${v.galleries?.length}`,
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

    <template v-if="galleryList?.length">
      <div grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6>
        <div
          v-for="item in galleryList" :key="item.id"
          class="group"
          relative rounded-lg overflow-hidden cursor-pointer
          transform transition duration-300 h-100
          hover:shadow-xl
          @click="router.push(`/gallery/detail?id=${item.id}`)"
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
            <div relative z-10 flex="~ col gap-2">
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
      <!-- <ZBtn label="查看更多" /> -->
    </template>
  </div>
</template>
