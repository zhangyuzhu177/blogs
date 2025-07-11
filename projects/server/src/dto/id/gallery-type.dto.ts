import { ID_EXAMPLE } from 'types'
import { decorate } from 'ts-mixer'
import type { IGalleryTypeIdDto, IGalleryTypeIdOptionalDto } from 'types'
import { GenerateStringDecorator } from 'src/utils'

const DESC = '图库类型的唯一标识'

export class GalleryTypeIdDto implements IGalleryTypeIdDto {
  @decorate(GenerateStringDecorator(DESC, ID_EXAMPLE))
  galleryTypeId: string
}

export class GalleryTypeIdOptionalDto implements IGalleryTypeIdOptionalDto {
  @decorate(GenerateStringDecorator(DESC, ID_EXAMPLE, true))
  galleryTypeId?: GalleryTypeIdDto['galleryTypeId']
}
