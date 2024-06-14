import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Article } from 'src/entities/article'
import type { Repository } from 'typeorm'
import { UpsertBodyDto } from './dto/upsert-body.dto'

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly _articleRepo: Repository<Article>,
  ) { }

  /**
   * 发布/编辑文章
   * @param article
   */
  public async upsert(article:UpsertBodyDto) {
    if (article.id) {
      return await this._articleRepo.update(article.id, article)
    } else {
      const pageView = 0
      const createTime=new Date()
      return await this._articleRepo.save({
        ...article,
        pageView,
        createTime
      })
    }
  }

  public async repo() {
    return this._articleRepo
  }
}
