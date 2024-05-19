import { ErrorCode } from 'src/types/enum/error-code.enum'
import { responseError } from '.'

interface IValidateError {
  property: string
  constraints: Record<string, string>
}

export function getExceptionFactory() {
  return (errs: IValidateError[]) => {
    return responseError(
      ErrorCode.COMMON_PARAMS_NOT_VALID,
      errs.reduce(
        (res: Array<string>, err) => [
          ...res,
          ...Object.keys(err.constraints).map(key => ({
            property: err.property,
            message: err.constraints[key],
          })),
        ],
        [],
      ),
    )
  }
}

export const responseParamsError = getExceptionFactory()
