import type { QTableColumn, QTableProps } from 'quasar'
import type { IUser } from 'types'

/**
 * 返回表格分页配置
 */
export function TABLE_PAGINATION(sortBy?: string, descending?: boolean) {
  return ref<Exclude<QTableProps['pagination'], undefined>>({
    page: 1,
    rowsPerPage: 20,
    rowsNumber: 0,
    sortBy,
    descending,
  })
}

/**
 * 用户表格基础字段
 */
export const USER_TABLE_COLUMNS: QTableColumn<IUser>[] = [
  {
    name: 'account',
    label: '用户',
    field: 'account',
    sortable: true,
  },
  {
    name: 'email',
    label: '邮箱',
    field: row => row.email ? row.email : '—',
    sortable: true,
  },
  {
    name: 'role',
    label: '管理员角色',
    field: row => row.role?.name,
  },
]
