import { Injectable } from '@nestjs/common'
import { ArticleService } from '../article.service'


@Injectable()
export class ArticleTagService {
  constructor(
    private readonly _articleSrv: ArticleService,
  ) { }
}
