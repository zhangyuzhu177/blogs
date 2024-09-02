<script setup lang="ts">
import moment from 'moment'
import { cloneDeep } from 'lodash'
import { Notify, type QTableColumn, type QTableProps } from 'quasar'
import type { IUser } from 'shared/types/entities/user.interface'
import { PermissionType } from 'shared/types/enum/permission.enum'
import { hasIntersection } from 'shared/utils/common/isIntersect'

import UserDetails from '../UserDetails.vue'
import UpsertUserDialog from './UpsertUser.dialog.vue'
import type { Type } from './UpsertUser.dialog.vue'
import ZTable from '~/components/table/ZTable.vue'

const { adminRole } = useUser()

const zTable = ref<InstanceType<typeof ZTable>>()

/** 加载 */
const loading = ref(false)
/** 修改账号状态对话框 */
const updateAccountStatusDialog = ref(false)
/** 账号状态 */
const accountStatus = ref(false)
/** 搜索文本 */
const text = ref('')
/** 多选 */
const selected = ref<IUser[]>()
/** 创建/编辑用户弹窗类型 */
const dialogType = ref<Type>()
/** 编辑的用户 */
const dialogUser = ref<IUser>()
/** 表格分页信息 */
const pagination = {
  rowsPerPage: 0,
}

/** 表格行 */
const rows = ref<QTableProps['rows']>([])
const cols = reactive<QTableColumn<IUser>[]>([
  ...cloneDeep(USER_TABLE_COLUMNS),
  {
    name: 'createdAt',
    label: '注册时间',
    field: row => moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    sortable: true,
  },
  {
    name: 'isDeleted',
    label: '账号状态',
    field: 'isDeleted',
    sortable: true,
  },
  {
    name: 'info',
    label: '完整信息',
    field: 'id',
  },
])

/**
 * 获取用户列表
 */
const getQueryUserList: QTableProps['onRequest'] = async () => {
  loading.value = true
  try {
    const data = await getUserListApi()
    rows.value = data
  }
  catch (error) {
    rows.value = []
  }
  finally {
    loading.value = false
    selected.value = undefined
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
  let res
  try {
    if (accountStatus.value)
      res = await deleteUserApi(selected.value.map(v => v.id))
    else
      res = await recoverUserApi(selected.value.map(v => v.id))
    Notify.create({
      type: 'success',
      message: '操作成功',
    })
  }
  catch (error) { }
  finally {
    selected.value = undefined
    if (res)
      callback()
    loading.value = false
  }
}

onBeforeMount(() => {
  if (adminRole.value?.includes(PermissionType.USER_UPDATE)) {
    cols.push({
      name: 'action',
      label: '操作',
      field: 'id',
    })
  }
  cols.forEach(v => v.align = 'center')
})
provide('callback', callback)
</script>

<template>
  <div full flex="~ col gap-4">
    <ZLoading :value="loading" />
    <div flex justify-between gap="x4 y2">
      <div flex="~ wrap" gap="x4 y2" mr-auto>
        <div v-if="adminRole?.includes(PermissionType.USER_CREATE)">
          <ZBtn
            @click="() => {
              dialogType = 'add'
              dialogUser = undefined
            }"
          >
            <div i-ph:plus-bold />
            添加用户
          </ZBtn>
        </div>
        <ZBtn
          v-if="hasIntersection(
            adminRole ?? [],
            [
              PermissionType.USER_UPDATE,
              PermissionType.USER_DELETE,
            ],
          )"
          label="修改账号状态"
          text-color="primary-1"
          :disable="!selected?.length"
          :params="{
            outline: true,
          }"
          @click="() => {
            updateAccountStatusDialog = true
            accountStatus = false
          }"
        >
          <template #left>
            <div w5 h5 i-mingcute:edit-2-line />
          </template>
        </ZBtn>
      </div>
      <ZInput
        v-model="text"
        class="rounded"
        placeholder="搜索用户账号"
        size="medium"
        :params="{
          debounce: 500,
        }"
        w80
      >
        <template #prepend>
          <div w5 h5 i-mingcute:search-line />
        </template>
      </ZInput>
    </div>

    <ZTable
      ref="zTable"
      v-model:pagination="pagination"
      v-model:selected="selected"
      :rows="rows"
      :cols="cols"
      :params="{
        noDataLabel: '暂无用户信息记录',
        selection: 'multiple',
        binaryStateSort: true,
        hideBottom: rows.length ? true : false,
      }"
      flex-1 h-0
      fixed-first-column
      fixed-last-column
      @request="getQueryUserList"
    >
      <template #body-cell-isDeleted="{ value }">
        <q-td text-center>
          <AccountStatus :disable="value" />
        </q-td>
      </template>
      <template #body-cell-info="{ row }">
        <q-td text-center>
          <UserDetails :user="row" />
        </q-td>
      </template>
      <template #body-cell-action="{ row }">
        <q-td text-center>
          <ZBtn
            label="编辑"
            size="small"
            @click="() => {
              dialogType = 'edit'
              dialogUser = row
            }"
          />
        </q-td>
      </template>
    </ZTable>

    <!-- 修改用户状态  -->
    <ZDialog
      v-model="updateAccountStatusDialog"
      title="修改账号状态"
      footer
      @ok="updateAccountStatus"
    >
      <div flex="~ gap10">
        <ZRadio
          :model-value="accountStatus.toString()"
          val="false"
          label="启用"
          @update:model-value="accountStatus = false"
        />
        <ZRadio
          :model-value="accountStatus.toString()"
          val="true"
          label="禁用"
          @update:model-value="accountStatus = true"
        />
      </div>
    </ZDialog>

    <!-- 添加/编辑用户信息 -->
    <UpsertUserDialog
      v-model:type="dialogType"
      :user="dialogUser"
      @loading="(val: boolean) => loading = val"
      @callback="callback"
    />
  </div>
</template>
