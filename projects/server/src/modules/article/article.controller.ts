import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ArticleService } from './article.service'
import { UpsertBodyDto } from './dto/upsert-body.dto'
import { HasPermission } from 'src/guards/permission.guard'
import { PermissionType } from 'src/types/enum/permission.enum'
import { get } from 'http'

@Controller('article')
@ApiTags('Article | 文章')
export class ArticleController {
  constructor(
    private readonly _articleSrv: ArticleService,
  ) { }

  @HasPermission([PermissionType.ARTICLE_PUBLISH,PermissionType.ARTICLE_UPDATE,PermissionType.ARTICLE_QUERY])
  @ApiOperation({ summary: '发布/编辑文章' })
  @Post('upsert')
  public async upsertArticle(@Body() body: UpsertBodyDto) {
    return await this._articleSrv.upsert(body)
  }

  @HasPermission([PermissionType.ARTICLE_QUERY])
  @ApiOperation({ summary: '获取文章列表' })
  @Get('list')
  public async getArticleList() {
    return (await this._articleSrv.repo()).find()
  }
}
