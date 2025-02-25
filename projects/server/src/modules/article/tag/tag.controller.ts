import { ApiTags } from '@nestjs/swagger'
import { Controller } from '@nestjs/common'

import { ArticleService } from '../article.service'
import { ArticleTagService } from './type.service'

@Controller('article/tag')
@ApiTags('ArticleTag | 文章标签')
export class ArticleTagController {
  constructor(
    private readonly _articleSrv: ArticleService,
    private readonly _articleTagSrv: ArticleTagService,
  ) { }
}
