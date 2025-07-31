import { ID_EXAMPLE } from 'types'
import { decorate } from 'ts-mixer'
import { GenerateStringDecorator } from 'src/utils'
import type { IArticleTypeIdDto, IArticleTypeIdOptionalDto } from 'types'

const DESC = '文章类别的唯一标识'

export class ArticleTypeIdDto implements IArticleTypeIdDto {
  @decorate(GenerateStringDecorator(DESC, ID_EXAMPLE))
  articleTypeId: string
}

export class ArticleTypeIdOptionalDto implements IArticleTypeIdOptionalDto {
  @decorate(GenerateStringDecorator(DESC, ID_EXAMPLE, true))
  articleTypeId?: ArticleTypeIdDto['articleTypeId']
}
