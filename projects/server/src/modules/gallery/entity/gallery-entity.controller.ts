import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@Controller('gallery/entity')
@ApiTags('GalleryEntity | 图库')
export class GalleryEntityController {
  constructor() {
  }
}
