import type { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Article } from 'src/entities/article'
import { InjectRepository } from '@nestjs/typeorm'
import { ArticleType } from 'src/entities/article-type'
import { ArticleTag } from 'src/entities/article-tag'

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly _articleRepo: Repository<Article>,
    @InjectRepository(ArticleTag)
    private readonly _articleTagRepo: Repository<ArticleTag>,
    @InjectRepository(ArticleType)
    private readonly _articleTypeRepo: Repository<ArticleType>,
  ) { }

  public entitiesRepo() {
    return this._articleRepo
  }

  public articleTagRepo() {
    return this._articleTagRepo
  }

  public articleTypeRepo() {
    return this._articleTypeRepo
  }
}
