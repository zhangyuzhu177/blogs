<script setup lang="ts">
import moment from 'moment'
import { Like } from 'typeorm'
import { Notify } from 'quasar'
import { cloneDeep } from 'lodash'
import { PermissionType } from 'types'
import type { IQueryDto, IRole, IUser } from 'types'
import type { QTableColumn, QTableProps } from 'quasar'

import ZTable from 'shared/components/table/ZTable.vue'
import ZSelect from 'shared/components/select/ZSelect.vue'
import UpsertUserDialog from './UpsertUser.dialog.vue'

const { hasPermission } = useUser()

const zTable = ref<InstanceType<typeof ZTable>>()

/** 是否可创建 */
const isCreate = hasPermission(PermissionType.USER_CREATE)
/** 是否可编辑 */
const isUpdate = hasPermission(PermissionType.USER_UPDATE)
/** 是否可修改状态 */
const isStatus = hasPermission(PermissionType.USER_CHANGE_STATUS)
/** 是否可分配角色 */
const isAssignRole = hasPermission(PermissionType.USER_UPDATE_ROLE)

/** 加载 */
const loading = ref(false)
/** 修改账号状态对话框 */
const changeStatusDialog = ref(false)
/** 账号状态 */
const accountStatus = ref(true)
/** 创建/编辑用户弹窗类型 */
const dialogType = ref<DialogType>()
/** 编辑的用户 */
const user = ref<IUser>()
/** 角色列表 */
const roles = ref<IRole[]>()
/** 选中角色 */
const roleId = ref()
/** 分配角色对话框 */
const assignRoleDialog = ref(false)

/** 表格行 */
const rows = ref<IUser[]>()
const cols = reactive<QTableColumn<IUser>[]>([
  ...cloneDeep(USER_TABLE_COLUMNS),
  {
    name: 'createdAt',
    label: '注册时间',
    field: row => moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    sortable: true,
  },
  {
    name: 'status',
    label: '账号状态',
    field: 'status',
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
/** 多选 */
const selected = ref<IUser[]>()

/**
 * 获取用户列表
 */
const queryQueryUserList: QTableProps['onRequest'] = async (props) => {
  const { filter } = props
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  loading.value = true

  try {
    const body: IQueryDto<IUser> = {
      pagination: {
        page,
        pageSize: rowsPerPage,
      },
      relations: {
        role: true,
      },
    }
    if (filter)
      body.where = { account: Like(`%${filter}%`) }
    if (sortBy) {
      const sort = descending ? 'desc' : 'asc'
      if (sortBy === 'role')
        body.order = { role: { name: sort } }
      else
        body.order = { [sortBy]: sort }
    }
    const { total, data } = await queryUserListApi(body)
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
 * 回调函数，重新获取用户列表
 */
function callback() {
  zTable.value?.tableRef?.requestServerInteraction()
}

/**
 * 修改账号状态
 */
async function updateAccountStatus() {
  if (!selected.value?.length)
    return

  loading.value = true
  try {
    await changeUserStatusApi({
      status: accountStatus.value,
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
 * 分配管理角色
 */
async function assignRole() {
  if (!selected.value?.length || !roleId.value)
    return

  loading.value = true

  try {
    await updateUserRoleApi({
      roleId: roleId.value,
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

onBeforeMount(async () => {
  if (isUpdate) {
    cols.push({
      name: 'action',
      label: '操作',
      field: 'id',
    })
  }
  cols.forEach(v => v.align = 'center')

  roles.value = (await queryRolesApi({
    pagination: {
      pageSize: 'all',
    },
  })).data
})

provide('callback', callback)
</script>

<template>
  <div full flex="~ col gap-4" relative>
    <ZLoading :value="loading" />

    <div flex justify-between gap="4">
      <div
        v-if="isCreate && isStatus && isAssignRole"
        flex="~ wrap" gap="x4" mr-auto
      >
        <ZBtn
          v-if="isCreate"
          label="添加用户"
          size="small"
          @click="dialogType = '添加'"
        >
          <template #left>
            <div size-5 i-mingcute:add-line />
          </template>
        </ZBtn>
        <ZBtn
          v-if="isStatus"
          label="修改状态"
          size="small"
          text-color="primary-1"
          :disable="!selected?.length"
          :params="{
            outline: true,
          }"
          @click="() => {
            changeStatusDialog = true
            accountStatus = true
          }"
        >
          <template #left>
            <div size-5 i-mingcute:edit-2-line />
          </template>
        </ZBtn>
        <ZBtn
          v-if="isAssignRole"
          label="分配管理角色"
          size="small"
          text-color="primary-1"
          :disable="!selected?.length"
          :params="{
            outline: true,
          }"
          @click="() => {
            roleId = undefined
            assignRoleDialog = true
          }"
        >
          <template #left>
            <div size-5 i-mingcute:git-merge-line />
          </template>
        </ZBtn>
      </div>
      <ZInput
        v-model="filterText"
        class="rounded"
        placeholder="搜索用户账号"
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
      no-data-label="暂无用户信息记录"
      selection="multiple"
      flex-1 h-0
      fixed-first-column
      :fixed-last-column="isUpdate"
      @request="queryQueryUserList"
    >
      <!-- 账号状态 -->
      <template #body-cell-status="{ value }">
        <q-td text-center>
          <AccountStatus :disable="value" />
        </q-td>
      </template>

      <!-- 用户详情 -->
      <template #body-cell-info="{ row }">
        <q-td text-center>
          <ZTextBtn
            label="查看完整信息"
            @click="() => {
              dialogType = '查看'
              user = row
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
              user = row
            }"
          />
        </q-td>
      </template>
    </ZTable>

    <!-- 修改用户状态  -->
    <ZDialog
      v-model="changeStatusDialog"
      title="修改账号状态"
      footer
      @ok="updateAccountStatus"
    >
      <div flex="~ gap10">
        <ZRadio
          :model-value="accountStatus.toString()"
          val="true"
          label="启用"
          @update:model-value="accountStatus = true"
        />
        <ZRadio
          :model-value="accountStatus.toString()"
          val="false"
          label="禁用"
          @update:model-value="accountStatus = false"
        />
      </div>
    </ZDialog>

    <!-- 分配管理角色 -->
    <ZDialog
      v-model="assignRoleDialog"
      title="分配管理角色"
      :disable-confirm="!roleId"
      footer
      @ok="assignRole"
    >
      <ZSelect
        v-model="roleId"
        label="管理角色"
        placeholder="请选择管理角色"
        :options="roles"
        option-value="id"
        option-label="name"
      />
    </ZDialog>

    <!-- 添加/编辑用户信息 -->
    <UpsertUserDialog
      v-model:type="dialogType"
      :user
      @callback="callback"
    />
  </div>
</template>
