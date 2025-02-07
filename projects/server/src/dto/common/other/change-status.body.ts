import { Mixin } from 'ts-mixer'
import { IdsDto } from 'src/dto/id'
import type { IChangeStatusBodyDto } from 'types'

import { StatusDto } from '../../status.dto'

/**
 * 修改数据状态
 * 请求参数
 */
export class ChangeStatusBodyDto
  extends Mixin(
    IdsDto,
    StatusDto,
  )
  implements IChangeStatusBodyDto {}
