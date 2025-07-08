import { HttpStatus } from '@nestjs/common'
import { ErrorCode } from 'types'

const _galleryErrors: ErrorMessageCollection = {
  [ErrorCode.GALLERY_NOT_EXISTS]: {
    httpStatus: HttpStatus.NOT_FOUND,
    message: '图库不存在',
  },
  [ErrorCode.GALLERY_TYPE_NOT_EXISTS]: {
    httpStatus: HttpStatus.NOT_FOUND,
    message: '图库类型不存在',
  },
  [ErrorCode.GALLERY_TYPE_IS_EXIST]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '图库类型已存在',
  },
  [ErrorCode.GALLERY_TYPE_HAS_GALLERY]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '图库类型已绑定图库',
  },
}

export default _galleryErrors
