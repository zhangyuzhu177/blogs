import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@Controller('gallery/type')
@ApiTags('GalleryType | 图库分类')
export class GalleryTypeController {
  constructor() {
  }
}
