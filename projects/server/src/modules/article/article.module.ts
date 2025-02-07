import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Article } from 'src/entities/article'
import { ArticleService } from './article.service'
import { ArticleType } from 'src/entities/article-type'
import { ArticleTypeController } from './type/type.controller'
import { ArticleEntitiesController } from './entities/entities.controller'
import { ArticleTypeService } from './type/type.service'
import { ArticleEntitiesService } from './entities/entities.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Article,ArticleType]),
  ],
  providers: [
    ArticleService,
    ArticleTypeService,
    ArticleEntitiesService
  ],
  exports: [
    ArticleService,
    ArticleTypeService,
    ArticleEntitiesService
  ],
  controllers: [
    ArticleTypeController,
    ArticleEntitiesController,
  ]
})
export class ArticleModule {}
