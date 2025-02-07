import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { Injectable, SetMetadata, UseGuards, applyDecorators } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { UserService } from 'src/modules/user/user.service'
import { getReflectorValue } from 'src/utils'
import { ApiErrorResponse, responseError } from 'src/utils/response'
import { responseParamsError } from 'src/utils/response/validate-exception-factory'
import { CodeAction, codeActionDescriptions, ErrorCode } from 'types'

@Injectable()
export class EmailCodeSendableGuard implements CanActivate {
  constructor(
    public readonly reflector: Reflector,
    public readonly userSrv: UserService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: FakeTimersConfig = context.switchToHttp().getRequest()

    const registerRequiredActions = [
      CodeAction.LOGIN,
      CodeAction.CHANGE_PASSWORD,
      CodeAction.UNBIND_EMAIL,
    ]

    const notRegisterRequiredActions = [
      CodeAction.REGISTER,
      CodeAction.BIND_EMAIL,
    ]

    const emailExistsRequiredActions = [
      CodeAction.UNBIND_EMAIL,
    ]

    const emailNotExistsRequiredActions = [
      // 目前，允许用户在存在邮箱的情况下，绑定新邮箱，但是不允许用户在不存在邮箱的情况下，解绑邮箱
    ]

    const actionIn = getReflectorValue(this.reflector, context, 'actionIn', 'body')
    const actionKey = getReflectorValue(this.reflector, context, 'actionKey', 'action')
    const emailIn = getReflectorValue(this.reflector, context, 'emailIn', 'body')
    const emailKey = getReflectorValue(this.reflector, context, 'emailKey', 'email')

    const email = req?.[emailIn]?.[emailKey]
    const action = req?.[actionIn]?.[actionKey]

    if (!action) {
      responseParamsError([{
        property: actionKey,
        constraints: { [actionKey]: 'action is required' },
      }])
    }

    if (!email) {
      responseParamsError([{
        property: emailKey,
        constraints: { [emailKey]: 'email is required' },
      }])
    }

    if (!codeActionDescriptions[action]) {
      responseParamsError([{
        property: actionKey,
        constraints: { [actionKey]: 'action is invalid' },
      }])
    }

    const user = await this.userSrv.repo().findOne({ where: { email } })

    if (registerRequiredActions.includes(action) && !user)
      responseError(ErrorCode.USER_EMAIL_NOT_REGISTERED)

    if (registerRequiredActions.includes(action) && user && user.status)
      responseError(ErrorCode.USER_ACCOUNT_IS_DELETED)

    if (notRegisterRequiredActions.includes(action) && user)
      responseError(ErrorCode.USER_EMAIL_REGISTERED)

    if (user && emailExistsRequiredActions.includes(action) && !user.email)
      responseError(ErrorCode.USER_EMAIL_NOT_EXISTS)

    if (user && emailNotExistsRequiredActions.includes(action) && user.email)
      responseError(ErrorCode.USER_EMAIL_EXISTS)

    if (action === CodeAction.UNBIND_EMAIL && user?.email !== email)
      responseError(ErrorCode.USER_EMAIL_NOT_MATCHED)

    return true
  }
}

export function EmailCodeSendable(
  action?: { in?: 'body' | 'query'; key?: string },
  email?: { in?: 'body' | 'query'; key?: string },
) {
  return applyDecorators(
    UseGuards(EmailCodeSendableGuard),
    SetMetadata('actionIn', action?.in),
    SetMetadata('actionKey', action?.key),
    SetMetadata('emailIn', email?.in),
    SetMetadata('emailKey', email?.key),
    ApiErrorResponse(
      ErrorCode.USER_EMAIL_NOT_REGISTERED,
      ErrorCode.USER_ACCOUNT_IS_DELETED,
      ErrorCode.USER_EMAIL_REGISTERED,
      ErrorCode.USER_EMAIL_NOT_EXISTS,
      ErrorCode.USER_EMAIL_EXISTS,
      ErrorCode.USER_EMAIL_NOT_MATCHED,
    ),
  )
}
