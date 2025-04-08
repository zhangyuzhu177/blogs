import { PermissionType } from 'types'
import { Article } from 'src/entities/article'
import { ChangeStatusBodyDto } from 'src/dto/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { HasPermission } from 'src/guards/permission.guard'
import { ApiSuccessResponse, getQuery, getQueryPaging } from 'src/utils'
import { Body, Controller,Delete,Get,Param,Patch,Post } from '@nestjs/common'
import {
  ArticleIdDto,
  ArticleTypeIdDto,
  IdsDto,
  QueryDto,
  QueryPagination,
  QueryResDto,
  SuccessNumberDto,
  SuccessStringDto
} from 'src/dto'

import { ArticleService } from '../article.service'
import { ArticleEntitiesService } from './article.service'
import { UpsertArticleBodyDto } from './dto/upsert-body.dto'

@Controller('article/entities')
@ApiTags('Article | 文章')
export class ArticleEntitiesController {
  constructor(
    private readonly _articleSrv: ArticleService,
    private readonly _entitiesSrv: ArticleEntitiesService,
  ) { }

  @ApiOperation({
    summary: '获取文章列表'
  })
  @ApiSuccessResponse(QueryResDto<Article>)
  // @HasPermission(PermissionType.ARTICLE_QUERY)
  @Post('query')
  public queryArticleList(
    @Body() body: QueryDto<Article>,
  ) {
    return getQuery(
      this._articleSrv.entitiesRepo(),
      body,
    )
  }

  @ApiOperation({
    summary: '获取文章详情'
  })
  @Get('detail/:articleId')
  public getArticleDetail(
    @Param() { articleId }: ArticleIdDto
  ) {
    return this._entitiesSrv.getArticleDetail(articleId)
  }

  @ApiOperation({
    summary: '发布文章'
  })
  @ApiSuccessResponse(SuccessStringDto)
  @HasPermission(PermissionType.ARTICLE_PUBLISH)
  @Post('create')
  public createArticle(
    @Body() body: UpsertArticleBodyDto
  ) {
    return this._entitiesSrv.createArticle(body)
  }

  @ApiOperation({
    summary: '编辑文章'
  })
  @ApiSuccessResponse(SuccessStringDto)
  @HasPermission(PermissionType.ARTICLE_UPDATE)
  @Patch('update/:articleId')
  public updateArticle(
    @Body() body: UpsertArticleBodyDto,
    @Param() { articleId }: ArticleIdDto
  ) {
    return this._entitiesSrv.updateArticle(body,articleId)
  }

  @ApiOperation({
    summary: '批量删除文章'
  })
  @ApiSuccessResponse(SuccessNumberDto)
  @HasPermission(PermissionType.ARTICLE_DELETE)
  @Delete('delete')
  public async deleteArticles(
    @Body() { ids }: IdsDto,
  ) {
    if (ids.length === 1) {
      return await this._entitiesSrv.deleteArticle(ids[0])
        ? 1
        : 0
    }
    let success = 0
    for (const id of ids) {
      try {
        const deleteRes = await this._entitiesSrv.deleteArticle(id)
        deleteRes && success++
      }
      catch (_) { }
    }
    return success
  }

  @ApiOperation({
    summary: '删除指定文章',
  })
  @ApiSuccessResponse(SuccessNumberDto)
  @HasPermission(PermissionType.ARTICLE_DELETE)
  @Delete('delete/:articleId')
  public deleteArticleById(
    @Param() {articleId}: ArticleIdDto
  ) {
    return this._entitiesSrv.deleteArticle(articleId)
  }

  @ApiOperation({
    summary: '批量修改文章状态',
  })
  @ApiSuccessResponse(SuccessNumberDto)
  @HasPermission(PermissionType.ARTICLE_UPDATE_STATUS)
  @Post('status')
  public changeArticleStatus(
    @Body() body: ChangeStatusBodyDto
  ) {
    return this._entitiesSrv.changeArticleStatus(body)
  }
}
