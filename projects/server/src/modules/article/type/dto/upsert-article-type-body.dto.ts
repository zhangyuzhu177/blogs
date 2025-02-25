import { Mixin } from 'ts-mixer'
import { IUpsertArticleTypeBodyDto } from 'types'
import { DescOptionalDto, NameDto, OrderDto } from 'src/dto'

export class UpsertArticleTypeBodyDto
  extends Mixin(
    NameDto,
    OrderDto,
    DescOptionalDto
  )
  implements IUpsertArticleTypeBodyDto {}
