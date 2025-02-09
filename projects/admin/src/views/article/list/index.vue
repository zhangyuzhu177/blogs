<script setup lang="ts">
import moment from 'moment'
import { Like } from 'typeorm'
import { PermissionType } from 'types'
import type { IArticle, IArticleType, IQueryDto } from 'types'
import type { QTableColumn, QTableProps } from 'quasar'

import ZTable from 'shared/components/table/ZTable.vue'
import ArticleDialog from './article.dialog.vue'

const { hasPermission } = useUser()

const zTable = ref<InstanceType<typeof ZTable>>()

/** 是否可添加 */
const isCreate = hasPermission(PermissionType.ARTICLE_PUBLISH)
/** 是否可便捷 */
const isUpdate = hasPermission(PermissionType.ARTICLE_UPDATE)
/** 是否可删除 */
const isDelete = hasPermission(PermissionType.ARTICLE_DELETE)
/** 是否可修改状态 */
const isStatus = hasPermission(PermissionType.ARTICLE_UPDATE_STATUS)

/** 加载中 */
const loading = ref(false)
/** 文章 */
const article = ref<IArticle>()
/** 分类列表 */
const articleTypeList = ref<IArticleType[]>()
/** 对话框操作类型 */
const dialogType = ref<DialogType>()
/** 删除对话框 */
const deleteDialog = ref(false)
/** 文章状态对话框 */
const statusDialog = ref(false)
/** 文章状态 */
const articleStatus = ref(true)
/** 表格列 */
const cols = reactive<QTableColumn<IArticle>[]>([
  {
    name: 'name',
    label: '文章标题',
    field: 'name',
    sortable: true,
  },
  {
    name: 'type',
    label: '文章分类',
    field: row => row.articleType.name,
    sortable: true,
  },
  {
    name: 'tags',
    label: '文章标签',
    field: row => row.tags.join('\n') || undefined,
    sortable: true,
  },
  {
    name: 'pageView',
    label: '文章访问量',
    field: 'pageView',
    sortable: true,
  },
  {
    name: 'createdAt',
    label: '发布时间',
    field: row => moment(row.createdAt).format('YYYY-MM-DD'),
    sortable: true,
  },
  {
    name: 'status',
    label: '文章状态',
    field: 'status',
    sortable: true,
  },
  {
    name: 'info',
    label: '完整信息',
    field: 'id',
  },
])
/** 表格行 */
const rows = ref<IArticle[]>()
/** 表格分页信息 */
const pagination = TABLE_PAGINATION('createdAt')
/** 选中的文章 */
const selected = ref<IArticle[]>()
/** 表格筛选文本 */
const filterText = ref()

/**
 * 查询文章列表
 */
const queryArticleList: QTableProps['onRequest'] = async (props) => {
  const { filter } = props
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  loading.value = true

  try {
    const body: IQueryDto<IArticle> = {
      pagination: {
        page,
        pageSize: rowsPerPage,
      },
      relations: {
        articleType: true,
      },
    }
    if (filter)
      body.where = { name: Like(`%${filter}%`) }
    if (sortBy) {
      const sort = descending ? 'desc' : 'asc'
      body.order = { [sortBy]: sort }
    }
    const { total, data } = await queryArticleListApi(body)
    pagination.value.rowsNumber = total
    rows.value = data
  }
  catch (_) {
    rows.value = undefined
  }
  finally {
    pagination.value.page = page
    pagination.value.rowsPerPage = rowsPerPage
    selected.value = undefined
    loading.value = false
  }
}

/**
 * 回调函数，重新获取文章列表
 */
function callback() {
  zTable.value?.tableRef?.requestServerInteraction()
}

/**
 * 修改文章状态
 */
async function changeArticleStatus() {
  if (!selected.value?.length)
    return

  loading.value = true
  try {
    await changeArticleStatusApi({
      status: articleStatus.value,
      ids: selected.value.map(v => v.id),
    })
    callback()
    Notify.create({
      type: 'success',
      message: '操作成功',
    })
  }
  finally {
    selected.value = undefined
    loading.value = false
  }
}

/**
 * 删除文章
 */
async function deleteArticleStatus() {
  if (!selected.value?.length)
    return

  loading.value = true
  let res

  try {
    res = await deleteArticleApi({
      ids: selected.value.map(v => v.id),
    })
    Notify.create({
      type: 'success',
      message: '操作成功',
    })
  }
  finally {
    selected.value = undefined
    if (res)
      callback()
    else
      loading.value = false
  }
}

onBeforeMount(async () => {
  if (isUpdate) {
    cols.push({
      name: 'action',
      label: '操作',
      field: 'id',
    })
  }
  cols.forEach(col => col.align = 'center')

  articleTypeList.value = (await queryArticleTypeListApi({
    pagination: {
      pageSize: 'all',
    },
  })).data
})
</script>

<template>
  <div full flex="~ col gap4" relative>
    <ZLoading :value="loading" />

    <div flex="~ justify-between">
      <div
        v-if="isCreate && isStatus && isDelete"
        flex="~ wrap" gap="x4"
      >
        <ZBtn
          v-if="isCreate"
          label="添加文章"
          @click="dialogType = '添加'"
        >
          <template #left>
            <div size-5 i-mingcute:add-line />
          </template>
        </ZBtn>
        <ZBtn
          v-if="isStatus"
          label="修改状态"
          text-color="primary-1"
          :disable="!selected?.length"
          :params="{
            outline: true,
          }"
          @click="() => {
            statusDialog = true
            articleStatus = true
          }"
        >
          <template #left>
            <div size-5 i-mingcute:edit-2-line />
          </template>
        </ZBtn>
        <ZBtn
          v-if="isDelete"
          label="删除文章"
          text-color="primary-1"
          :params="{
            outline: true,
          }"
          :disable="!selected?.length"
          @click="deleteDialog = true"
        >
          <template #left>
            <div size-5 i-mingcute:delete-2-line />
          </template>
        </ZBtn>
      </div>
      <ZInput
        v-model="filterText"
        class="rounded"
        placeholder="输入文章标题搜索"
        :debounce="500"
        size="small"
        w70
      >
        <template #prepend>
          <div icon i-mingcute:search-line />
        </template>
      </ZInput>
    </div>

    <ZTable
      ref="zTable"
      v-model:pagination="pagination"
      v-model:selected="selected"
      :cols :rows
      :filter="filterText"
      no-data-label="暂无文章信息"
      selection="multiple"
      flex-1 h0
      fixed-first-column
      :fixed-last-column="isUpdate"
      @request="queryArticleList"
    >
      <!-- 文章状态 -->
      <template #body-cell-status="{ value }">
        <q-td text-center>
          <div
            flex="center gap2"
            text="sm grey-8" font-400
            select-none inline-flex
          >
            <div
              w-2 h-2 rounded-full
              :bg="value ? 'alerts-success' : 'alerts-error' "
            />
            <div v-text="value ? '正常' : '隐藏'" />
          </div>
        </q-td>
      </template>

      <!-- 查看完整信息 -->
      <template #body-cell-info="{ row }">
        <q-td text-center>
          <TextBtn
            label="查看完整信息"
            @click="() => {
              dialogType = '查看'
              article = row
            }"
          />
        </q-td>
      </template>

      <!-- 操作 -->
      <template #body-cell-action="{ row }">
        <q-td gap2 text-center>
          <ZBtn
            v-if="isUpdate"
            label="编辑" size="small" mr-2
            @click="() => {
              dialogType = '编辑'
              article = row
            }"
          />
        </q-td>
      </template>
    </ZTable>

    <!-- 编辑文章 -->
    <ArticleDialog
      v-model:type="dialogType"
      :article :article-type-list
      @callback="callback"
    />

    <!-- 修改文章状态  -->
    <ZDialog
      v-model="statusDialog"
      title="修改账号状态"
      footer
      @ok="changeArticleStatus"
    >
      <div flex="~ gap10">
        <ZRadio
          :model-value="articleStatus.toString()"
          val="true"
          label="正常"
          @update:model-value="articleStatus = true"
        />
        <ZRadio
          :model-value="articleStatus.toString()"
          val="false"
          label="隐藏"
          @update:model-value="articleStatus = false"
        />
      </div>
    </ZDialog>

    <!-- 删除文章 -->
    <ZDialog
      v-model="deleteDialog"
      title="删除文章"
      footer
      @ok="deleteArticleStatus"
    >
      该操作将删除此文章，是否继续？
    </ZDialog>
  </div>
</template>
