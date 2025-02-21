import { ErrorCode } from 'types'
import { HttpStatus } from '@nestjs/common'

const _authErrors: ErrorMessageCollection = {
  [ErrorCode.AUTH_LOGIN_REQUIRED]: {
    httpStatus: HttpStatus.UNAUTHORIZED,
    message: '请登录后重试',
  },
  [ErrorCode.AUTH_LOGIN_EXPIRED]: {
    httpStatus: HttpStatus.UNAUTHORIZED,
    message: '登录已过期',
  },
  [ErrorCode.AUTH_PASSWORD_NOT_MATCHED]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '密码错误',
  },
  [ErrorCode.AUTH_CODE_NOT_MATCHED]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '验证码错误',
  },
  [ErrorCode.AUTH_PASSWORD_IS_NULL]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '用户密码不存在',
  },
}

export default _authErrors
