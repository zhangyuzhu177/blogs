import type { IRelationRawDto } from '../../dto/relation.interface'

/**
 * 查询当前登录用户的信息
 * 请求参数
 */
export interface IGetProfileOwnQueryDto extends IRelationRawDto {
  [key: string]: any
}
