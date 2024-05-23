<script setup lang="ts">
import { cloneDeep } from 'lodash'
import moment from 'moment'
import { Notify, type QTableColumn, type QTableProps } from 'quasar'
import type { IRole, IUser } from 'sust-types'

import { PermissionType } from 'sust-types'
import AdminRoleDialog from './dialog/AdminRole.vue'
import type { Type } from './dialog/AdminRole.vue'
import UserDetails from '~/views/user/UserDetails.vue'
import ZTable from '~/components/table/ZTable.vue'

const { adminRole } = useUser()

const zTable = ref<InstanceType<typeof ZTable>>()

/** 加载 */
const loading = ref(false)
/** 表格筛选字段 */
const text = ref('')
/** 表格列 */
const cols = reactive<QTableColumn<IUser>[]>([
  ...cloneDeep(USER_TABLE_COLUMNS),

  {
    name: 'createdAt',
    label: '注册时间',
    field: row => moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    sortable: true,
  },
  {
    name: 'action',
    label: '完整信息',
    field: 'id',
  },
])
/** 表格行 */
const rows = ref<QTableProps['rows']>([])
/** 表格分页信息 */
const pagination = TABLE_PAGINATION('createdAt', true)
/** 多选 */
const selected = ref<IUser[]>()
/** 分配角色对话框 */
const assignDialog = ref(false)
/** 重置对话框 */
const resetDialog = ref(false)
/** 管理角色弹窗类型 */
const dialogType = ref<Type>()
/** 管理角色 */
const role = ref<IRole>()

/** 管理角色列表 */
const roleList = ref<IRole[]>()
/** 当前选中的角色 */
const selectRole = ref<IRole>()

const queryUserList: QTableProps['onRequest'] = async (props) => {
  loading.value = true
  const { filter } = props
  const { descending, page, rowsPerPage, sortBy } = props.pagination

  try {
    const { total, data } = await getQueryUserListApi({
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
        role: {
          permissions: true,
        },
      },
    })
    rows.value = data
    pagination.value.rowsNumber = total
  }
  catch (error) {
    rows.value = []
  }
  finally {
    pagination.value.page = page
    pagination.value.rowsPerPage = rowsPerPage
    pagination.value.sortBy = sortBy
    pagination.value.descending = descending
    loading.value = false
    selected.value = undefined
  }
}

/**
 * 分配管理角色
 */
async function assignRole(id?: string) {
  if (!selected.value?.length)
    return

  loading.value = true
  let res
  try {
    res = await batchUpdateUserRoleApi({
      roleId: id,
      id: selected.value.map(v => v.id),
    })
    Notify.create({
      type: 'success',
      message: '操作成功',
    })
  }
  catch (error) {}
  finally {
    selected.value = undefined
    if (res)
      zTable.value?.tableRef?.requestServerInteraction()
    else
      loading.value = false
  }
}

onBeforeMount(async () => {
  cols.forEach(v => v.align = 'center')
  roleList.value = await getRolesApi()
})
</script>

<template>
  <div full flex="~ col gap4" relative>
    <ZLoading :value="loading" />

    <div flex="~ wrap" gap="x4 y2">
      <div flex="~ wrap" gap="x4 y2" mr-auto>
        <template v-if="adminRole?.includes(PermissionType.USER_UPDATE_ROLE)">
          <ZBtn
            :disable="!selected?.length"
            label="分配角色" @click="assignDialog = true"
          >
            <template #left>
              <div w5 h5 i-mingcute:add-line />
            </template>
          </ZBtn>
          <ZBtn
            label="重置" text-color="primary-1"
            :params="{
              outline: true,
            }"
            :disable="!selected?.length"
            @click="resetDialog = true"
          >
            <template #left>
              <div w5 h5 i-mingcute:refresh-3-line />
            </template>
          </ZBtn>
        </template>
      </div>
      <ZInput
        v-model="text"
        class="rounded"
        placeholder="搜索用户账号"
        :params="{
          debounce: 500,
        }"
        size="medium"
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
      :cols="cols"
      :rows="rows"
      :params="{
        noDataLabel: '暂无用户信息记录',
        filter: text,
        binaryStateSort: true,
        selection: 'multiple',
      }"
      flex-1 h0
      fixed-first-column
      fixed-last-column
      @request="queryUserList"
    >
      <template #body-cell-role="{ row, value }">
        <q-td text-center max-w="none!" class="role-cell">
          <div v-if="!value" text-center v-text="'—'" />
          <div v-else px20 text-center>
            {{ value }}
            <div
              class="show-details"
              text-grey-5 flex="~ items-center gap2"
              absolute-y-center right-4
              cursor-pointer hover:text-primary-1
              invisible select-none
              @click="() => {
                dialogType = 'view'
                role = row.role
              }"
            >
              <div w4 h4 i-mingcute:fullscreen-2-line />
              详情
            </div>
          </div>
        </q-td>
      </template>
      <template #body-cell-action="{ row }">
        <q-td text-center>
          <UserDetails :user="row" />
        </q-td>
      </template>
    </ZTable>

    <AdminRoleDialog v-model:type="dialogType" :role="role" />

    <!-- 分配角色 -->
    <ZDialog
      v-model="assignDialog"
      title="分配角色"
      footer
      :disable-confirm="!selectRole"
      @ok="assignRole(selectRole?.id)"
    >
      <ZSelect
        v-model="selectRole"
        :options="roleList"
        label="角色"
        placeholder="请选择角色"
        required
        :params="{
          optionLabel: 'name',
        }"
      />
    </ZDialog>

    <!-- 重置 -->
    <ZDialog
      v-model="resetDialog"
      title="重置"
      footer
      @ok="assignRole"
    >
      该操作将重置已选用户的管理员角色，是否继续？
    </ZDialog>
  </div>
</template>

<style  scoped lang="scss">
.role-cell:hover {
  .show-details {
    visibility: visible;
  }
}
</style>
