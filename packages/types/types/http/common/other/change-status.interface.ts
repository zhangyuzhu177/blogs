import type { IIdsDto } from '../../../dto/id/ids.interface'
import type { IStatusDto } from '../../../dto/status.interface'

/**
 * 修改数据状态
 * 请求参数
 */
export interface IChangeStatusBodyDto
  extends
  IIdsDto,
  IStatusDto {}
