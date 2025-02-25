import { ErrorCode } from 'types'
import { HttpStatus } from '@nestjs/common'

const _articleErrors: ErrorMessageCollection = {
  [ErrorCode.ARTICLE_NOT_EXISTS]: {
    httpStatus: HttpStatus.NOT_FOUND,
    message: '文章不存在',
  },

  [ErrorCode.ARTICLE_TYPE_NOT_EXISTS]: {
    httpStatus: HttpStatus.NOT_FOUND,
    message: '类型不存在',
  },
  [ErrorCode.ARTICLE_TYPE_IS_EXIST]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '分类已存在',
  },
  [ErrorCode.ARTICLE_TYPE_DEFAULT_DELETE]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '禁止删除默认分类',
  },
  [ErrorCode.ARTICLE_TYPE_HAS_ARTICLE]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '分类已绑定文章',
  },

  [ErrorCode.ARTICLE_TAG_NOT_EXISTS]: {
    httpStatus: HttpStatus.NOT_FOUND,
    message: '标签不存在',
  },
  [ErrorCode.ARTICLE_TAG_IS_EXIST]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '标签已存在',
  },
  [ErrorCode.ARTICLE_TAG_HAS_ARTICLE]: {
    httpStatus: HttpStatus.FORBIDDEN,
    message: '标签已绑定文章',
  },
}

export default _articleErrors
