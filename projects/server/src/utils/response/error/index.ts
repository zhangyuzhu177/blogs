import _authErrors from './_auth.error'
import _commonError from './_common.error'
import _permissionErrors from './_permission.error'
import _roleErrors from './_role.error'
import _userErrors from './_user.error'
import type { ErrorMessageCollection } from 'src/types/enum/error-code.enum'


export const errorMessages: ErrorMessageCollection = {
  ..._authErrors,
  ..._commonError,
  ..._permissionErrors,
  ..._roleErrors,
  ..._userErrors,
}
