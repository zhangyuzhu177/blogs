import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ArticleService } from '../article.service'
import { ApiSuccessResponse, getQuery } from 'src/utils'
import { ArticleTypeIdDto, IdsDto, QueryDto, QueryResDto, SuccessNumberDto, SuccessStringDto } from 'src/dto'
import { ArticleType } from 'src/entities/article-type'
import { HasPermission } from 'src/guards'
import { PermissionType } from 'types'
import { UpsertArticleTypeBodyDto } from './dto/upsert-article-type-body.dto'
import { ArticleTypeService } from './type.service'

@Controller('article/type')
@ApiTags('Article | 文章分类')
export class ArticleTypeController {
  constructor(
    private readonly _articleSrv: ArticleService,
    private readonly _articleTypeSrv: ArticleTypeService,
  ) { }

  @ApiOperation({
    summary: '获取文章类型列表'
  })
  @ApiSuccessResponse(QueryResDto<ArticleType>)
  @HasPermission(PermissionType.ARTICLE_TYPE_QUERY)
  @Post('query')
  public queryArticleTypeList(
    @Body() body: QueryDto<ArticleType>,
  ) {
    return getQuery(
      this._articleSrv.articleTypeRepo(),
      body,
    )
  }

  @ApiOperation({
    summary: '创建文章类型'
  })
  @ApiSuccessResponse(SuccessStringDto)
  @HasPermission(PermissionType.ARTICLE_TYPE_CREATE)
  @Post('create')
  public createArticleType(
    @Body() body: UpsertArticleTypeBodyDto,
  ) {
    return this._articleTypeSrv.createArticleType(body)
  }

  @ApiOperation({
    summary: '编辑文章类型'
  })
  @ApiSuccessResponse(SuccessStringDto)
  @HasPermission(PermissionType.ARTICLE_TYPE_UPDATE)
  @Patch('update/:articleTypeId')
  public updateArticleType(
    @Body() body: UpsertArticleTypeBodyDto,
    @Param() { articleTypeId }: ArticleTypeIdDto
  ) {
    return this._articleTypeSrv.updateArticleType(body, articleTypeId)
  }

  @ApiOperation({
    summary: '批量删除文章类型'
  })
  @ApiSuccessResponse(SuccessNumberDto)
  @HasPermission(PermissionType.ARTICLE_TYPE_DELETE)
  @Delete('delete')
  public async deleteArticleType(
    @Body() {ids}: IdsDto,
  ) {
    if (ids.length === 1) {
      return await this._articleTypeSrv.deleteArticleType(ids[0])
        ? 1
        : 0
    }

    let success = 0
    for (const id of ids) {
      try {
        const deleteRes = await this._articleTypeSrv.deleteArticleType(id)
        deleteRes && success++
      }
      catch (_) { }
    }
    return success
  }

  @ApiOperation({
    summary: '批量删除文章类型'
  })
  @ApiSuccessResponse(SuccessNumberDto)
  @HasPermission(PermissionType.ARTICLE_TYPE_DELETE)
  @Delete('delete/:articleTypeId')
  public deleteArticleTypeById(
    @Param() { articleTypeId }: ArticleTypeIdDto
  ) {
    return this._articleTypeSrv.deleteArticleType(articleTypeId)
  }
}
