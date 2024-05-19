import { Role } from 'src/entities/role'
import type { PermissionType } from './permission.enum'
import { permissionDescriptions } from './permission.enum'
import { Permission } from 'src/entities/permission'

const allPermissionNames = Object.keys(permissionDescriptions) as PermissionType[]

function getPermission(name: PermissionType): Permission {
  return {
    name,
    description: permissionDescriptions[name],
  }
}

/**
 * 默认的管理角色信息
 */
export const defaultRoles: Role[] = [
  {
    id: 'root',
    name: 'root',
    description: '拥有管理后台全部功能的管理角色',
    permissions: allPermissionNames.map(v => getPermission(v)),
  },
]

/**
 * 默认管理角色的映射表
 */
export const defaultRolesMap = defaultRoles.reduce((map, role) => {
  map[role.name] = role
  return map
}, {} as Record<string, Role>)
