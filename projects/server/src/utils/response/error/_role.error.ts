import { HttpStatus } from '@nestjs/common'
import { ErrorCode } from 'src/types/enum/error-code.enum'
import type { ErrorMessageCollection } from 'src/types/enum/error-code.enum'

const _roleErrors: ErrorMessageCollection = {
  [ErrorCode.ROLE_DELETE_ROOT]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '禁止删除root角色',
  },
  [ErrorCode.ROLE_UPDATE_ROOT]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '禁止更新root角色',
  },
  [ErrorCode.ROLE_IN_USAGE]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '角色已被分配',
  },
  [ErrorCode.ROLE_NAME_IS_EXIST]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '角色名已存在',
  },
}

export default _roleErrors
