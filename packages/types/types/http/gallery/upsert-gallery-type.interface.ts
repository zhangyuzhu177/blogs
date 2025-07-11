import type { IGalleryType } from '../../entities/gallery-type.interface'

export interface IUpsertGalleryTypeBodyDto
  extends Pick<
    IGalleryType,
    'name' | 'desc' | 'order'
  > { }
