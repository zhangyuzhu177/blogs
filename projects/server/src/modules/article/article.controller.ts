import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ArticleService } from './article.service'
import { UpsertBodyDto } from './dto/upsert-body.dto'
import { HasPermission } from 'src/guards/permission.guard'
import { PermissionType } from 'src/types/enum/permission.enum'
import { IArticle } from 'src/types/entities/article.interface'

@Controller('article')
@ApiTags('Article | 文章')
export class ArticleController {
  constructor(
    private readonly _articleSrv: ArticleService,
  ) { }


  @ApiOperation({ summary: '获取文章列表' })
  @Get('list')
  public async getArticleList() {
    return (await this._articleSrv.repo()).find()
  }

  @HasPermission([PermissionType.ARTICLE_PUBLISH,PermissionType.ARTICLE_UPDATE,PermissionType.ARTICLE_QUERY])
  @ApiOperation({ summary: '发布/编辑文章' })
  @Post('upsert')
  public async upsertArticle(@Body() body: UpsertBodyDto) {
    return await this._articleSrv.upsert(body)
  }

  @ApiOperation({ summary: '删除文章' })
  @HasPermission([PermissionType.ARTICLE_DELETE, PermissionType.ARTICLE_UPDATE, PermissionType.ARTICLE_QUERY])
  @Delete('delete:id')
  public async deleteArticle(@Param() param: { id: IArticle['id'] }) {
    const { id } = param
    const res = (await this._articleSrv.repo()).delete({id})
    return (await res).affected
  }

  @ApiOperation({ summary: '获取文章详情' })
  @Get('detail:id')
  public async getArticleDetail(@Param() param: { id: IArticle['id'] }) {
    const { id } = param
    /** 浏览量+1 */
    await (await this._articleSrv.repo()).increment({ id }, 'pageView', 1)
    return (await this._articleSrv.repo()).findOne({where:{id}})
  }
}
