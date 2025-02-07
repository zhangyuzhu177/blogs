/** 链接 */
export interface IUrlDto {
  /** 链接 */
  url: string
}

/** 链接（可选） */
export interface IUrlOptionalDto extends Partial<IUrlDto> {}
