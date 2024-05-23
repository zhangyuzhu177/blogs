<script setup lang="ts">
import type { IRole } from 'sust-types'
import { PermissionType } from 'sust-types'
import { hasIntersection } from 'sust-utils'

import { Notify, type QTableColumn, type QTableProps } from 'quasar'
import AdminRoleDialog from './dialog/AdminRole.vue'

const { adminRole } = useUser()
const { getMenu } = useRole()

/** 是否可以编辑（添加、删除） */
const isEdit = computed(() => hasIntersection(
  adminRole.value ?? [],
  [
    PermissionType.ROLE_CREATE,
    PermissionType.ROLE_DELETE,
  ],
))

/** 加载中 */
const loading = ref(false)
/** 管理角色弹窗类型 */
const dialogType = ref()
/** 多选 */
const selected = ref<IRole[]>()
/** 删除角色对话框 */
const deleteDialog = ref(false)
/** 管理角色 */
const role = ref<IRole>()
/** 表格行 */
const rows = ref<QTableProps['rows']>([])
/** 表格列 */
const cols = reactive<QTableColumn<IRole>[]>([
  {
    name: 'name',
    label: '管理角色',
    field: 'name',
  },
  {
    name: 'description',
    label: '描述',
    field: 'description',
  },
  {
    name: 'dataRole',
    label: '角色权限',
    field: row => getMenu(row.permissions?.map(v => v.name)).map(v => v.name).join('、'),
  },
  {
    name: 'info',
    label: '完整信息',
    field: 'id',
  },
])

watch(
  dialogType,
  (newVal) => {
    if (!newVal || newVal === 'add')
      role.value = undefined
  },
)

/**
 * 获取角色列表
 */
async function getRolesList() {
  loading.value = true
  try {
    rows.value = await getRolesApi()
  }
  catch (error) {

  }
  finally {
    loading.value = false
  }
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
    res = await batchDeleteRoleApi(selected.value.map(v => v.id))
    Notify.create({
      type: 'success',
      message: '操作成功',
    })
  }
  finally {
    selected.value = undefined
    if (res)
      getRolesList()
    else
      loading.value = false
  }
}

onBeforeMount(() => {
  if (adminRole.value?.includes(PermissionType.ROLE_UPDATE)) {
    cols.push({
      name: 'action',
      label: '操作',
      field: 'id',
    })
  }
  cols.forEach(v => v.align = 'center')
  getRolesList()
})
</script>

<template>
  <div full flex="~ col gap4" relative>
    <ZLoading :value="loading" />

    <div v-if="isEdit" flex="~ gap4">
      <ZBtn
        v-if="adminRole?.includes(PermissionType.ROLE_CREATE)"
        label="添加角色"
        @click="dialogType = 'add'"
      >
        <template #left>
          <div w5 h5 i-mingcute:add-line />
        </template>
      </ZBtn>
      <ZBtn
        v-if="adminRole?.includes(PermissionType.ROLE_DELETE)"
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

    <ZTable
      v-model:selected="selected"
      :rows="rows"
      :cols="cols"
      :params="{
        noDataLabel: '暂无管理角色记录',
        selection: 'multiple',
      }"
      flex-1 h0
      fixed-first-column
      :fixed-last-column="adminRole?.includes(PermissionType.ROLE_DELETE)"
    >
      <template #body-cell-info="{ row }">
        <q-td text-center>
          <TextBtn
            label="查看完整信息"
            @click="() => {
              dialogType = 'view'
              role = row
            }"
          />
        </q-td>
      </template>
      <template #body-cell-action="{ row }">
        <q-td text-center>
          <ZBtn
            label="编辑"
            size="small"
            @click="() => {
              dialogType = 'edit'
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
      @submit="getRolesList"
    />
  </div>
</template>
