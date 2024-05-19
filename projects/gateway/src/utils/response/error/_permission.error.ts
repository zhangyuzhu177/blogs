import { HttpStatus } from '@nestjs/common'
import { ErrorCode } from 'src/types/enum/error-code.enum'
import type { ErrorMessageCollection } from 'src/types/enum/error-code.enum'

const _permissionErrors: ErrorMessageCollection = {
  [ErrorCode.PERMISSION_DENIED]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '没有权限执行此操作',
  },
}

export default _permissionErrors
