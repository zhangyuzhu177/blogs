<script setup lang="ts">
import { cloneDeep } from 'lodash'
import type { IUser } from 'sust-types'
import { PermissionType } from 'sust-types'
import { hasIntersection } from 'sust-utils'
import { Notify, type QTableColumn, type QTableProps } from 'quasar'
import moment from 'moment'
import UserDetails from '../UserDetails.vue'
import BatchAddUser from './BatchAddUser.vue'
import UpsertUserDialog from './UpsertUser.dialog.vue'
import type { Type } from './UpsertUser.dialog.vue'
import ZTable from '~/components/table/ZTable.vue'

const { adminRole } = useUser()
const { byAbsolute } = usePosition()

const zTable = ref<InstanceType<typeof ZTable>>()

/** 加载 */
const loading = ref(false)
/** 修改账号状态对话框 */
const updateAccountStatusDialog = ref(false)
/** 账号状态 */
const accountStatus = ref(false)
/** 清空用户密码弹框 */
const clearUserPasswordDialog = ref(false)
/** 搜索文本 */
const text = ref('')
/** 多选 */
const selected = ref<IUser[]>()
/** 创建/编辑用户弹窗类型 */
const dialogType = ref<Type>()
/** 编辑的用户 */
const dialogUser = ref<IUser>()
/** 表格分页信息 */
const pagination = TABLE_PAGINATION('createdAt', true)

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

/** 添加用户展开菜单 */
const menu = ref(false)

/**
 * 获取用户列表
 */
const getQueryUserList: QTableProps['onRequest'] = async (props) => {
  loading.value = true
  const { filter } = props
  const { page, descending, rowsPerPage, sortBy } = props.pagination
  try {
    const res = await getQueryUserListApi({
      pagination: {
        page,
        pageSize: rowsPerPage,
      },
      filters: filter
        ? [
            {
              field: 'account',
              type: 'LIKE',
              value: filter,
            },
          ]
        : undefined,
      sort: [
        {
          field: sortBy as keyof IUser,
          order: descending ? 'DESC' : 'ASC',
        },
      ],
      relations: {
        role: true,
      },
    })
    pagination.value.rowsNumber = res.total
    rows.value = res.data
  }
  catch (error) {
    rows.value = []
  }
  finally {
    pagination.value.page = page
    pagination.value.sortBy = sortBy
    pagination.value.descending = descending
    pagination.value.rowsPerPage = rowsPerPage
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

/**
 * 清空用户密码
 */
async function clearUserPassword() {
  if (!selected.value?.length)
    return
  loading.value = true
  try {
    const res = await clearUserPasswordApi(selected.value.map(v => v.id))
    if (res) {
      Notify.create({
        type: 'success',
        message: '操作成功',
      })
    }
  }
  catch (error) {}
  finally {
    selected.value = undefined
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
          <ZBtn label="添加用户信息">
            <template #left>
              <div w5 h5 i-mingcute:add-line />
            </template>
            <template #icon>
              <div
                w5 h5 transition i-mingcute:down-line
                :style="{
                  transform: menu ? 'rotate(180deg)' : 'rotate(0deg)',
                }"
              />
            </template>
          </ZBtn>
          <q-menu
            id="add-user-info-menu" v-model="menu"
            class="more-menu" overflow-hidden
            @before-show="byAbsolute('add-user-info-menu', [0, 6])"
          >
            <q-list w40.5>
              <div>
                <div
                  text="xs grey-5" font-500 p="y0.5 x2"
                  v-text="'单个添加'"
                />
                <q-item
                  v-close-popup clickable
                  @click="() => {
                    dialogType = 'add'
                    dialogUser = undefined
                  }"
                >
                  <q-item-section>
                    <div i-mingcute:file-import-line />
                    添加用户
                  </q-item-section>
                </q-item>
              </div>
              <div
                h1px bg-grey-3 my1
                relative right-1
                style="width: calc(100% + 8px);"
              />
              <BatchAddUser v-model:menu="menu" @callback="callback" />
            </q-list>
          </q-menu>
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
        <ZBtn
          v-if="adminRole?.includes(PermissionType.USER_CLEAR_PASSWORD)"
          label="清空用户密码"
          text-color="primary-1"
          :params="{
            outline: true,
          }"
          :disable="!selected?.length"
          @click="clearUserPasswordDialog = true"
        >
          <template #left>
            <div w5 h5 i-mingcute:delete-2-line />
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
        filter: text,
        binaryStateSort: true,
        selection: 'multiple',
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

    <!-- 清空用户密码 -->
    <ZDialog
      v-model="clearUserPasswordDialog"
      footer
      title="清空用户密码"
      @ok="clearUserPassword"
    >
      <div>
        该操作将清空已选账号的密码，是否继续
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

<style  scoped></style>
