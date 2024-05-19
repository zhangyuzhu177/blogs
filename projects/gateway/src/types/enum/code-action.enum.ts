/**
 * 发送验证码的目的
 */
export enum CodeAction {
  /** 注册 */
  REGISTER = 'register',
  /** 登录 */
  LOGIN = 'login',
  /** 修改密码 */
  CHANGE_PASSWORD = 'change-password',
  /** 绑定邮箱 */
  BIND_EMAIL = 'bind-email',
  /** 解绑邮箱 */
  UNBIND_EMAIL = 'unbind-email',
}

/**
 * 发送验证码目的的描述
 */
export const codeActionDescriptions: Record<CodeAction, string> = {
  [CodeAction.REGISTER]: '注册',
  [CodeAction.LOGIN]: '登录',
  [CodeAction.CHANGE_PASSWORD]: '修改密码',
  [CodeAction.BIND_EMAIL]: '绑定邮箱',
  [CodeAction.UNBIND_EMAIL]: '解绑邮箱',
}
