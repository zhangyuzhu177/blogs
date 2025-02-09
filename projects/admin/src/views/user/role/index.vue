<script setup lang="ts">
import { Like } from 'typeorm'
import { Notify } from 'quasar'
import { PermissionType } from 'types'
import type { QTableColumn, QTableProps } from 'quasar'
import type { IQueryDto, IRole } from 'types'

import ZTable from 'shared/components/table/ZTable.vue'

import moment from 'moment'
import AdminRoleDialog from './dialog/AdminRole.vue'

const zTable = ref<InstanceType<typeof ZTable>>()

const { hasPermission } = useUser()
const { getMenu } = useRole()

/** 是否可创建 */
const isCreate = hasPermission(PermissionType.ROLE_CREATE)
/** 是否可编辑 */
const isUpdate = hasPermission(PermissionType.ROLE_UPDATE)
/** 是否可删除 */
const isDelete = hasPermission(PermissionType.ROLE_DELETE)

/** 加载中 */
const loading = ref(false)
/** 管理角色弹窗类型 */
const dialogType = ref<DialogType>()
/** 多选 */
const selected = ref<IRole[]>()
/** 删除角色对话框 */
const deleteDialog = ref(false)
/** 管理角色 */
const role = ref<IRole>()
/** 表格行 */
const rows = ref<IRole[]>()
/** 表格列 */
const cols = reactive<QTableColumn<IRole>[]>([
  {
    name: 'name',
    label: '管理角色',
    field: 'name',
  },
  {
    name: 'desc',
    label: '描述',
    field: 'desc',
  },
  {
    name: 'dataRole',
    label: '角色权限',
    field: row => getMenu(row.permissions?.map(v => v.name)).map(v => v.name).join('、'),
  },
  {
    name: 'createdAt',
    label: '创建时间',
    field: row => moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    sortable: true,
  },
  {
    name: 'info',
    label: '完整信息',
    field: 'id',
  },
])
/** 表格分页信息 */
const pagination = TABLE_PAGINATION('createdAt')
/** 表格筛选文本 */
const filterText = ref()

watch(
  dialogType,
  (newVal) => {
    if (!newVal || newVal === '添加')
      role.value = undefined
  },
)

/**
 * 查询管理员角色
 */
const queryRoleList: QTableProps['onRequest'] = async (props) => {
  const { filter } = props
  const { page, rowsPerPage } = props.pagination
  loading.value = true

  try {
    const body: IQueryDto<IRole> = {
      pagination: {
        page,
        pageSize: rowsPerPage,
      },
      relations: {
        permissions: true,
      },
    }
    if (filter)
      body.where = { name: Like(`%${filter}%`) }
    const { total, data } = await queryRolesApi(body)
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
 * 回调函数，重新查询管理员角色
 */
function callback() {
  zTable.value?.tableRef?.requestServerInteraction()
}

/**
 * 删除管理角色
 */
async function deleteRole() {
  if (!selected.value?.length)
    return

  loading.value = true
  let res
  try {
    res = await deleteRoleApi({
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

onBeforeMount(() => {
  if (isUpdate) {
    cols.push({
      name: 'action',
      label: '操作',
      field: 'id',
    })
  }
  cols.forEach(v => v.align = 'center')
  callback()
})
</script>

<template>
  <div full flex="~ col gap4" relative>
    <ZLoading :value="loading" />

    <div flex="~ justify-between">
      <div
        v-if="isCreate && isDelete"
        flex="~ wrap" gap="4"
      >
        <ZBtn
          v-if="isCreate"
          label="添加角色"
          @click="dialogType = '添加'"
        >
          <template #left>
            <div w5 h5 i-mingcute:add-line />
          </template>
        </ZBtn>
        <ZBtn
          v-if="isDelete"
          label="删除角色"
          text-color="primary-1"
          :params="{
            outline: true,
          }"
          :disable="!selected?.length"
          @click="deleteDialog = true"
        >
          <template #left>
            <div w5 h5 i-mingcute:delete-2-line />
          </template>
        </ZBtn>
      </div>
      <div flex="~ gap2" justify-end>
        <ZInput
          v-model="filterText"
          class="rounded"
          placeholder="搜索管理员角色"
          size="small"
          :debounce="500"
          w70
        >
          <template #prepend>
            <div icon i-mingcute:search-line />
          </template>
        </ZInput>
      </div>
    </div>

    <ZTable
      ref="zTable"
      v-model:pagination="pagination"
      v-model:selected="selected"
      :rows="rows"
      :cols="cols"
      :filter="filterText"
      no-data-label="暂无管理角色记录"
      selection="multiple"
      flex-1 h0
      fixed-first-column
      :fixed-last-column="isUpdate"
      @request="queryRoleList"
    >
      <template #body-cell-info="{ row }">
        <q-td text-center>
          <TextBtn
            label="查看完整信息"
            @click="() => {
              dialogType = '查看'
              role = row
            }"
          />
        </q-td>
      </template>

      <template #body-cell-action="{ row }">
        <q-td text-center>
          <ZBtn
            v-if="isUpdate"
            label="编辑"
            size="small"
            @click="() => {
              dialogType = '编辑'
              role = row
            }"
          />
        </q-td>
      </template>
    </ZTable>

    <!-- 删除角色 -->
    <ZDialog
      v-model="deleteDialog"
      title="删除角色"
      footer
      @ok="deleteRole"
    >
      该操作将删除已选的管理角色，是否继续？
    </ZDialog>

    <!-- 添加、编辑管理角色 -->
    <AdminRoleDialog
      v-model:type="dialogType"
      :role="role"
      @callback="callback"
    />
  </div>
</template>
