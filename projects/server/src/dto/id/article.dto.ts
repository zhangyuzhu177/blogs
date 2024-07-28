import { decorate } from 'ts-mixer'
import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { GenerateParamsDecorator } from 'src/utils/validators/params-decorator-gen'


function Decorator(optional = false) {
  return GenerateParamsDecorator([
    ApiProperty({
      description: '文章的唯一标识',
      type: () => String,
      example: '00000000-0000-0000-0000-000000000000',
    }),
    IsString(),
  ], optional)
}

export class ArticleIdDto {
  @decorate(Decorator(false))
  articleId: string
}

export class ArticleIdOptionalDto{
  @decorate(Decorator(true))
  articleId?: ArticleIdDto['articleId']
}
