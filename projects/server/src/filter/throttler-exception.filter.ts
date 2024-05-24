import { Catch } from '@nestjs/common'
import { ThrottlerException } from '@nestjs/throttler'
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    const customError = {
      status: exception.getStatus(),
      message: '请求过于频繁，请稍后再试。',
    }

    response.status(customError.status)
    response.send(customError)
  }
}
