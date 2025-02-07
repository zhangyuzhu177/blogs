import { Injectable } from '@nestjs/common'
import { ArticleService } from '../article.service'

@Injectable()
export class ArticleEntitiesService {
  constructor(
    private readonly _articleSrv: ArticleService,
  ) { }

  /**
   * 发布/编辑文章
   * @param article
   */
  // public async upsert(article:UpsertBodyDto) {
  //   try {
  //     if (article.id) {
  //       return await this._articleRepo.update(article.id, article)
  //     } else {
  //       const pageView = 0
  //       const createTime=new Date()
  //       return await this._articleRepo.save({
  //         ...article,
  //         pageView,
  //         createTime
  //       })
  //     }
  //   } catch (error) {
  //     console.log(error);

  //   }
  // }
}
