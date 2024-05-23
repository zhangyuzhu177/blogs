import type { QTableColumn, QTableProps } from 'quasar'
import { IUser } from 'shared/types/entities/user.interface'

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
  },
  {
    name: 'email',
    label: '邮箱',
    field: row => row.email ? row.email : '—',
  },
  {
    name: 'role',
    label: '管理员角色',
    field: row => row.role?.name,
  },
]
