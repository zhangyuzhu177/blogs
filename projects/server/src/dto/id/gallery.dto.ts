import { ID_EXAMPLE } from 'types'
import { decorate } from 'ts-mixer'
import type { IGalleryIdDto, IGalleryIdOptionalDto } from 'types'
import { GenerateStringDecorator } from 'src/utils'

const DESC = '图库的唯一标识'

export class GalleryIdDto implements IGalleryIdDto {
  @decorate(GenerateStringDecorator(DESC, ID_EXAMPLE))
  galleryId: string
}

export class GalleryIdOptionalDto implements IGalleryIdOptionalDto {
  @decorate(GenerateStringDecorator(DESC, ID_EXAMPLE, true))
  galleryId?: GalleryIdDto['galleryId']
}
