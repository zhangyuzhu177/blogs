import type { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Article } from 'src/entities/article'
import { InjectRepository } from '@nestjs/typeorm'
import { ArticleType } from 'src/entities/article-type'

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly _articleRepo: Repository<Article>,
    @InjectRepository(ArticleType)
    private readonly _articleTypeRepo: Repository<ArticleType>,
  ) { }

  public entitiesRepo() {
    return this._articleRepo
  }

  public articleTypeRepo() {
    return this._articleTypeRepo
  }
}
