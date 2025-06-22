import { In } from 'typeorm'
import { ErrorCode } from 'types'
import { objectOmit } from 'utils'
import { Injectable, Logger } from '@nestjs/common'

import { User } from 'src/entities/user'
import { ChangeStatusBodyDto } from 'src/dto/common'
import { parseSqlError, responseError } from 'src/utils'

import { ArticleService } from '../article.service'
import { UpsertArticleBodyDto } from './dto/upsert-body.dto'

@Injectable()
export class ArticleEntitiesService {
  private readonly _logger = new Logger(ArticleEntitiesService.name)

  constructor(
    private readonly _articleSrv: ArticleService,
  ) { }

  /**
   * 获取分类,标签,文章数量
   */
  public async getArticleAndTypeAndTagCount() {
    const [articleCount, typeCount, tagCount] = await Promise.all([
      this._articleSrv.entitiesRepo().count(),
      this._articleSrv.articleTypeRepo().count(),
      this._articleSrv.articleTagRepo().count(),
    ])

    const data = [
      {
        name: '文章',
        count: articleCount,
      },
      {
        name: '分类',
        count: typeCount,
      },
      {
        name: '标签',
        count: tagCount,
      },
    ]

    return data
  }

  /**
   * 获取文章详情
   */
  public async getArticleDetail(id: string, user:User, ip: string) {
    const article = await this._articleSrv.entitiesRepo().findOne({
      where: { id },
      relations: {
        tags: true,
      },
      select: {
        tags: {
          id: true,
        }
      }
    })

    if (!article)
      responseError(ErrorCode.ARTICLE_NOT_EXISTS)

    if (!user) {
      this._logger.verbose(ip)
      await this._articleSrv.entitiesRepo().increment({ id }, 'pageView', 1)
    }

    return article
  }

  /**
   * 发布文章
   */
  public async createArticle(body: UpsertArticleBodyDto) {
    const { tagIds } = body
    const tags = await this._articleSrv.articleTagRepo().findBy({ id: In(tagIds) })
    if (tags.length !== tagIds.length)
      responseError(ErrorCode.ARTICLE_TAG_NOT_EXISTS)

    try {
      const data = this._articleSrv.entitiesRepo().create({
        ...objectOmit(body, 'tagIds'),
        tags
      })

      const insertRes = await this._articleSrv.entitiesRepo().save(data)

      return insertRes.id
    } catch (e) {
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.FOREIGN_KEY_CONSTRAINT_FAILS)
        responseError(ErrorCode.ARTICLE_TYPE_NOT_EXISTS)
      throw e
    }
  }

  /**
   * 编辑文章
   */
  public async updateArticle(body: UpsertArticleBodyDto, id: string) {
    const { tagIds } = body
    const tags = await this._articleSrv.articleTagRepo().findBy({ id: In(tagIds) })
    if (tags.length !== tagIds.length)
      responseError(ErrorCode.ARTICLE_TAG_NOT_EXISTS)

    const article = await this._articleSrv.entitiesRepo().findOne({
      where: { id },
      relations: {
        tags: true,
      },
    })

    if (!article)
      responseError(ErrorCode.ARTICLE_NOT_EXISTS)

    try {
      Object.assign(article, {
        ...objectOmit(body, 'tagIds'),
        tags
      })

      await this._articleSrv.entitiesRepo().save(article)

      return id
    } catch (e) {
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.FOREIGN_KEY_CONSTRAINT_FAILS)
        responseError(ErrorCode.ARTICLE_TYPE_NOT_EXISTS)
      throw e
    }
  }

  /**
   * 批量修改文章状态
   */
  public async changeArticleStatus(body: ChangeStatusBodyDto) {
    const { ids, status } = body

    if (
      ids.length === 1
      && !(await this._articleSrv.entitiesRepo().existsBy({id: ids[0]}))
    )
      responseError(ErrorCode.ARTICLE_NOT_EXISTS)

    const updateRes = await this._articleSrv.entitiesRepo().update(
      { id: In(ids) },
      { status },
    )

    return updateRes.affected
  }

  /**
   * 删除文章
   */
  public async deleteArticle(id: string) {
    if (!(await this._articleSrv.entitiesRepo().existsBy({ id })))
      responseError(ErrorCode.ARTICLE_NOT_EXISTS)

    const deleteRes = await this._articleSrv.entitiesRepo().delete({ id })
    return deleteRes.affected
  }
}
