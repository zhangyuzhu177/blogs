<script setup lang="ts">
import moment from 'moment'
import { Like } from 'typeorm'
import { PermissionType } from 'types'
import type { QTableColumn, QTableProps } from 'quasar'
import ZTable from 'shared/components/table/ZTable.vue'
import type { IGallery, IGalleryType, IQueryDto } from 'types'

import GalleryDialog from './gallery.dialog.vue'

const zTable = ref<InstanceType<typeof ZTable>>()

const { hasPermission } = useUser()

/** 是否可添加 */
const isCreate = hasPermission(PermissionType.GALLERY_CREATE)
/** 是否可编辑 */
const isUpdate = hasPermission(PermissionType.GALLERY_UPDATE)
/** 是否可删除 */
const isDelete = hasPermission(PermissionType.GALLERY_DELETE)

/** 加载中 */
const loading = ref(false)
/** 图库 */
const gallery = ref<IGallery>()
/** 图库分类列表 */
const galleryTypeList = ref<IGalleryType[]>()
/** 图库对话框类型 */
const dialogType = ref<DialogType>()
/** 删除对话框 */
const deleteDialog = ref(false)

/** 表格行 */
const rows = ref<IGallery[]>()
/** 表格列 */
const cols: QTableColumn<IGallery>[] = [
  {
    name: 'name',
    label: '图库名称',
    field: 'name',
    sortable: true,
  },
  {
    name: 'galleryTypeId',
    label: '分类',
    field: row => row.galleryType.name,
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
    name: 'pageView',
    label: '访问量',
    field: 'pageView',
    sortable: true,
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
const selected = ref<IGallery[]>()

/**
 * 查询图库列表
 */
const queryQueryGalleryList: QTableProps['onRequest'] = async (props) => {
  const { filter } = props
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  loading.value = true
  try {
    const body: IQueryDto<IGallery> = {
      pagination: {
        page,
        pageSize: rowsPerPage,
      },
      relations: {
        galleryType: true,
      },
    }

    if (filter)
      body.where = { name: Like(`%${filter}%`) }
    if (sortBy) {
      const sort = descending ? 'desc' : 'asc'
      body.order = { [sortBy]: sort }
    }
    const { total, data } = await queryGalleryListApi(body)
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
 * 回调函数，重新获取图库列表
 */
function callback() {
  zTable.value?.tableRef?.requestServerInteraction()
}

/**
 * 删除图库
 */
async function deleteGallery() {
  if (!selected.value?.length)
    return

  loading.value = true
  let res
  try {
    res = await batchDeleteGalleryApi({
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

  loading.value = true
  try {
    galleryTypeList.value = (await queryGalleryTypeListApi({
      pagination: {
        pageSize: 'all',
      },
      order: {
        order: 'asc',
      },
    })).data
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <div flex="~ col gap4" full relative>
    <ZLoading :value="loading" />

    <div flex="~ justify-between">
      <div
        v-if="isCreate && isDelete"
        flex="~ wrap gap4"
      >
        <ZBtn
          v-if="isCreate"
          label="添加图库"
          size="small"
          @click="dialogType = '添加'"
        >
          <template #left>
            <div size-5 i-mingcute:add-line />
          </template>
        </ZBtn>
        <ZBtn
          v-if="isDelete"
          label="删除图库"
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
        placeholder="搜索图库"
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
      fixed-first-col
      :fixed-last-col="isUpdate"
      @request="queryQueryGalleryList"
    >
      <!-- 详情 -->
      <template #body-cell-info="{ row }">
        <q-td text-center>
          <ZTextBtn
            label="查看完整信息"
            @click="() => {
              dialogType = '查看'
              gallery = row
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
              gallery = row
            }"
          />
        </q-td>
      </template>
    </ZTable>

    <!-- 删除对话框 -->
    <ZDialog
      v-model="deleteDialog"
      title="删除分类"
      footer
      @ok="deleteGallery"
    >
      该操作将删除已选的分类，是否继续？
    </ZDialog>

    <!-- 新增、编辑对话框 -->
    <GalleryDialog
      v-model:type="dialogType"
      :gallery :gallery-type-list
      @callback="callback"
    />
  </div>
</template>
