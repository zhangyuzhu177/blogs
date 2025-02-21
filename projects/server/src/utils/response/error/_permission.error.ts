import { HttpStatus } from '@nestjs/common'
import { ErrorCode } from 'types'

const _permissionErrors: ErrorMessageCollection = {
  [ErrorCode.PERMISSION_DENIED]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '没有权限执行此操作',
  },
}

export default _permissionErrors
