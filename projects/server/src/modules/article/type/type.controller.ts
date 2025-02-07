import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ArticleService } from '../article.service'

@Controller('article/type')
@ApiTags('Article | 文章分类')
export class ArticleTypeController {
  constructor(
    private readonly _articleSrv: ArticleService,
  ) { }
}
