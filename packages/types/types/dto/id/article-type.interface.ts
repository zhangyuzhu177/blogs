/** 文章类型的唯一标识 */
export interface IArticleTypeIdDto {
  articleTypeId: string
}

/** 文章类型的唯一标识（可选） */
export interface IArticleTypeIdOptionalDto extends Partial<IArticleTypeIdDto> { }
