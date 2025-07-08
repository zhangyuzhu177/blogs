/** 图库唯一标识 */
export interface IGalleryIdDto {
  /** 图库唯一标识 */
  galleryId: string
}

/** 图库唯一标识 (可选) */
export interface IGalleryIdOptionalDto extends Partial<IGalleryIdDto> { }
