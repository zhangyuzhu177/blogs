import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Article } from 'src/entities/article'
import { ArticleTag } from 'src/entities/article-tag'
import { ArticleType } from 'src/entities/article-type'

import { ArticleService } from './article.service'
import { ArticleTypeService } from './type/type.service'
import { ArticleTypeController } from './type/type.controller'
import { ArticleEntitiesService } from './article/article.service'
import { ArticleEntitiesController } from './article/article.controller'
import { ArticleTagService } from './tag/tag.service'
import { ArticleTagController } from './tag/tag.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, ArticleType, ArticleTag]),
  ],
  providers: [
    ArticleService,
    ArticleTagService,
    ArticleTypeService,
    ArticleEntitiesService,
  ],
  exports: [
    ArticleService,
    ArticleTagService,
    ArticleTypeService,
    ArticleEntitiesService,
  ],
  controllers: [
    ArticleTagController,
    ArticleTypeController,
    ArticleEntitiesController,
  ],
})
export class ArticleModule {}
