import { IGallery } from "../../entities/gallery.interface";

export interface IUpsertGallery
  extends Pick<
    IGallery,
    'name' | 'desc' | 'galleryTypeId' | 'picture'
  > { }
