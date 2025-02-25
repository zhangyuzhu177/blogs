/** 文章标签的唯一标识 */
export interface IArticleTagIdDto {
  articleTagId: string
}

/** 文章类型的唯一标识（可选） */
export interface IArticleTagIdOptionalDto extends Partial<IArticleTagIdDto> { }
