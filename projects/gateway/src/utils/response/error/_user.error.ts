import { HttpStatus } from '@nestjs/common'
import { ErrorCode } from 'src/types/enum/error-code.enum'
import type { ErrorMessageCollection } from 'src/types/enum/error-code.enum'

const _userErrors: ErrorMessageCollection = {
  [ErrorCode.USER_NOT_FOUND]: {
    httpStatus: HttpStatus.NOT_FOUND,
    message: '用户不存在',
  },
  [ErrorCode.USER_EXISTED]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '用户已存在',
  },
  [ErrorCode.USER_ACCOUNT_NOT_REGISTERED]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '账号未注册',
  },
  [ErrorCode.USER_ACCOUNT_REGISTERED]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '账号已注册',
  },
  [ErrorCode.USER_ACCOUNT_IS_DELETED]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '账号已被禁用',
  },
  [ErrorCode.USER_EMAIL_REGISTERED]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '邮箱已注册',
  },
  [ErrorCode.USER_EMAIL_NOT_REGISTERED]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '邮箱未注册',
  },
  [ErrorCode.USER_EMAIL_NOT_EXISTS]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '用户未绑定邮箱',
  },
  [ErrorCode.USER_EMAIL_EXISTS]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '用户邮箱已存在',
  },
  [ErrorCode.USER_EMAIL_NOT_MATCHED]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '用户邮箱不匹配',
  },
  [ErrorCode.USER_PHONE_NUMBER_REGISTERED]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '手机号已注册',
  },
  [ErrorCode.USER_PHONE_NUMBER_NOT_REGISTERED]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '手机号未注册',
  },
  [ErrorCode.USER_PHONE_NUMBER_NOT_EXISTS]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '用户未绑定手机号',
  },
  [ErrorCode.USER_PHONE_NUMBER_EXISTS]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '用户手机号已存在',
  },
  [ErrorCode.USER_PHONE_NUMBER_NOT_MATCHED]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: '用户手机号不匹配',
  },

}

export default _userErrors
