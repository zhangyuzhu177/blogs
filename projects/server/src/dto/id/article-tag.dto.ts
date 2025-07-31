import { ID_EXAMPLE } from 'types'
import { decorate } from 'ts-mixer'
import { GenerateStringDecorator } from 'src/utils'
import type { IArticleTagIdDto, IArticleTagIdOptionalDto } from 'types'

const DESC = '文章标签的唯一标识'

export class ArticleTagIdDto implements IArticleTagIdDto {
  @decorate(GenerateStringDecorator(DESC, ID_EXAMPLE))
  articleTagId: string
}

export class ArticleTagIdOptionalDto implements IArticleTagIdOptionalDto {
  @decorate(GenerateStringDecorator(DESC, ID_EXAMPLE, true))
  articleTagId?: ArticleTagIdDto['articleTagId']
}
