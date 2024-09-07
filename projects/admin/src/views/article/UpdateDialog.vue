<script setup lang="ts">
import { useModel } from 'vue'
import { Notify } from 'quasar'
import { cloneDeep } from 'lodash'
import type { IArticle } from 'shared/types/entities/article.interface'
import type { UpsertArticleBodyDto } from 'shared/types/http/article/upsert-body.dto'
import { ArticleStatus } from 'shared/types/enum/article-status.enum'
import { CLASSIFY, TAGS } from '~/constants/article'

interface Props {
  modelValue: boolean
  article?: IArticle
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'submit'])

const value = useModel(props, 'modelValue')
const loading = ref(false)
const initData: UpsertArticleBodyDto = {
  title: '',
  content: '',
  category: '',
  abstract: '',
  tags: '',
  articleCover: '',
  status: '',
}
const form = ref<UpsertArticleBodyDto>(cloneDeep(initData))

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

watch(
  () => value.value,
  (newVal) => {
    if (newVal && props.article)
      form.value = props.article
  },
)

const disable = computed(() => {
  if (
    form.value.title !== ''
    && form.value.content !== ''
    && form.value.category !== ''
    && form.value.articleCover !== ''
    && form.value.tags !== ''
    && form.value.status !== ''
  )
    return false
  else
    return true
})

async function callback() {
  loading.value = true
  try {
    const res = await upsertArticleApi(form.value)
    if (res) {
      Notify.create({
        type: 'success',
        message: '修改成功',
      })
      emit('submit')
    }
  }
  catch (error) {}
  finally {
    loading.value = false
  }
}
</script>

<template>
  <ZDialog
    v-model="value" title="编辑文章"
    footer scroll
    :disable-confirm="disable"
    :wrapper-style="{
      width: '100%',
      maxWidth: '100%',
      height: '100%',
      maxHeight: '100%',
    }"
    @ok="callback"
  >
    <ZLoading :value="loading" />
    <div flex="~ col gap6">
      <div flex="~ col gap2">
        <ZLabel label="文章标题" />
        <ZInput
          v-model="form.title" flex-1
          placeholder="输入文章标题..."
        />
      </div>
      <div flex="~ col gap2">
        <ZLabel label="摘要" />
        <ZInput
          v-model="form.abstract"
          placeholder="请输入文章摘要"
          type="textarea"
          :params="{
            counter: true,
            maxlength: '1000',
          }"
          flex-1
        />
      </div>
      <div flex="~ col gap2">
        <ZLabel label="分类" />
        <div flex="~ gap-4 wrap">
          <Tag1
            v-for="i in CLASSIFY" :key="i.id"
            :tag="i" :active="form.category"
            w-30
            @click="form.category = i.label"
          />
        </div>
      </div>
      <div flex="~ col gap2">
        <ZLabel label="文章标签" />
        <ZSelect
          v-model="form.tags"
          class="select"
          :options="TAGS"
          placeholder="请选择文章标签"
          required
          :params="{
            optionLabel: 'name',
          }"
        />
      </div>
      <div flex="~ col gap2" px-1>
        <ZLabel label="文章内容" />
        <MdEditor v-model="form.content" />
      </div>
      <div flex="~ col gap2">
        <ZLabel label="文章图片" />
        <ZUpload
          v-model="img"
          type="image"
          accept="image/*"
          w-50 b-rd-4
        >
          <div
            v-if="!form.articleCover"
            flex="~ col gap2 center" b-rd-4 full h-30
            border="1px dashed gray-5"
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
        <ZLabel label="发布方式" />
        <div flex="~ gap-4 wrap">
          <ZRadio
            :model-value="form.status"
            :val="ArticleStatus.PUBLIC"
            label="公开"
            @update:model-value="form.status = ArticleStatus.PUBLIC"
          />
          <ZRadio
            :model-value="form.status"
            :val="ArticleStatus.DRAFT"
            label="草稿"
            @update:model-value="form.status = ArticleStatus.DRAFT"
          />
        </div>
      </div>
    </div>
  </ZDialog>
</template>
