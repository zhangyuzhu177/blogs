<script setup lang="ts">
import { cloneDeep } from 'lodash'
import type { UpsertArticleBodyDto } from 'shared/types/http/article/upsert-body.dto'

const { userInfo } = useUser()

const loading = ref(false)
const dialog = ref(false)
const initData: UpsertArticleBodyDto = {
  author: userInfo.value?.account as string,
  title: '',
  content: '',
  category: '',
  tags: '',
  articleCover: '',
  type: '',
  originalUrl: '',
  status: '',
}
const form = ref<UpsertArticleBodyDto>(cloneDeep(initData))
const isShow = ref(false)

watch(() => form.value.type, (newVal) => {
  if (newVal === '转载')
    isShow.value = true
  else
    isShow.value = false
})

const disable = computed(() => {
  if (
    form.value.title !== ''
    && form.value.author !== ''
    && form.value.content !== ''
    && form.value.category !== ''
    && form.value.articleCover !== ''
    && form.value.tags !== ''
    && form.value.status !== ''
  ) {
    if (form.value.type === '转载' && form.value.originalUrl !== '')
      return false

    else if (form.value.type === '原创')
      return false

    else
      return true
  }
  else {
    return true
  }
})

const img = ref<File>()
watch(img, async (newVal) => {
  loading.value = true
  try {
    if (newVal) {
      const formData = new FormData()
      formData.append('file', newVal as File)
      const res = await uploadFileApi(formData, `/images/page/${newVal.name}`)
      form.value!.articleCover = res.url
    }
  }
  catch (e) {}
  finally {
    loading.value = false
    img.value = undefined
  }
})

function init() {
  form.value = cloneDeep(initData)
}

watch(
  dialog,
  (newVal) => {
    if (newVal) {
      form.value.category = ''
      form.value.articleCover = ''
      form.value.originalUrl = ''
      form.value.type = ''
      form.value.tags = ''
      form.value.status = ''
    }
  },
)

async function callback() {
  loading.value = true
  try {
    const res = await upsertArticleApi(form.value)
    if (res) {
      Notify.create({
        type: 'success',
        message: '发布成功',
      })
      init()
    }
  }
  catch (error) {}
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div full flex="~ col gap-4">
    <ZLoading :value="loading" />
    <div flex gap6 justify-between>
      <ZInput
        v-model="form.title" flex-1
        placeholder="输入文章标题..."
      />
      <ZBtn @click="dialog = true">
        <div i-ph:navigation-arrow-bold />
        发布博客
      </ZBtn>
    </div>
    <!-- 文章内容 -->
    <v-md-editor v-model="form.content" height="100%" />

    <!-- 发布文章   -->
    <ZDialog
      v-model="dialog" title="发布文章"
      footer scroll
      :disable-confirm="disable"
      :wrapper-style="{
        width: '8.75rem',
        maxWidth: '8.75rem',
      }"
      @ok="callback"
    >
      <div flex="~ col gap6">
        <div flex="~ col gap2">
          分类
          <div flex="~ gap-4 wrap">
            <Tag1
              v-for="i in CLASSIFY" :key="i.id" w-30
              :tag="i" :active="form.category" @click="form.category = i.label"
            />
          </div>
        </div>
        <div flex="~ col gap2">
          文章标签
          <ZSelect
            v-model="form.tags"
            class="select"
            :options="TAGS"
            placeholder="请选择文章标签"
            required
            :params="{
              optionLabel: 'name',
            }" w-80
          />
        </div>
        <div flex="~ col gap2">
          文章封面
          <ZUpload
            v-model="img"
            type="image"
            accept="image/*"
            w-50 b-rd-4
          >
            <div
              v-if="!form.articleCover" flex="~ col gap2 center" b-rd-4 full h-30
              border=".0125rem dashed gray-5"
            >
              <div text="6 grey-5" i-ph:plus />
              <div text="grey-5">
                上传封面
              </div>
            </div>
            <div
              v-else flex="~ col gap2 center" b-rd-4 full
              h-30 overflow-hidden relative
            >
              <img full :src="form.articleCover">
            </div>
          </ZUpload>
        </div>
        <div flex="~ col gap2">
          文章类型
          <div flex="~ gap-4 wrap">
            <Tag1
              v-for="i in ARTICLE_CLASS" :key="i.id" w-30
              :tag="i" :active="form.type"
              @click="form.type = i.label"
            />
          </div>
        </div>
        <div v-if="isShow" flex="~ col gap2">
          转载连接
          <ZInput v-model="form.originalUrl" flex-1 />
        </div>
        <div flex="~ col gap2">
          发布方式
          <div flex="~ gap-4 wrap">
            <Tag1
              v-for="i in BT" :key="i.id" w-30
              :tag="i" :active="form.status"
              @click="form.status = i.label"
            />
          </div>
        </div>
      </div>
    </ZDialog>
  </div>
</template>

<style lang="scss">

</style>
