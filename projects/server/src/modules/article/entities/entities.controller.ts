import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { UpsertBodyDto } from './dto/upsert-body.dto'
import { HasPermission } from 'src/guards/permission.guard'
import { ArticleIdDto } from 'src/dto/id/article.dto'
import { ArticleService } from '../article.service'
import { ArticleStatus } from 'types'

@Controller('article/entities')
@ApiTags('Article | 文章')
export class ArticleEntitiesController {
  constructor(
    private readonly _articleSrv: ArticleService,
  ) { }


  // @ApiOperation({ summary: '获取文章列表' })
  // @Get('list')
  // public async getArticleList() {
  //   const res = await (await this._articleSrv.repo()).find({where:{status:ArticleStatus.PUBLIC}})
  //   return res
  // }

  // @HasPermission([PermissionType.ARTICLE_PUBLISH,PermissionType.ARTICLE_UPDATE,PermissionType.ARTICLE_QUERY])
  // @ApiOperation({ summary: '发布/编辑文章' })
  // @Post('upsert')
  // public async upsertArticle(@Body() body: UpsertBodyDto) {
  //   return await this._articleSrv.upsert(body)
  // }

  // @ApiOperation({ summary: '删除文章' })
  // @HasPermission([PermissionType.ARTICLE_DELETE, PermissionType.ARTICLE_UPDATE, PermissionType.ARTICLE_QUERY])
  // @Delete('delete:articleId')
  // public async deleteArticle(@Param() param: ArticleIdDto) {
  //   const { articleId } = param

  //   const res =await (await this._articleSrv.repo()).delete({ id: articleId })
  //   return res.affected
  // }

  // @ApiOperation({ summary: '获取文章详情' })
  // @Get('detail:articleId')
  // public async getArticleDetail(@Param() param: ArticleIdDto) {
  //   const { articleId } = param
  //   /** 浏览量+1 */
  //   await (await this._articleSrv.repo()).increment({ id:articleId }, 'pageView', 1)
  //   return (await this._articleSrv.repo()).findOne({where:{id:articleId}})
  // }
}
