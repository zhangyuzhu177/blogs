import { PermissionType } from 'types'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'

import { HasPermission } from 'src/guards'
import { ApiSuccessResponse, getQuery } from 'src/utils'
import type { ArticleType } from 'src/entities/article-type'
import { ArticleTypeIdDto, IdsDto, QueryDto, QueryResDto, SuccessNumberDto, SuccessStringDto } from 'src/dto'

import { ArticleService } from '../article.service'
import { ArticleTypeService } from './type.service'
import { UpsertArticleTypeBodyDto } from './dto/upsert-article-type-body.dto'

@Controller('article/type')
@ApiTags('ArticleType | 文章分类')
export class ArticleTypeController {
  constructor(
    private readonly _articleSrv: ArticleService,
    private readonly _articleTypeSrv: ArticleTypeService,
  ) { }

  @ApiOperation({
    summary: '获取文章分类列表',
  })
  @Get('list')
  public async getArticleTypeList() {
    return await this._articleSrv.articleTypeRepo().find({
      order: {
        order: 'asc',
      },
      select: {
        id: true,
        name: true,
      },
    })
  }

  @ApiOperation({
    summary: '获取文章分类列表',
  })
  @ApiSuccessResponse(QueryResDto<ArticleType>)
  // @HasPermission(PermissionType.ARTICLE_TYPE_QUERY)
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
    summary: '创建文章分类',
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
    summary: '编辑文章分类',
  })
  @ApiSuccessResponse(SuccessStringDto)
  @HasPermission(PermissionType.ARTICLE_TYPE_UPDATE)
  @Patch('update/:articleTypeId')
  public updateArticleType(
    @Body() body: UpsertArticleTypeBodyDto,
    @Param() { articleTypeId }: ArticleTypeIdDto,
  ) {
    return this._articleTypeSrv.updateArticleType(body, articleTypeId)
  }

  @ApiOperation({
    summary: '批量删除文章分类',
  })
  @ApiSuccessResponse(SuccessNumberDto)
  @HasPermission(PermissionType.ARTICLE_TYPE_DELETE)
  @Delete('delete')
  public async deleteArticleType(
    @Body() { ids }: IdsDto,
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
    summary: '批量删除文章分类',
  })
  @ApiSuccessResponse(SuccessNumberDto)
  @HasPermission(PermissionType.ARTICLE_TYPE_DELETE)
  @Delete('delete/:articleTypeId')
  public deleteArticleTypeById(
    @Param() { articleTypeId }: ArticleTypeIdDto,
  ) {
    return this._articleTypeSrv.deleteArticleType(articleTypeId)
  }
}
