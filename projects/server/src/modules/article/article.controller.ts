import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import type { ArticleService } from './article.service'
import type { UpsertBodyDto } from './dto/upsert-body.dto'

@Controller('article')
@ApiTags('Article | 文章')
export class ArticleController {
  constructor(
    private readonly _articleSrv: ArticleService,
  ) { }

  @ApiOperation({ summary: '发布/编辑文章' })
  @Post('upsert')
  public async upsertArticle(@Body() body: UpsertBodyDto) {
    return body
  }
}
