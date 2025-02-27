import { Mixin } from 'ts-mixer'
import { IUpsertArticleTagBodyDto } from 'types'
import { DescOptionalDto, NameDto } from 'src/dto'

export class UpsertArticleTagBodyDto
  extends Mixin(
    NameDto,
    DescOptionalDto
  )
  implements IUpsertArticleTagBodyDto {}
