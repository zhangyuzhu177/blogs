import { Mixin } from 'ts-mixer'
import { IUpsertArticleTypeBodyDto } from 'types'
import { DescOptionalDto, NameDto } from 'src/dto'

export class UpsertArticleTypeBodyDto
  extends Mixin(
    NameDto,
    DescOptionalDto
  )
  implements IUpsertArticleTypeBodyDto {}
