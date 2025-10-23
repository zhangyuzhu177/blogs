import { FastifyReply } from 'fastify'
import { ErrorCode, LikesType, PermissionType } from 'types'
import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res } from '@nestjs/common'

import type { Article } from 'src/entities/article'
import { ChangeStatusBodyDto } from 'src/dto/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { HasPermission } from 'src/guards/permission.guard'
import { LikesService } from 'src/modules/likes/likes.service'
import { ApiSuccessResponse, getQuery, responseError } from 'src/utils'
import { CreateLikeBodyDto } from 'src/modules/likes/dto/create-link-body.dto'
import {
  ArticleIdDto,
  IdsDto,
  QueryDto,
  QueryResDto,
  SuccessNumberDto,
  SuccessStringDto,
} from 'src/dto'

import { ArticleService } from '../article.service'
import { ArticleEntitiesService } from './article.service'
import { UpsertArticleBodyDto } from './dto/upsert-body.dto'
import { CreateAbstractBodyDto } from './dto/create-abstract-body.dto'

@Controller('article/entities')
@ApiTags('Article | 文章')
export class ArticleEntitiesController {
  constructor(
    private readonly _linkSrv: LikesService,
    private readonly _articleSrv: ArticleService,
    private readonly _entitiesSrv: ArticleEntitiesService,
  ) { }

  @ApiOperation({
    summary: '获取分类,标签,文章数量',
  })
  @Get('count')
  public getArticleAndTypeAndTagCount() {
    return this._entitiesSrv.getArticleAndTypeAndTagCount()
  }

  @ApiOperation({
    summary: '获取文章列表',
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
    summary: '获取文章详情',
  })
  @Get('detail/:articleId')
  public getArticleDetail(
    @Param() { articleId }: ArticleIdDto,
    @Req() req: FastifyRequest,
  ) {
    const { user, ip } = req.raw
    return this._entitiesSrv.getArticleDetail(articleId, user, ip)
  }

  @ApiOperation({
    summary: '发布文章',
  })
  @ApiSuccessResponse(SuccessStringDto)
  @HasPermission(PermissionType.ARTICLE_PUBLISH)
  @Post('create')
  public createArticle(
    @Body() body: UpsertArticleBodyDto,
  ) {
    return this._entitiesSrv.createArticle(body)
  }

  @ApiOperation({
    summary: '编辑文章',
  })
  @ApiSuccessResponse(SuccessStringDto)
  @HasPermission(PermissionType.ARTICLE_UPDATE)
  @Patch('update/:articleId')
  public updateArticle(
    @Body() body: UpsertArticleBodyDto,
    @Param() { articleId }: ArticleIdDto,
  ) {
    return this._entitiesSrv.updateArticle(body, articleId)
  }

  @ApiOperation({
    summary: '批量删除文章',
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
    @Param() { articleId }: ArticleIdDto,
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
    @Body() body: ChangeStatusBodyDto,
  ) {
    return this._entitiesSrv.changeArticleStatus(body)
  }

  @ApiOperation({
    summary: '点赞',
  })
  @ApiSuccessResponse(SuccessStringDto)
  @Post('like')
  public async createLink(
    @Req() req: FastifyRequest,
    @Body() body: CreateLikeBodyDto,
  ) {
    const { ip } = req.raw
    const { contentId } = body

    if (!(await this._articleSrv.entitiesRepo().existsBy({ id: contentId })))
      responseError(ErrorCode.ARTICLE_NOT_EXISTS)

    return this._linkSrv.createLink(ip, LikesType.ARTICLE, body)
  }

  @ApiOperation({ summary: 'AI生成文章摘要 流式返回' })
  @HasPermission(PermissionType.ARTICLE_UPDATE)
  @Post('abstract')
  public async aiGenerateAbstract(
    @Body() body: CreateAbstractBodyDto,
    @Res() reply: FastifyReply,
  ) {
    const res = reply.raw

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Access-Control-Allow-Origin', '*') // 如果需要跨域

    const stream = await this._entitiesSrv.aiGenerateAbstract(body.content)

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || ''
      if (delta)
        res.write(`data: ${JSON.stringify({ content: delta })}\n\n`)
    }

    res.write('data: [DONE]\n\n')
    res.end()
  }
}
