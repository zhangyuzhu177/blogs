import { PermissionType } from 'types'
import { HasPermission } from 'src/guards'
import { IdsDto, QueryDto, QueryResDto, SuccessNumberDto, SuccessStringDto } from 'src/dto'
import { ArticleTag } from 'src/entities/article-tag'
import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSuccessResponse, getQuery } from 'src/utils'

import { ArticleService } from '../article.service'
import { ArticleTagService } from './tag.service'
import { UpsertArticleTagBodyDto } from './dto/upsert-article-tag-body.dto'
import { ArticleTagIdDto } from 'src/dto/id/article-tag.dto'

@Controller('article/tag')
@ApiTags('ArticleTag | 文章标签')
export class ArticleTagController {
  constructor(
    private readonly _articleSrv: ArticleService,
    private readonly _articleTagSrv: ArticleTagService,
  ) { }

  @ApiOperation({
    summary: '获取文章分类列表'
  })
  @ApiSuccessResponse(QueryResDto<ArticleTag>)
  @HasPermission(PermissionType.ARTICLE_TAG_QUERY)
  @Post('query')
  public queryArticleTypeList(
    @Body() body: QueryDto<ArticleTag>,
  ) {
    return getQuery(
      this._articleSrv.articleTagRepo(),
      body,
    )
  }

  @ApiOperation({
    summary: '创建文章标签'
  })
  @ApiSuccessResponse(SuccessStringDto)
  @HasPermission(PermissionType.ARTICLE_TAG_CREATE)
  @Post('create')
  public createArticleTag(
    @Body() body: UpsertArticleTagBodyDto
  ) {
    return this._articleTagSrv.createArticleTag(body)
  }

  @ApiOperation({
    summary: '更新文章标签'
  })
  @ApiSuccessResponse(SuccessStringDto)
  @HasPermission(PermissionType.ARTICLE_TAG_UPDATE)
  @Patch('update/:articleTagId')
  public updateArticleTag(
    @Body() body: UpsertArticleTagBodyDto,
    @Param() {articleTagId}:ArticleTagIdDto
  ) {
    return this._articleTagSrv.updateArticleTag(body, articleTagId)
  }

  @ApiOperation({
    summary: '批量删除文章标签'
  })
  @ApiSuccessResponse(SuccessNumberDto)
  @HasPermission(PermissionType.ARTICLE_TAG_DELETE)
  @Delete('delete')
  public async deleteArticleTag(
    @Body() {ids}: IdsDto,
  ) {
    if (ids.length === 1) {
      return await this._articleTagSrv.deleteArticleTag(ids[0])
        ? 1
        : 0
    }

    let success = 0
    for (const id of ids) {
      try {
        const deleteRes = await this._articleTagSrv.deleteArticleTag(id)
        deleteRes && success++
      }
      catch (_) { }
    }
    return success
  }

  @ApiOperation({
      summary: '批量删除文章分类'
    })
  @ApiSuccessResponse(SuccessNumberDto)
  @HasPermission(PermissionType.ARTICLE_TYPE_DELETE)
  @Delete('delete/:articleTagId')
  public deleteArticleTypeById(
    @Param() { articleTagId }: ArticleTagIdDto
  ) {
    return this._articleTagSrv.deleteArticleTag(articleTagId)
  }
}
