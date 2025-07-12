<script setup lang="ts">
import moment from 'moment'
import { type ICreateLikeBodyDto, type IGallery, type IGetLinkBodyDto, type ILikes, LikesType } from 'types'

const route = useRoute()
const { visitorId } = useVisitor()

/** 加载中 */
const loading = ref(false)
/** 图库详情 */
const galleryDetail = ref<IGallery>()
/** 图库id */
const galleryId = ref()
/** 点赞记录 */
const likes = ref<ILikes[]>()

/** 是否点赞 */
const liked = computed({
  get() {
    return likes.value?.some(v => v.visitorId === visitorId.value) ?? false
  },
  set() {
  },
})

/**
 * 点赞
 */
async function thumbsUp() {
  if (liked.value)
    return
  const body: ICreateLikeBodyDto = {
    contentId: galleryId.value,
    visitorId: visitorId.value,
  }
  try {
    await likeGalleryApi(body)
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
      contentId: galleryId.value,
      type: LikesType.GALLERY,
    }
    const [galleryRes, likesRes] = await Promise.all([
      getGalleryDetailByIdApi(galleryId.value as string),
      getLinkApi(body),
    ])
    galleryDetail.value = galleryRes || {}
    likes.value = likesRes || []
  }
  finally {
    loading.value = false
  }
}

onBeforeMount(async () => {
  const { id } = route.query as { id?: string }

  if (!id)
    return

  galleryId.value = id
  loadData()
})
</script>

<template>
  <div flex="~ col gap8 sm:gap10" pt-6 md:pt-8>
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
      flex="~ col gap6" pb-10 sm:pb-16
    >
      <div v-for="(item, index) in galleryDetail.picture" :key="index">
        <ZImg
          :model-value="item"
          readonly width="100%" height="100%" gap6
        />
      </div>
    </div>
    <ThumbsUp
      v-if="galleryDetail"
      v-model:liked="liked"
      :count="likes?.length"
      @callback="thumbsUp"
    />
  </div>
</template>
