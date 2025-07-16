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
const page = ref(1)
/** 总数 */
const total = ref(0)

watch(
  typeId,
  async (newTypeId, oldTypeId) => {
    if (newTypeId !== oldTypeId) {
      page.value = 1
      galleryList.value = []
    }
    if (newTypeId)
      await loadData()
  },
)

watch(
  page,
  async (newPage) => {
    if (newPage === 1)
      return
    if (newPage)
      await loadData()
  },
)

/**
 * 获取数据
 */
async function loadData() {
  loading.value = true
  try {
    const body: IQueryDto<IGallery> = {
      pagination: {
        page: page.value,
        pageSize: 8,
      },
      order: {
        createdAt: 'DESC',
      },
    }
    if (typeId.value && typeId.value !== 'all')
      body.where = { galleryTypeId: Like(`%${typeId.value}%`) }

    body.where = {
      ...body.where,
      status: true,
    }

    const { data, total: t } = await queryGalleryListApi(body)
    galleryList.value = page.value === 1
      ? data
      : [...(galleryList.value ?? []), ...data]
    total.value = t
  }
  finally {
    loading.value = false
  }
}

onBeforeMount(async () => {
  loading.value = true
  try {
    const res = (await queryGalleryTypeListApi({
      where: {
        galleries: {
          status: true,
        },
      },
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

    <div flex="~ gap2 col" sm="justify-center flex-row gap4" w-full>
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
        w-full
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
          @click="router.push(`/gallery/detail?galleryId=${item.id}`)"
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
      <ZBtn
        v-if="page * 8 < total"
        text-color="grey-9" label="加载更多"
        b-rd-2
        :params="{
          outline: true,
        }"
        @click="page++"
      />
    </template>
  </div>
</template>
