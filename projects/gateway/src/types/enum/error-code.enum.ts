/**
 * 错误码
 */
export enum ErrorCode {
  /** 未知错误 */
  COMMON_UNEXPECTED_ERROR = 100001,
  /** 参数校验错误 */
  COMMON_PARAMS_NOT_VALID = 100002,
  /** 未定义的错误码 */
  COMMON_ERROR_CODE_NOT_DEFINED = 100003,
  /** 未实现的功能 */
  COMMON_NOT_IMPLEMENTED = 100004,
  /** 已废弃的功能 */
  COMMON_DEPRECATED = 100005,

  // ---- 身份验证相关错误码 ----
  /** 用户未登录 */
  AUTH_LOGIN_REQUIRED = 200001,
  /** 登录过期 */
  AUTH_LOGIN_EXPIRED = 200002,
  /** 密码错误 */
  AUTH_PASSWORD_NOT_MATCHED = 200003,
  /** 验证码错误 */
  AUTH_CODE_NOT_MATCHED = 200004,
  /** 用户密码不存在 */
  AUTH_PASSWORD_IS_NULL = 200005,

  // ---- 权限相关错误码 ----
  /** 没有相关权限 */
  PERMISSION_DENIED = 300001,

  // ---- 用户相关错误码 ----
  /** 用户不存在 */
  USER_NOT_FOUND = 400001,
  /** 用户已存在 */
  USER_EXISTED = 400002,
  /** 账号未注册 */
  USER_ACCOUNT_NOT_REGISTERED = 400003,
  /** 账号已注册 */
  USER_ACCOUNT_REGISTERED = 400004,
  /** 账号已被禁用 */
  USER_ACCOUNT_IS_DELETED = 400005,
  /** 邮箱已注册 */
  USER_EMAIL_REGISTERED = 400006,
  /** 邮箱未注册 */
  USER_EMAIL_NOT_REGISTERED = 400007,
  /** 用户未绑定邮箱 */
  USER_EMAIL_NOT_EXISTS = 400008,
  /** 用户邮箱已存在 */
  USER_EMAIL_EXISTS = 400009,
  /** 用户邮箱不匹配 */
  USER_EMAIL_NOT_MATCHED = 400010,
  /** 手机号已注册 */
  USER_PHONE_NUMBER_REGISTERED = 400011,
  /** 手机号未注册 */
  USER_PHONE_NUMBER_NOT_REGISTERED = 400012,
  /** 用户未绑定手机号 */
  USER_PHONE_NUMBER_NOT_EXISTS = 400013,
  /** 用户手机号已存在 */
  USER_PHONE_NUMBER_EXISTS = 400014,
  /** 用户手机号不匹配 */
  USER_PHONE_NUMBER_NOT_MATCHED = 400015,

  // ---- 管理角色相关错误码 ----
  /** 禁止删除root角色 */
  ROLE_DELETE_ROOT = 500001,
  /** 禁止更新root角色 */
  ROLE_UPDATE_ROOT = 500002,
  /** 角色已被分配 */
  ROLE_IN_USAGE = 500003,
  /** 角色名已存在 */
  ROLE_NAME_IS_EXIST = 500004,
}

export type ErrorMessageCollection = Partial<
  Record<
    ErrorCode,
    {
      httpStatus: import('@nestjs/common').HttpStatus
      message: string
      detail?: any
    }
  >
>
