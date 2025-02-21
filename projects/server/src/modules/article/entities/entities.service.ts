import { In } from 'typeorm'
import { ErrorCode } from 'types'
import { Injectable } from '@nestjs/common'
import { ArticleService } from '../article.service'
import { ChangeStatusBodyDto } from 'src/dto/common'
import { parseSqlError, responseError } from 'src/utils'
import { UpsertArticleBodyDto } from './dto/upsert-body.dto'

@Injectable()
export class ArticleEntitiesService {
  constructor(
    private readonly _articleSrv: ArticleService,
  ) { }

  /**
   * 获取文章详情
   */
  public async getArticleDetail(id: string) {
    const article = await this._articleSrv.entitiesRepo().findOneBy({ id })

    if (!article)
      responseError(ErrorCode.ARTICLE_NOT_EXISTS)

    await this._articleSrv.entitiesRepo().increment({ id }, 'pageView', 1)

    return article
  }

  /**
   * 发布文章
   */
  public async createArticle(body: UpsertArticleBodyDto) {
    try {
      const insertRes = await this._articleSrv.entitiesRepo().insert(
        this._articleSrv.entitiesRepo().create(body)
      )

      return insertRes.identifiers[0].id
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
  public async updateArticle(body: UpsertArticleBodyDto,id:string) {
    try {
      const updateRes = await this._articleSrv.entitiesRepo().update(
        { id },
        body,
      )
      if (!updateRes.affected)
        responseError(ErrorCode.ARTICLE_NOT_EXISTS)

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
