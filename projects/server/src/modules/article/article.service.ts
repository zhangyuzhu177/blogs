import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Article } from 'src/entities/article'
import type { Repository } from 'typeorm'

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly _articleRepo: Repository<Article>,
  ) { }
}
