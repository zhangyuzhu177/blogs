import { ErrorCode } from 'types'
import type { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import type { IUpsertArticleTagBodyDto } from 'types'

import { parseSqlError, responseError } from 'src/utils'
import type { ArticleTag } from 'src/entities/article-tag'
import { ArticleService } from '../article.service'

@Injectable()
export class ArticleTagService {
  private readonly _articleTagSrv: Repository<ArticleTag>

  constructor(
    private readonly _articleSrv: ArticleService,
  ) {
    this._articleTagSrv = this._articleSrv.articleTagRepo()
  }

  /**
   * 创建文章标签
   */
  public async createArticleTag(body: IUpsertArticleTagBodyDto) {
    try {
      const insertRes = await this._articleTagSrv.insert(
        this._articleTagSrv.create(body),
      )

      return insertRes.identifiers[0].id
    }
    catch (e) {
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.FOREIGN_KEY_CONSTRAINT_FAILS)
        responseError(ErrorCode.ARTICLE_TAG_NOT_EXISTS)
    }
  }

  /**
   * 更新文章标签
   */
  public async updateArticleTag(body: IUpsertArticleTagBodyDto, id: string) {
    try {
      const updateRes = await this._articleTagSrv.update(
        { id },
        body,
      )
      if (!updateRes.affected)
        responseError(ErrorCode.ARTICLE_TAG_NOT_EXISTS)

      return id
    }
    catch (e) {
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.DUPLICATE_ENTRY)
        responseError(ErrorCode.ARTICLE_TAG_IS_EXIST)
      throw e
    }
  }

  /**
   * 删除文章标签
   */
  public async deleteArticleTag(id: string) {
    try {
      const deleteRes = await this._articleTagSrv.delete({ id })
      if (!deleteRes.affected)
        responseError(ErrorCode.ARTICLE_TAG_NOT_EXISTS)

      return id
    }
    catch (e) {
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.FOREIGN_KEY_CONSTRAINT_FAILS)
        responseError(ErrorCode.ARTICLE_TAG_HAS_ARTICLE)
      throw e
    }
  }
}
