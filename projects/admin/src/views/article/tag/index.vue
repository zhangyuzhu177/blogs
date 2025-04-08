<script setup lang="ts">
import moment from 'moment'
import { Like } from 'typeorm'
import { PermissionType } from 'types'
import type { IArticleTag, IQueryDto } from 'types'
import type { QTableColumn, QTableProps } from 'quasar'
import ZTable from 'shared/components/table/ZTable.vue'

import ArticleTagDialog from './articleTag.dialog.vue'

const zTable = ref<InstanceType<typeof ZTable>>()

const { hasPermission } = useUser()

/** 是否可添加 */
const isCreate = hasPermission(PermissionType.ARTICLE_TAG_CREATE)
/** 是否可编辑 */
const isUpdate = hasPermission(PermissionType.ARTICLE_TAG_UPDATE)
/** 是否可删除 */
const isDelete = hasPermission(PermissionType.ARTICLE_TAG_DELETE)

/** 加载中 */
const loading = ref(false)
/** 文章标签 */
const articleTag = ref<IArticleTag>()
/** 文章分类对话框类型 */
const dialogType = ref<DialogType>()
/** 删除对话框  */
const deleteDialog = ref(false)

/** 表格行 */
const rows = ref<IArticleTag[]>()
/** 表格列 */
const cols: QTableColumn<IArticleTag>[] = [
  {
    name: 'name',
    label: '标签名称',
    field: 'name',
    sortable: true,
  },
  {
    name: 'desc',
    label: '描述',
    field: 'desc',
    sortable: true,
  },
  {
    name: 'createdAt',
    label: '创建时间',
    field: row => moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    sortable: true,
  },
  {
    name: 'count',
    label: '文章数量',
    field: row => `${row.articles?.length} 篇`,
  },
  {
    name: 'info',
    label: '完整信息',
    field: 'id',
  },
]
/** 表格分页信息 */
const pagination = TABLE_PAGINATION('createdAt', true)
/** 表格筛选文本 */
const filterText = ref()
/** 多选 */
const selected = ref<IArticleTag[]>()

/**
 * 查询文章分类列表
 */
const queryQueryArticleTagList: QTableProps['onRequest'] = async (props) => {
  const { filter } = props
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  loading.value = true
  try {
    const body: IQueryDto<IArticleTag> = {
      pagination: {
        page,
        pageSize: rowsPerPage,
      },
      relations: {
        articles: true,
      },
    }
    if (filter)
      body.where = { name: Like(`%${filter}%`) }
    if (sortBy) {
      const sort = descending ? 'desc' : 'asc'
      body.order = { [sortBy]: sort }
    }
    const { total, data } = await queryArticleTagListApi(body)
    pagination.value.rowsNumber = total
    rows.value = data
  }
  catch (_) {
    rows.value = undefined
  }
  finally {
    pagination.value = {
      ...props.pagination,
      rowsNumber: pagination.value.rowsNumber,
    }
    selected.value = undefined
    loading.value = false
  }
}

/**
 * 回调函数，重新获取文章标签列表
 */
function callback() {
  zTable.value?.tableRef?.requestServerInteraction()
}

/**
 * 删除分类
 */
async function deleteArticleTag() {
  if (!selected.value?.length)
    return

  loading.value = true
  let res
  try {
    res = await deleteArticleTagApi({
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
  cols.forEach(v => v.align = 'center')
})
</script>

<template>
  <div flex="~ col gap4" full relative>
    <ZLoading :value="loading" />

    <div flex="~ justify-between gap4">
      <div
        v-if="isCreate && isDelete"
        flex="~ wrap gap4"
      >
        <ZBtn
          v-if="isCreate"
          label="添加标签"
          size="small"
          @click="dialogType = '添加'"
        >
          <template #left>
            <div size-5 i-mingcute:add-line />
          </template>
        </ZBtn>
        <ZBtn
          v-if="isDelete"
          label="删除标签"
          size="small"
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
        placeholder="搜索文章标签"
        size="small"
        :debounce="500"
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
      :rows :cols
      :filter="filterText"
      no-data-label="暂无分类记录"
      selection="multiple"
      flex-1 h-0
      fixed-first-column
      :fixed-last-column="isUpdate"
      @request="queryQueryArticleTagList"
    >
      <!-- 详情 -->
      <template #body-cell-info="{ row }">
        <q-td text-center>
          <ZTextBtn
            label="查看完整信息"
            @click="() => {
              dialogType = '查看'
              articleTag = row
            }"
          />
        </q-td>
      </template>

      <!-- 操作 -->
      <template #body-cell-action="{ row }">
        <q-td text-center>
          <ZBtn
            v-if="isUpdate"
            label="编辑"
            size="small"
            @click="() => {
              dialogType = '编辑'
              articleTag = row
            }"
          />
        </q-td>
      </template>
    </ZTable>

    <!-- 删除对话框 -->
    <ZDialog
      v-model="deleteDialog"
      title="删除标签"
      footer
      @ok="deleteArticleTag"
    >
      该操作将删除已选的标签，是否继续？
    </ZDialog>

    <!-- 文章标签对话框 -->
    <ArticleTagDialog
      v-model:type="dialogType"
      :article-tag
      @callback="callback"
    />
  </div>
</template>
