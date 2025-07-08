import { Mixin } from 'ts-mixer'
import type { IUpsertGalleryTypeBodyDto } from 'types'
import { DescOptionalDto, NameDto, OrderOptionalDto } from 'src/dto'

export class UpsertGalleryTypeBodyDto
  extends Mixin(
    NameDto,
    DescOptionalDto,
    OrderOptionalDto,
  )
  implements IUpsertGalleryTypeBodyDto { }
