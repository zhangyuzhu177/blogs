import { Module } from '@nestjs/common'
import { Article } from 'src/entities/article'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ArticleService } from './article.service'
import { ArticleController } from './article.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
