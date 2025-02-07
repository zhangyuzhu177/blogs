import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Article } from 'src/entities/article'
import type { Repository } from 'typeorm'
import { UpsertBodyDto } from './entities/dto/upsert-body.dto'
import { ArticleType } from 'src/entities/article-type'

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly _articleRepo: Repository<Article>,
    @InjectRepository(ArticleType)
    private readonly _articleTypeRepo: Repository<ArticleType>,
  ) { }

  public async entitiesRepo() {
    return this._articleRepo
  }

  public async articleTypeRepo() {
    return this._articleTypeRepo
  }
}
