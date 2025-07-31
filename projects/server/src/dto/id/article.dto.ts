import { ID_EXAMPLE } from 'types'
import { decorate } from 'ts-mixer'
import { GenerateStringDecorator } from 'src/utils'
import type { IArticleIdDto, IArticleIdOptionalDto } from 'types'

const DESC = '文章的唯一标识'

export class ArticleIdDto implements IArticleIdDto {
  @decorate(GenerateStringDecorator(DESC, ID_EXAMPLE))
  articleId: string
}

export class ArticleIdOptionalDto implements IArticleIdOptionalDto {
  @decorate(GenerateStringDecorator(DESC, ID_EXAMPLE, true))
  articleId?: ArticleIdDto['articleId']
}
