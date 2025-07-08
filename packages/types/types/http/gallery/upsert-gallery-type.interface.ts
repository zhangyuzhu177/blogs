import { IGalleryType } from "../../entities/gallery-type.interface";

export interface IUpsertGalleryTypeRequest
  extends Pick<
    IGalleryType,
    'name' | 'desc' | 'order'
  > { }
