import type { OnModuleInit } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { DEFAULT_ARTICLE_TYPE, ErrorCode } from 'types'
import { parseSqlError, responseError } from 'src/utils'
import { ArticleService } from '../article.service'
import type { UpsertArticleTypeBodyDto } from './dto/upsert-article-type-body.dto'

@Injectable()
export class ArticleTypeService implements OnModuleInit {
  constructor(
    private readonly _articleSrv: ArticleService,
  ) { }

  onModuleInit() {
    this._initArticleType()
  }

  /**
   * 初始化文章分类
   */
  private async _initArticleType() {
    if (!(await this._articleSrv.articleTypeRepo().existsBy({ id: DEFAULT_ARTICLE_TYPE.id })))
      this._articleSrv.articleTypeRepo().insert(DEFAULT_ARTICLE_TYPE)
  }

  /**
   * 创建文章分类
   */
  public async createArticleType(body: UpsertArticleTypeBodyDto) {
    try {
      const insertRes = await this._articleSrv.articleTypeRepo().insert(body)
      return insertRes.identifiers[0].id
    }
    catch (e) {
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.DUPLICATE_ENTRY)
        responseError(ErrorCode.ARTICLE_TYPE_IS_EXIST)
      throw e
    }
  }

  /**
   * 编辑文章分类
   */
  public async updateArticleType(body: UpsertArticleTypeBodyDto, id: string) {
    if (!(await this._articleSrv.articleTypeRepo().existsBy({ id })))
      responseError(ErrorCode.ARTICLE_TYPE_NOT_EXISTS)

    try {
      await this._articleSrv.articleTypeRepo().update({ id }, body)
      return id
    }
    catch (e) {
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.DUPLICATE_ENTRY)
        responseError(ErrorCode.ARTICLE_TYPE_IS_EXIST)
      throw e
    }
  }

  /**
   * 删除文章分类
   */
  public async deleteArticleType(id: string) {
    if (id === DEFAULT_ARTICLE_TYPE.id)
      responseError(ErrorCode.ARTICLE_TYPE_DEFAULT_DELETE)

    if (!(await this._articleSrv.articleTypeRepo().existsBy({ id })))
      responseError(ErrorCode.ARTICLE_TYPE_NOT_EXISTS)

    try {
      const deleteRes = await this._articleSrv.articleTypeRepo().delete({ id })
      return deleteRes.affected > 0
    }
    catch (e) {
      const sqlError = parseSqlError(e)
      if (sqlError === SqlError.FOREIGN_KEY_CONSTRAINT_FAILS)
        responseError(ErrorCode.ARTICLE_TYPE_HAS_ARTICLE)
      throw e
    }
  }
}
