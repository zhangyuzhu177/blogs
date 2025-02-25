<script setup lang="ts">
import { Notify } from 'quasar'
import { objectPick } from 'utils'
import { cloneDeep } from 'lodash'
import type {
  IArticle,
  IArticleTag,
  IArticleType,
  IUpsertArticleBodyDto,
} from 'types'

interface ArticleDialogProps {
  /**
   * 文章对话框的操作类型
   */
  type?: DialogType
  /**
   * 文章信息
   */
  article?: IArticle
  /**
   * 文章分类列表
   */
  articleTypeList?: IArticleType[]
  /**
   * 文章标签列表
   */
  articleTagList?: IArticleTag[]
  /**
   * 在更新、插入后的回调
   */
  onCallback?: () => void
}

const props = defineProps<ArticleDialogProps>()
const emits = defineEmits<{
  /**
   * 更新文章对话框的操作类型
   */
  'update:type': [ArticleDialogProps['type']]
}>()

/** 对话框 */
const dialog = computed({
  get() {
    const { type, article } = props
    return type === '添加' || (!!type && !!article)
  },
  set() {
    emits('update:type', undefined)
  },
})
/** 是否只读 */
const readonly = computed(() => props.type === '查看')

/** 加载中 */
const loading = ref(false)
/** 图片 */
const img = ref<File>()
/** 初始数据 */
const initData: IUpsertArticleBodyDto = {
  name: '',
  articleTypeId: '',
  content: '',
  cover: '',
  status: true,
}
/** 表单 */
const form = ref<IUpsertArticleBodyDto>(cloneDeep(initData))

watch(
  img,
  async (newVal) => {
    loading.value = true
    try {
      if (newVal) {
        const formData = new FormData()
        formData.append('file', newVal as File)
        const res = await uploadFileApi(formData, `/images/page/${newVal.name}`)
        form.value!.cover = res.url
      }
    }
    finally {
      loading.value = false
      img.value = undefined
    }
  },
)

watch(
  () => dialog.value,
  (newVal) => {
    if (newVal) {
      const { type, article } = props
      if (type === '添加') {
        form.value = cloneDeep(initData)
      }
      else if (article) {
        form.value = {
          ...objectPick(
            article,
            'name', 'articleTypeId', 'content',
            'tags', 'cover', 'status',
          ),
        }
      }
    }
  },
)

const disable = computed(() => {
  const { name, articleTypeId, content, cover, tagIds } = form.value
  return !name || !articleTypeId || !content || !cover || !tagIds?.length
})

/**
 * 添加/编辑文章
 */
async function callback() {
  if (disable.value)
    return

  loading.value = true
  const { type, article, onCallback } = props
  try {
    if (type === '添加')
      await createArticleApi(form.value)
    else if (type === '编辑')
      await updateArticleApi(form.value, article!.id)

    Notify.create({
      type: 'success',
      message: `${type}成功`,
    })
    onCallback?.()
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <ZDialog
    v-model="dialog"
    :title="`${type}文章`"
    :footer="!readonly"
    scroll :loading
    :disable-confirm="disable"
    :wrapper-style="{
      width: '100%',
      maxWidth: '80%',
      height: '100%',
      maxHeight: '100%',
    }"
    :params="{
      allowFocusOutside: true,
    }"
    @ok="callback"
  >
    <div flex="~ col gap1">
      <ZInput
        v-model="form.name"
        label="标题"
        required :readonly
        placeholder="输入文章标题"
        :rules="[
          (val: string) => !!val || '文章标题不能为空',
        ]"
      />
      <ZSelect
        v-model="form.articleTypeId"
        label="分类"
        required :readonly
        placeholder="请选择文章分类"
        :options="articleTypeList"
        option-value="id"
        option-label="name"
        mb5
      />

      <div flex="~ col gap2" mb5>
        <ZLabel required label="文章内容" />
        <MdEditor
          v-model="form.content"
          :readonly
        />
      </div>

      <ZSelect
        v-model="form.tagIds"
        label="标签"
        required :readonly multiple
        placeholder="请选择文章标签"
        :options="articleTagList"
        option-value="id"
        option-label="name"
        mb5
      />

      <!-- <div flex="~ col gap2">
        <div flex="~ justify-between">
          <ZLabel
            required
            label="标签"
          />
          <TextBtn
            v-if="!readonly"
            label="添加标签"
            @click="form.tags.push(...(form.tags.length === 0 ? ['', ''] : ['']))"
          />
        </div>
        <div flex="~ col gap1">
          <ZInput
            v-for="(_, index) in (form.tags.length || 1)"
            :key="index"
            v-model="form.tags[index]"
            placeholder="请输入文章标签"
            :readonly
            :rules="[
              val => !!val || '标签不能为空',
            ]"
          >
            <template v-if="!readonly" #append>
              <ZIconBtn
                icon="i-mingcute:close-line"
                @click="() => {
                  if (index < form.tags.length)
                    form.tags.splice(index, 1)
                }"
              />
            </template>
          </ZInput>
        </div>
      </div> -->

      <div flex="~ col gap2" mb5>
        <ZLabel required label="文章封面" />
        <ZUpload
          v-model="img"
          type="image"
          accept="image/*"
          w-50 b-rd-4
        >
          <div
            v-if="!form.cover"
            flex="~ col gap2 center" b-rd-4 full h-30
            border="1px dashed gray-5"
          >
            <div text="6 grey-5" i-ph:plus />
            <div text="grey-5" v-text="'上传封面'" />
          </div>
          <div
            v-else flex="~ col gap2 center" b-rd-4 full
            h-30 overflow-hidden relative
          >
            <img full :src="form.cover">
          </div>
        </ZUpload>
      </div>

      <div flex="~ col gap2" mb5>
        <ZLabel
          label="文章状态"
          w34
        />
        <div flex="~ 1 gap5" right-2>
          <ZRadio
            :model-value="form.status?.toString()"
            val="true"
            label="正常"
            :disable="readonly"
            @update:model-value="form.status = true"
          />
          <ZRadio
            :model-value="form.status?.toString()"
            val="false"
            label="隐藏"
            :disable="readonly"
            @update:model-value="form.status = false"
          />
        </div>
      </div>
    </div>
  </ZDialog>
</template>
