import type { IGallery } from '../../entities/gallery.interface'

export interface IUpsertGalleryBodyDto
  extends Pick<
    IGallery,
    'name' | 'desc' | 'galleryTypeId' | 'picture' | 'status'
  > { }
