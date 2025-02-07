/** 文章的唯一标识 */
export interface IArticleIdDto {
  articleId: string
}

/** 文章的唯一标识（可选） */
export interface IArticleIdOptionalDto extends Partial<IArticleIdDto> { }
