<script setup lang="ts">
import moment from 'moment'
import type { IGallery } from 'types'

const route = useRoute()

/** 加载中 */
const loading = ref(false)
/** 图库详情 */
const galleryDetail = ref<IGallery>()

onBeforeMount(async () => {
  const { id } = route.query as { id?: string }

  if (!id)
    return

  loading.value = true
  try {
    const res = await getGalleryDetailByIdApi(id)
    galleryDetail.value = res || {}
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <div flex="~ col gap6 sm:gap10" pt-6 md:pt-8>
    <div flex="~ col gap2">
      <h1 v-text="galleryDetail?.name" />
      <div
        subtitle-3 flex="~ items-center gap2"
        style="color: var(--grey-8);"
      >
        <div flex="~ items-center gap1">
          <div i-mingcute:time-line />
          <div
            v-if="galleryDetail?.createdAt"
            v-text="moment.utc(galleryDetail.createdAt).format('YYYY-MM-DD')"
          />
        </div>
        <template v-if="galleryDetail?.pageView">
          <div
            w-1.5 h-1.5 b-rd-10
            style="background-color: var(--grey-8);"
          />
          <div flex="~ items-center gap1">
            <div i-mingcute:eye-2-line />
            <div v-text="galleryDetail.pageView" />
          </div>
        </template>
      </div>
    </div>
    <div
      v-if="galleryDetail?.desc"
      flex="~ justify-center" bg="grey-3 dark:grey-8"
      sm:p-8 p-4 b-rd-2
    >
      <p
        max-w-200 text-left leading-loose
        v-text="galleryDetail.desc"
      />
    </div>

    <div
      v-if="galleryDetail?.picture.length"
      flex="~ col gap4 sm:gap6"
    >
      <div v-for="(item, index) in galleryDetail.picture" :key="index">
        <ZImg :model-value="item" readonly width="100%" height="100%" />
      </div>
    </div>
  </div>
</template>
